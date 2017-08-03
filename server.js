var express = require('express');//express is the library imported to create web servers,handle http connections,listening //on ports
var morgan = require('morgan');//morgan is the library imported to help us output logs of the server, what requests coming to the server and how we //are responding
var path = require('path');

var app = express();
app.use(morgan('combined'));

//if this url is requested, i.e. if user uses a slash, this function will execute, function tells pick up index.html and send contents of that index.html to response object res
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


app.get('/article-one', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','article-one.html'));
});

//Here we are sending a text to response object, res, not contents of any file
app.get('/article-two', function (req, res) {
  res.send('This is article two');
});

app.get('/article-three', function (req, res) {
  res.send('This is article three');
});

//if style.css is requested,this function will execute,contents of style.css is sent to response( referenced as res here) object
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

//if the following url path /ui/madi.png is requested, this function will execute
app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
