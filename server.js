//The server.js file holds all the endpoints/requests for which the server must listen

var express = require('express');//express is the library imported to create web servers,handle http connections,listening //on ports
var morgan = require('morgan');//morgan is the library imported to help us output logs of the server, what requests coming to the server and how we //are responding,such lind of logs
var path = require('path');

var app = express();

//below line tells the server to use morgan module with combined predefined format for logging, there are other predefined //formats like common, dev, short, tiny
app.use(morgan('combined'));

var commentobj={comment:`
                <input type="text" id="commentinput" placeholder="Enter Your Comments"></input>
                <input type="submit" id="submit" value="Submit Your Comments"></input>
                <h4>Comments:-</h2>
                <div style="width: auto; height:30%; margin-left: auto; margin-right: auto;" align="left">
                <ul id="comments"></ul></div>`};

var obj={
    title:'An Example By Ritu',
    heading:'Example',
    content:`<p>
    Hi, this is just a demo to show usage of a variable object, the object is getting passed to a function 'exampleDemo', and that function is getting called in app.send(), and contents passed to response object res.
    </p>`
    
};

function exampleDemo(data,commentobj)
{
    var title=data.title;
    var heading=data.heading;
    var content=data.content;
    var comment=commentobj.comment;
    var htmlTemplate=`
    <html>
    <head><title>${title}</title>
    <link href="/ui/style.css" rel="stylesheet" />
    </head>
        <body>
            <div class="container">
            <div>
                <a href="/">Home</a>
            </div>
            <hr/>
            <div>
                <h1>${heading}</h1>
                ${content}
            </div>
            <div>${comment}</div>
            </div>
        </body>
</html>`;
return htmlTemplate;
}

//Here we are sending a text to response object, res, not contents of any file
app.get('/article-four', function (req, res) {
  res.send('This is article four, sending just plain text to response object as a String through res.send(...)');
});

app.get('/article-five', function (req, res) {
  res.send(exampleDemo(obj,commentobj));
});

var names=[];
//Create an endpoint for fetching name from input text
//app.get('/submit-name/:name',function(req,res){ this is one way to obtain name from request, another way is query parameters
    //var name=req.params.name;
app.get('/submit-name',function(req,res){//URL :/submit-name?name=somethingxxxxxxx
    var name=req.query.name;
    names.push(name);
    //JSON:Javascript Object Notation to convert the javascript object array to string because we can send everything to //response as string only, even integers are converted to strings before sending to response object
    res.send(JSON.stringify(names));
    
});

var counter=0;
app.get('/counter',function(req,res){counter++;res.send('Counter=>'+counter.toString())});

var articles={
 'article-one':{
    title:'SSH Facts By Rituparna Palchoudhury',
    heading:'Article One',
    namendate:'By--- Rituparna Palchoudhury,3rd August 2017',
    content:` 
    <p>
                    SSH was designed as a replacement for Telnet and for unsecured remote shell protocols such as the Berkeley rlogin, rsh, and rexec protocols. Those protocols send information, notably passwords, in plaintext, rendering them susceptible to interception and disclosure using packet analysis.The encryption used by SSH is intended to provide confidentiality and integrity of data over an unsecured network, such as the Internet, although files leaked by Edward Snowden indicate that the National Security Agency can sometimes decrypt SSH, allowing them to read the contents of SSH sessions.
                </p>
                <p>
                    SSH uses public-key cryptography to authenticate the remote computer and allow it to authenticate the user, if necessary.There are several ways to use SSH; 
                    <ol>
                  <li>  one is to use automatically generated public-private key pairs to simply encrypt a network connection, and then use password authentication to log on.
                  </li>
                  <li>
                      Another is to use a manually generated public-private key pair to perform the authentication, allowing users or programs to log in without having to specify a password. In this scenario, anyone can produce a matching pair of different keys (public and private). 
                  </li>
                    </ol>
                </p>
                <p>
                    SSH is typically used to log into a remote machine and execute commands, but it also supports tunneling, forwarding TCP ports and X11 connections; it can transfer files using the associated SSH file transfer (SFTP) or secure copy (SCP) protocols.SSH uses the client-server model.
                </p> `
    
},
 'article-two':{ 
    title:'HTML Facts By Rituparna Palchoudhury',
    heading:'Article Two',
    namendate:'By--- Rituparna Palchoudhury,4th August 2017',
    content:` 
    <p>
          Hypertext Markup Language (HTML) is the standard markup language for creating web pages and web applications. With Cascading Style Sheets (CSS) and JavaScript it forms a triad of cornerstone technologies for the World Wide Web. Web browsers receive HTML documents from a webserver or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
                </p>
                <p>
                  HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets. Tags such as <img /> and <input /> introduce content into the page directly. Others such as <p>...</p> surround and provide information about document text and may include other tags as sub-elements. Browsers do not display the HTML tags, but use them to interpret the content of the page.
                </p>`
     
 },
 'article-three':{ title:'JavaScript Facts By Rituparna Palchoudhury',
    heading:'Article Three',
    namendate:'By--- Rituparna Palchoudhury,5th August 2017',
    content:` 
    <p>
        JavaScript often abbreviated as JS, is a high-level, dynamic, weakly typed, object-based, multi-paradigm, and interpreted programming language. Alongside HTML and CSS, JavaScript is one of the three core technologies of World Wide Web content production. It is used to make webpages interactive and provide online programs, including video games.
                </p>
                <p>
                 The majority of websites employ it, and all modern web browsers support it without the need for plug-ins by means of a built-in JavaScript engine. Each of the many JavaScript engines represent a different implementation of JavaScript, all based on the ECMAScript specification, with some engines not supporting the spec fully, and with many engines supporting additional features beyond ECMA.
                </p>`
     
 }
};

function createTemplate(data,commentobj){
    var title=data.title;
    var heading=data.heading;
    var namendate=data.namendate;
    var content= data.content;
    var comment=commentobj.comment;
    
var htmlTemplate=`
<html>
    <head><title>${title}</title>
    <link href="/ui/style.css" rel="stylesheet" />
    </head>
        <body>
            <div class="container">
            <!--margin: 0 auto -> automatic margin from left and right -->
            <div>
                <a href="/">Home</a>
            </div>
            <hr/>
            <div>
                <h1>${heading}</h1>
                <h5>${namendate}</h5>
                
                ${content}
            </div>
            <div>${comment}</div>
            </div>
        </body>
</html>`;
return htmlTemplate;
}

//if this url is requested, i.e. if user uses a slash, this function will execute, function tells pick up index.html and send contents of that index.html to response object res
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


app.get('/:articleName', function (req, res) {
    //Initially articles contained articleOne, articleTwo, articleThree, these were changed to article-one, article-two,
    //article-three respectively,and to remove syntax error, 'article-one','article-two','article-three' respectively,
    //names were changed to match url in get method and articles[articleName], in get method, the colon after slash indicates 
    //articleName to be resolved at runtime, this feature is provided by express library.We took this approach to avoid
    //multiple app.get('url')
    //articleName=article-one
    //articles[articleName]={} content object for article-one
    var articleName=req.params.articleName;
  res.send(createTemplate(articles[articleName],commentobj));
});

/*//The below code section for mypage1 and mypage2 placed after '/:articleName' (declared above) is generating error
//Here we are sending a text to response object, res, not contents of any file
app.get('/mypage1', function (req, res) {
  res.send('This is article four, sending just plain text to response object as a String through res.send(...)');
});

app.get('/mypage2', function (req, res) {
  res.send(exampleDemo(obj));
});

*/
//if style.css is requested,this function will execute,contents of style.css is sent to response( referenced as res here) object
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

//Earlier the below app.get for main.js was not present, this was giving a 404 Http error message at runtimebecause in 
//index.html we made a call to main.js inside <script> tag, but the server side js did not handle it, like its handling for
//style.css or madi.png, all of which are being used in the index.html file
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

//if the following url path /ui/madi.png is requested, this function will execute
/*app.get('../flower.jpg', function (req, res) {
  res.sendFile('flower.jpg');
});
*/

app.get('/ui/flower.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'flower.jpg'));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
