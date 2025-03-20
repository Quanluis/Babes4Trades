const express = require('express');
const path = require('path');

const app = express();
const router = express.Router();

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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


// app.use(express.static('public'))

// import fs from "fs";

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/plain");
//   res.end("Hello World\n");
// });

// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}/`);
// });


// http.createServer(function (req, res) {
//   var q = url.parse(req.url, true);
//   var filename = "." + q.pathname;
//   fs.readFile(filename, function(err, data) {
//     if (err) {
//       res.writeHead(404, {'Content-Type': 'index.html'});
//       return res.end("404 Not Found");
//     } 
//     res.writeHead(200, {'Content-Type': 'about/html'});
//     res.write(data);
//     return res.end();
//   });
// }).listen(8080); 


// require('fs').promises;

// const requestListener = function (req, res) {
//     fs.readFile(__dirname + "/index.html")
//         .then(contents => {
//             res.setHeader("Content-Type", "text/html");
//             res.writeHead(200);
//             res.end(contents);
//         })
// };

// requestListener();


// This works below

// app.js
// const express = require('express');
// const path = require('path');

// const app = express();
// const router = express.Router();

// // Serve static files (CSS, JS, Images, etc.)
// app.use(express.static(path.join(__dirname, 'public')));

// // Routes
// router.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../Babes4Trades/pages/signUp.html'));
// });

// router.get('/main.js', (req, res) => {
//   res.sendFile(path.join(__dirname, '../babes4trades/main.js'));
// });

// router.get('/about', (req, res) => {
//   res.sendFile(path.join(__dirname, 'about.html'));
// });

// router.get('/sitemap', (req, res) => {
//   res.sendFile(path.join(__dirname, 'sitemap.html'));
// });

// // Apply the router
// app.use('/', router);

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
