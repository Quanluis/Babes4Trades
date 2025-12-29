require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const fs = require("fs");
const { type } = require("os");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();

// const User = require("./models/User");

app.use(cors());



// ✅ Serve Static Files BEFORE Routes
// app.use(express.static(path.join(__dirname, "/")));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "pages")));

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ User Schema & Model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  discordId: { type: String, unique: true, sparse: true, required: false },
  verified: { type: Boolean, default: false }, // Verfication status
  paidSubscription: { type: Boolean, default: false }, // Paid subscription status
  subscriptionId: { type: String },
  tier: {type: String, enum: ["basic", "premium", null], default: null},
});


const User = mongoose.model("User", UserSchema);

// const GallerySchema = new mongoose.Schema(
//   {
//     title: String,
//     url: { type: String, required: true }, // Bunny.net URL
//     subscriptionLevel: {
//       type: String,
//       enum: ["free", "premium"],
//       default: "free"
//     },
//     uploadedAt: { type: Date, default: Date.now },
//   },
//   { collection: "gallery", timestamps: false } // match your existing collection
// );

// const Gallery = mongoose.model("Gallery", GallerySchema);


const GallerySchema2 = new mongoose.Schema(
  {
    title: String,
    url: { type: String, required: true }, // Bunny.net URL
    subscriptionLevel: {
      type: String,
      enum: ["free", "premium"],
      default: "free"
    },
    uploadedAt: { type: Date, default: Date.now },
  },
  { collection: "galleries", timestamps: false } // match your existing collection
);

const Galleries = mongoose.model("Galleries", GallerySchema2);





// 🔐 Middleware 1: Verify JWT (Authentication)
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    console.log("❌ No token found");
    return res.redirect("/pricing.html");
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload for later
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.redirect("/pricing.html");
  }
}

// 💳 Middleware 2: Check Paid Subscription in MongoDB
async function requirePaid(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log("❌ User not found");
      return res.redirect("/pricing.html");
    }
    if (!user.paidSubscription) {
      console.log("⚠️ User is not a paid subscriber");
      return res.redirect("/pricing.html");
    }
    console.log("✅ Paid user:", user.email);
    next();
  } catch (err) {
    console.error("Error verifying paid user:", err.message);
    res.redirect("/pricing.html");
  }
}

app.get("/my-courses", requireAuth, requirePaid, (req, res) => {
  const videoPage = path.join(__dirname, "pages", "video.html");
  res.sendFile(videoPage);
});


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Allow max 5 login attempts per IP change to 5 later
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable legacy headers
});


const authOptional = async (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return next();

  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    // Lean lookup; if token carries email, you could also find by email
    const user = await User.findById(payload.userId).lean();
    req.user = user || null;
  } catch (_) {
    req.user = null;
  }
  next();
};

// ✅ GET galleries (supports ?model=kara)
app.get('/api/galleries', authOptional, async (req, res) => {
  // ✅ Only premium tier can see premium items
  const canSeePremium = req.user?.tier === "premium";

  const model = String(req.query.model || "").trim().toLowerCase();

  const query = {};
  if (model) query.modelSlug = model; // requires modelSlug on docs

  if (!canSeePremium) {
    query.subscriptionLevel = { $ne: 'premium' };
  }

  // ✅ Use ONE mongoose model here (pick the correct one)
  const docs = await Galleries.find(query).sort({ uploadedAt: -1 }).lean();

  const items = docs.map(d => ({
    title: d.title,
    bunnyUrl: d.url, // your DB field is url
    thumbnailUrl: null,
    isPremium: String(d.subscriptionLevel || "").toLowerCase() === 'premium',
    tags: [],
    createdAt: d.uploadedAt
  }));

  res.json({ canSeePremium, items });
});

// SINGLE Stripe Webhook (keep ABOVE app.use(express.json()))
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {

   // ✅ Tier mapping by Price ID (recommended)
    const tierFromPriceId = (priceId) => {
      if (!priceId) return null;
      if (priceId === process.env.STRIPE_PRICE_PREMIUM) return "premium";
      if (priceId === process.env.STRIPE_PRICE_BASIC) return "basic";
      return "basic"; // fallback
    };

    // small helpers
    const markPaid = async ({ email, customerId, subscriptionId, tier }) => {
      let user = null;
      if (customerId) user = await User.findOne({ stripeCustomerId: customerId });
      if (!user && email) user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

      if (user) {
        user.paidSubscription = true;
        if (subscriptionId) user.subscriptionId = subscriptionId;
        if (customerId) user.stripeCustomerId = customerId;

        if(typeof tier === "string") user.tier = tier;

        await user.save();
      }
    };

    const markUnpaid = async ({ email, customerId, subscriptionId }) => {
      let user = null;
      if (subscriptionId) user = await User.findOne({ subscriptionId });
      if (!user && customerId) user = await User.findOne({ stripeCustomerId: customerId });
      if (!user && email) user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

      if (user) {

        user.paidSubscription = false;

        // keep stripeCustomerId for future, but clear subId
        user.tier = null;

        if (subscriptionId) user.subscriptionId = null;
        await user.save();
      }
    };

    switch (event.type) {
      // User just completed checkout (subscription mode)
      case 'checkout.session.completed': {
        const s = event.data.object;

        let tier = null;

        if (s.subscription) {
        const sub = await stripe.subscriptions.retrieve(s.subscription, {
          expand: ["items.data.price"],
        });
        const priceId = sub.items.data[0]?.price?.id;

        tier =
            priceId === process.env.STRIPE_PRICE_PREMIUM ? "premium" :
            priceId === process.env.STRIPE_PRICE_BASIC ? "basic" :
            "basic";
        }

        await markPaid({
          email: s.customer_email || s.customer_details?.email,
          customerId: s.customer,
          subscriptionId: s.subscription,
          tier,
        });
        break;
      }

      // Subscription lifecycle changes (covers resume/pause/cancel/past_due/unpaid)
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const status = sub.status; // 'active' | 'trialing' | 'past_due' | 'unpaid' | 'canceled' | 'paused' | etc.
        const payload = {
          email: sub?.customer_email, // usually null here
          customerId: sub.customer,
          subscriptionId: sub.id,
          tier: sub.tier,
        };

        if (['active', 'trialing'].includes(status)) {
          await markPaid(payload);
        } else if (['canceled', 'unpaid', 'paused', 'incomplete_expired', 'past_due'].includes(status)) {
          // you can decide if 'past_due' stays paid or not; most teams flip to false
          await markUnpaid(payload);
        }
        break;
      }

      // Explicit deletion (cancel)
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await markUnpaid({
          customerId: sub.customer,
          subscriptionId: sub.id,
        });
        break;
      }

      // Payment failed (optional hard-stop)
      case 'invoice.payment_failed': {
        const inv = event.data.object;
        await markUnpaid({
          customerId: inv.customer,
          subscriptionId: inv.subscription,
        });
        break;
      }

      default:
        // ignore other events
        break;
    }

    // Always 200 so Stripe stops retrying
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Webhook handler error:', err);
    // still return 200 to stop retries; log and investigate
    res.sendStatus(200);
  }
});


app.post("/role-update", async (req, res) => {
  const { discordId, paid } = req.body;

  console.log("🔹 Role update requested for:", discordId, "| Paid:", paid);

  if (!discordId) return res.status(400).send("No discordId provided");

  try {
    // ✅ Ensure bot is ready
    if (!client.readyAt) {
      console.error("⚠️ Bot not ready yet");
      return res.status(503).send("Bot not ready yet");
    }

    // ✅ Fetch guild
    const guild =
      client.guilds.cache.get(process.env.DISCORD_GUILD_ID) ||
      (await client.guilds.fetch(process.env.DISCORD_GUILD_ID));

    if (!guild) {
      console.error("❌ Guild not found. Check DISCORD_GUILD_ID");
      return res.status(404).send("Guild not found");
    }

    // ✅ Fetch role
    await guild.roles.fetch();
    const role = guild.roles.cache.get(process.env.PREMIUM_ROLE_ID);
    if (!role) {
      console.error("❌ Premium role not found. Check PREMIUM_ROLE_ID");
      return res.status(404).send("Premium role not found");
    }

    // ✅ Fetch member
    let member;
    try {
      member = await guild.members.fetch(discordId);
    } catch (err) {
      console.error("❌ Could not fetch member:", err.message);
      return res.status(404).send("Member not found in guild");
    }

    console.log("✅ Member found in server:", member.user.tag);

    // ✅ Assign or remove role
    if (paid) {
      await member.roles.add(role);
      console.log(`🎉 Added premium role to ${discordId}`);
    } else {
      await member.roles.remove(role);
      console.log(`🎉 Removed premium role from ${discordId}`);
    }

    res.send("Role updated");
  } catch (err) {
    console.error("❌ Role update failed:", err);
    res.status(500).send("Error updating role");
  }
});

app.use(express.json());

app.get("/check-sub-status", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.send("No email provided");

  const user = await User.findOne({ email });
  if (!user) return res.send("No user found");

  res.send(`Paid Subscription: ${user.paidSubscription}`);
});

// Create email transporter

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // My email
    pass: process.env.EMAIL_PASS, // My password
  },
  tls: {
    rejectUnauthorized: false, // ✅ Allow self-signed certs
  },
});

// ✅ Registration Endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { email, username, password, discordId } = req.body;

    console.log("📩 Received by server:", {
      email,
      username,
      password,
      discordId,
    });

    if (!email || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      verified: false,
      // discordId,
      // Can store raw string or resolve to ID later
    }); // Not yet verified

    if (discordId && discordId.trim() !== "") {
    newUser.discordId = discordId.trim();
}

    await newUser.save();

    // Generate verification token (Expires in 1 hour)

    const token = JWT.sign({ email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Create verification link
    const verificationLink = `http://localhost:5000/api/verify/${token}`;

    // Send email

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email - Babes4Trades",
      html: `<p>Click the link below to verify your email:</p>
                   <a href="${verificationLink}">Verify Email</a>
                   <p>This link expires in 1 hour.</p>`,
    });

    res.status(201).json({
      message:
        "User registered successfully! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Verify token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Find user and update verification status
    const user = await User.findOneAndUpdate(
      { email },
      { verified: true },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        error: "Verification link has expired. Please request a new one.",
      });
    }
    res.status(400).json({ error: "Invalid verification token." });
  }
});

//  ====== User actions  241-472  =======

app.post("/api/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check if the account is verfied

    if (!user.verified)
      return res.status(400).json({ error: "Please verify your email." });

    // ✅ Compare the provided password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password BRUH!" });
    }

    const token = JWT.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" } // Default to 1 hour if not set
    );

    res.json({
      message: "Login successful! BRUH",
      token,
      user: {
        email: user.email,
        username: user.username,
        paidSubscription: user.paidSubscription,
        tier: user.tier
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Request Password Reset

app.post("/api/request-password-reset", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      message: "If that email exist, a reset link has been sent to that email.",
    });
  }

  const token = JWT.sign(
    { userId: user._id },
    process.env.RESET_PASSWORD_SECRET,
    { expiresIn: "1h" }
  );

  const resetLink = `http://localhost:5000/reset-password.html?token=${token}`;

  // send the email

  await transporter.sendMail({
    from: process.env.RESET_PASSWORD_SECRET,
    to: user.email,
    subject: "Reset your email - Babes4Trades",
    html: `<p>Click the link below to reset your email:</p>
                 <a href="${resetLink}">Reset Email</a>
                 <p>This link expires in 1 hour.</p>`,
  });

  res.json({
    message: "If that email exist, a reset link has been sent to that email.",
  });
});

app.post("/api/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    console.log("Received token:", token);

    const payload = JWT.verify(token, process.env.RESET_PASSWORD_SECRET);
    console.log("Decoded payload:", payload);

    const user = await User.findById(payload.userId);
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid token or user does not exist" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Token error:", error);
    return res
      .status(400)
      .json({ error: error.message || "Invalid or expired token BRO" });
  }
});

app.post("/api/contact-us", async (req, res) => {
  try {
    const { email, subject, text } = req.body;

    console.log("Contact Form Submission", req.body);

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: subject,
      html: `${text}`,
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email Send Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/checkout", async (req, res) => {
  try {
    const { user, priceId } = req.body || {};

    if (!user || !priceId) {
      return res.status(400).json({ error: "Missing user or price ID" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5000/paymentsuccess.html",
      cancel_url: "http://localhost:5000/paymentcancelled.html", // ✅ use full URLs
      customer_email: user.email,
    });

    // ✅ SEND the session URL (do NOT redirect)
    res.send(session.url);
  } catch (error) {
    console.error("❌ Stripe checkout error:", error);
    res.status(500).send("Failed to start checkout.");
  }
});

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

app.post("/api/cancel-subscription", authenticate, async (req, res) => {
  try {
    const email = req.body.email;
    console.log("🔹 Cancel-subscription request for:", email);

    const user = await User.findOne({ email });
    console.log(
      "🔹 User found?",
      !!user,
      " | SubscriptionId:",
      user?.subscriptionId
    );

    if (!user || !user.subscriptionId) {
      console.log("⚠️ No active subscription for:", email);
      return res.status(400).json({ message: "No active subscription found." });
    }

    // ✅ Cancel subscription in Stripe
    try {
      console.log(
        "🔹 Attempting to cancel Stripe subscription:",
        user.subscriptionId
      );
      await stripe.subscriptions.cancel(user.subscriptionId);
      console.log("✅ Stripe subscription canceled");
    } catch (stripeError) {
      console.error("❌ Stripe cancellation error:", stripeError);
      return res
        .status(500)
        .json({ message: "Stripe subscription cancellation failed." });
    }

    // ✅ Update MongoDB
    try {
      user.paidSubscription = false;
      user.subscriptionId = null;
      user.tier = null; 
      await user.save();
      console.log(`✅ Subscription canceled and DB updated for ${user.email}`);
    } catch (dbError) {
      console.error("❌ MongoDB update error:", dbError);
      return res.status(500).json({ message: "Database update failed." });
    }

    res.json({ message: "Subscription canceled successfully." });
  } catch (err) {
    console.error("❌ Unsubscribe endpoint error:", err.message || err);
    res
      .status(500)
      .json({ message: "Something went wrong while unsubscribing." });
  }
});

// This will delete the user's account

app.post("/delete-account", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    if (user.subscriptionId) {
      await stripe.subscriptions.cancel(user.subscriptionId);
      console.log("✅ Stripe subscription canceled");
    }

    await User.deleteOne({ email });
    res.json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("❌ Account deletion error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// End of user actions

// app.get("/api/user/:email", async (req, res) => {
//   try {
//     const user = await User.findOne({
//       email: new RegExp(`^${req.params.email}$`, "i"),
//     });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json({
//       username: user.username,
//       email: user.email,
//       paidSubscription: user.paidSubscription,
//       discordId: user.discordId,
//       tier: user.tier,
//     });
//   } catch (error) {
//     console.error("User fetch error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.get("/api/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: new RegExp(`^${req.params.email}$`, "i"),
    }).select("username email paidSubscription discordId tier");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      username: user.username,
      email: user.email,
      paidSubscription: user.paidSubscription,
      discordId: user.discordId,
      tier: user.tier,
    });
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/api/user/discord", async (req, res) => {
  const { email, discordId } = req.body;

  try {
    const updated = await User.findOneAndUpdate(
      { email },
      { discordId: discordId?.trim() || null },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "Discord ID updated successfully." });
  } catch (error) {
    console.error("❌ Error updating Discord:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("🔔 Webhook event type:", event.type);

    // ------------------------------------------------------
    // ✅ Handle new subscription (Stripe checkout success)
    // ------------------------------------------------------
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_email;
      const subscriptionId = session.subscription;
      let tier = "basic";

      if (!email || !subscriptionId) {
        console.log("❌ Missing email or subscription ID");
        return res.status(400).send("Missing email or subscription ID");
      }

      try {
        // ✅ Update MongoDB
        const user = await User.findOneAndUpdate(
          { email },
          {
            paidSubscription: true,
            subscriptionId,
            tier,
          },
          { new: true }
        );

        if (user) {
          console.log(`✅ Subscription activated for ${user.email}`);

          // 🔹 Notify bot if Discord ID exists
          if (user.discordId) {
            const payload = { discordId: user.discordId, paid: true };
            console.log("🔹 Preparing to notify bot with:", payload);

            try {
              const botResponse = await fetch(
                "http://localhost:4000/role-update",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                }
              );

              const botText = await botResponse.text();
              console.log(
                `🔹 Bot responded with: ${botResponse.status} - ${botText}`
              );
            } catch (err) {
              console.error("❌ Failed to notify Discord bot:", err);
            }
          } else {
            console.log(`⚠️ User ${user.email} has no discordId in DB`);
          }
        } else {
          console.log(`⚠️ No user found for ${email}`);
        }

        res.status(200).send("Webhook processed");
      } catch (err) {
        console.error("❌ Database update error:", err);
        res.status(500).send("Server error");
      }

      return; // ✅ Exit after processing
    }

    // ------------------------------------------------------
    // ✅ Handle subscription cancellation (unsubscribe)
    // ------------------------------------------------------
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const subscriptionId = subscription.id;

      console.log("📛 Canceling subscription:", subscriptionId);

      try {
        // ✅ Update MongoDB
        const user = await User.findOneAndUpdate(
          { subscriptionId },
          {
            paidSubscription: false,
            subscriptionId: null, // clear old sub ID
            tier: null,
          },
          { new: true }
        );

        if (user) {
          console.log(`✅ Subscription canceled for ${user.email}`);

          // 🔹 Notify bot if Discord ID exists
          if (user.discordId) {
            const payload = { discordId: user.discordId, paid: false };
            console.log("🔹 Preparing to notify bot with:", payload);

            try {
              const botResponse = await fetch(
                "http://localhost:4000/role-update",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                }
              );

              const botText = await botResponse.text();
              console.log(
                `🔹 Bot responded with: ${botResponse.status} - ${botText}`
              );
            } catch (err) {
              console.error("❌ Failed to notify Discord bot:", err);
            }
          } else {
            console.log(`⚠️ User ${user.email} has no discordId in DB`);
          }
        } else {
          console.log(
            `⚠️ No user found for canceled subscription ID: ${subscriptionId}`
          );
        }

        res.status(200).send("Webhook processed");
      } catch (err) {
        console.error("❌ Database update error during cancellation:", err);
        res.status(500).send("Server error");
      }

      return; // ✅ Exit after processing
    }

    // ------------------------------------------------------
    // ✅ Unhandled event
    // ------------------------------------------------------
    res.status(200).send("Event type not handled");
  }
);

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("🔔 Webhook event type:", event.type);

    // ------------------------------------------------------
    // ✅ Handle subscription cancellation (unsubscribe)
    // ------------------------------------------------------
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const subscriptionId = subscription.id;

      console.log("📛 Canceling subscription:", subscriptionId);

      try {
        // ✅ Update MongoDB
        const user = await User.findOneAndUpdate(
          { subscriptionId },
          {
            paidSubscription: false,
            subscriptionId: null, // Clean up old subscription ID
          },
          { new: true }
        );

        if (user) {
          console.log(`✅ Subscription canceled for ${user.email}`);

          // 🔹 Notify Discord bot if user has discordId
          if (user.discordId) {
            const payload = {
              discordId: user.discordId,
              paid: false, // unsub
            };
            console.log("🔹 Preparing to notify bot with:", payload);

            try {
              const botResponse = await fetch(
                "http://localhost:4000/role-update",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                }
              );

              const botText = await botResponse.text();
              console.log(
                `🔹 Bot responded with: ${botResponse.status} - ${botText}`
              );
            } catch (err) {
              console.error("❌ Failed to notify Discord bot:", err);
            }
          } else {
            console.log(`⚠️ User ${user.email} has no discordId in DB`);
          }
        } else {
          console.log(
            `⚠️ No user found for canceled subscription ID: ${subscriptionId}`
          );
        }
      } catch (err) {
        console.error("❌ Database update error during cancellation:", err);
        return res.status(500).send("Server error");
      }
    }

    // ------------------------------------------------------
    // ✅ Always respond 200 to Stripe so it stops retrying
    // ------------------------------------------------------
    res.status(200).send("Webhook processed");
  }
);

// ✅ Serve HTML Pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/about", (req, res) =>
  res.sendFile(path.join(__dirname, "pages", "about.html"))
);
app.get("/contact", (req, res) =>
  res.sendFile(path.join(__dirname, "pages", "contact.html"))
);
app.get("/signUp", (req, res) =>
  res.sendFile(path.join(__dirname, "pages", "signUp.html"))
);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
