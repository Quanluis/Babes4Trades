require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");
// require('./main.js');


const app = express();
const router = express.Router();
app.use(cors());

app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model("User", UserSchema);


// Registration Endpoint
app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});


// fetch("/api/register", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(formData),
// })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log("Success:", data);
//     alert("Registration successful!");
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//     alert("There was an error with your registration.");
//   });

// const authRoutes = require("/main.js");
// app.use("./main.js", authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// app.use(express.static('public', {
//   setHeaders: (res, path) => {
//       if (path.endsWith('.css')) {
//           res.setHeader('Content-Type', 'text/css');
//       }
//   }
// }));

// Serve static files (CSS, JS, Images, etc.)
app.use(express.static(path.join(__dirname, '/')))
app.use(express.static(path.join(__dirname, 'public'))); // Serving static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'pages')));  // Serves static files from the 'Pages' folder

// Routes for HTML pages
router.get('/', (req, res) => {
  // Serve the main index.html from the root directory
  res.sendFile(path.join(__dirname, 'index.html'));
});

router.get('/about', (req, res) => {
  // Serve the about.html from the 'pages' folder
  res.sendFile(path.join(__dirname, 'pages', 'about.html'));
});

router.get('/contact', (req, res) => {
  // Serve the sitemap.html from the 'pages' folder
  res.sendFile(path.join(__dirname, 'pages', 'contact.html'));
});

// Additional route for other pages in the 'pages' folder
router.get('/course', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'course.html'));
});

router.get('/faq', (req, res) => {
  // Serve the main index.html from the root directory
  res.sendFile(path.join(__dirname, 'pages', 'faq.html'));
});

router.get('/forgotPass', (req, res) => {
  // Serve the about.html from the 'pages' folder
  res.sendFile(path.join(__dirname, 'pages', 'forgotPass.html'));
});

router.get('/meetTheGirls', (req, res) => {
  // Serve the sitemap.html from the 'pages' folder
  res.sendFile(path.join(__dirname, 'pages', 'meetTheGirls.html'));
});

// Additional route for other pages in the 'pages' folder
router.get('/pricing', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'pricing.html'));
});

router.get('/signIn', (req, res) => {
  // Serve the sitemap.html from the 'pages' folder
  res.sendFile(path.join(__dirname, 'pages', 'signIn.html'));
});

// Additional route for other pages in the 'pages' folder
router.get('/signUp', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'signUp.html'));
});

router.get('/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.js'));
});

router.get('/Lobster-Regular', (req, res) => {
  res.sendFile(path.join(__dirname, '/Fonts/Lobster/Lobster-Regular.ttf'));
});


// Apply the router
app.use('/', router);

