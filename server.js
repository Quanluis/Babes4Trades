require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { type } = require("os");
const { error } = require("console");
const { hash } = require("crypto");
const { allowedNodeEnvironmentFlags } = require("process");
const app = express();

app.use(cors());

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("🔥 Webhook triggered");

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
    console.log("📦 Full session payload:", event.data.object);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_email;
      const subscriptionId = session.subscription; //

      if (!email || !subscriptionId) {
        console.log("❌ No customer_email in session!");
        return res.status(400).send("No email provided in session.");
      }

      console.log("📧 Updating paidSubscription for:", email);

      const updatedUser = await User.findOneAndUpdate(
        { email: new RegExp(`^${email}$`, "i") },
        { paidSubscription: true,
          subscriptionId: subscriptionId
        },
        { new: true }
      );

      if (!updatedUser) {
        console.log("⚠️ No matching user found in DB for email:", email);
        const users = await User.find(); // debug all users
        console.log(
          "🧠 All user emails in DB:",
          users.map((u) => u.email)
        );
      } else {
        console.log("✅ User updated:", updatedUser.email);
      }
    }

    res.status(200).send("Webhook received");
  }
);

app.use(express.json());

app.get("/check-sub-status", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.send("No email provided");

  const user = await User.findOne({ email });
  if (!user) return res.send("No user found");

  res.send(`Paid Subscription: ${user.paidSubscription}`);
});

// ✅ Serve Static Files BEFORE Routes
app.use(express.static(path.join(__dirname, "/")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "pages")));

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
  verified: { type: Boolean, default: false }, // Verfication status
  paidSubscription: { type: Boolean, default: false }, // Paid subscription status
  subscriptionId: {type: String}

});
const User = mongoose.model("User", UserSchema);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Allow max 5 login attempts per IP change to 5 later
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable legacy headers
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
    const { email, username, password } = req.body;
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
      verfied: false,
    }); // Not yet verified

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

app.get("/api/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ hashedPassword: user.password });
  } catch (error) {
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
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } // Default to 1 hour if not set
    );

    res.json({
      message: "Login successful! BRUH",
      token,
      user: {
        email: user.email,
        username: user.username,
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
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      success_url: "http://localhost:5000/pages/paymentsuccess.html",
      cancel_url: "http://localhost:5000/pages/paymentcancelled.html", // ✅ use full URLs
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

app.post("/api/unsubscribe", authenticate, async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email });

    if (!user || !user.subscriptionId) {
      return res
        .status(400)
        .json({ message: "No active subscription found." });
    }

    await stripe.subscriptions.del(user.subscriptionId);

    user.paidSubscription = false;
    user.subscriptionId = null;
    await user.save();

    console.log(`✅ Subscription canceled for ${user.email}`);
    res.json({ message: "Subscription canceled successfully." });
  } catch (err) {
    console.error("❌ Unsubscribe error:", err);
    res.status(500).json({ message: "Something went wrong." });
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
      await stripe.subscriptions.del(user.subscriptionId);
      console.log('✅ Stripe subscription canceled');
    }

    await User.deleteOne({ email });
    res.json({ message: "Account deleted successfully." });

  } catch (error) {
    console.error("❌ Account deletion error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});


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
