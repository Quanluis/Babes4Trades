require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve Static Files BEFORE Routes
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.static(path.join(__dirname, 'pages'))); 

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ User Schema & Model
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow max 5 login attempts per IP
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable legacy headers
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
        const newUser = new User({ email, username, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!", hashedPassword });

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

app.post("/api/login", loginLimiter , async (req, res) => {
  try {
      const { email, password } = req.body;

      // ✅ Check if user exists in the database
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ error: "Invalid email or password" });
      }

      // ✅ Compare the provided password with the hashed password in DB
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ error: "Invalid email or password" });
      }

      res.json({ message: "Login successful!" });

  } catch (error) {
      console.error("❌ Login Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Serve HTML Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'about.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'contact.html')));
app.get('/signUp', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'signUp.html')));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

