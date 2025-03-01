// import http from "http";

// import 'bootstrap';

// const express = require('express');

// let http = require('http');
// let fs = require('fs');
// let port = 8080;

//     const server = http.createServer((request, response) => {
//         response.writeHead(200, {'Content-Type': 'text/html'});
//         fs.readFile('index.html', null, function(error, data) {
//           if (error) {
//             response.writeHead(404);
//             respone.write('Whoops! File not found!');
//           } else {
//             response.write(data);
//           }
//           response.end();
//         });
//       });

// server.listen(port, () => {
//   console.log(`Server is running on port number::${port}`);
// });


// app.js
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
 
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});
 
router.get('./',function(req,res){
  res.sendFile(path.join(__dirname+'about.html'));
});
 
router.get('/sitemap',function(req,res){
  res.sendFile(path.join(__dirname+'/sitemap.html'));
});
 
//add the router
app.use('/', router);
app.listen(process.env.port || 3000);
 
console.log('Running at Port 3000');

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
