//The server.js file holds all the endpoints/requests for which the server must listen

var express = require('express');//express is the library imported to create web servers,handle http connections,listening //on ports
var morgan = require('morgan');//morgan is the library imported to help us output logs of the server, what requests coming to the server and how we //are responding,such lind of logs
var path = require('path');

//For connecting to database, you need to do npm i pg and make sure node-postgres is installed at minimum 6.0.0.
var Pool=require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');

var config={
    user:'rpalchoudhury50',
    database:'rpalchoudhury50',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};

var app = express();
//We need to tell our express app that "for every request, in case you see content type is jason, load the json content in the req.body variable.
app.use(bodyParser.json());

//create the pool somewhere globally so its lifetime
//lasts for as long as your app is running
var pool=new Pool(config);
app.get('/test-db',function(req,res){
    //Make a select request
    //Return a response with the results
    pool.query('SELECT * FROM article ',function(err,result){
        if(err){  res.status(500).send(err.toString());  }
        else{  res.send(JSON.stringify(result.rows));   }//you can display results also instead of result.rows
    });
});


//below line tells the server to use morgan module with combined predefined format for logging, there are other predefined //formats like common, dev, short, tiny
app.use(morgan('combined'));

//hashing, security
function hash(input, salt)
{
    //how do we create a hash?by using crypto.pbkdf2Sync(password, salt, iterations, keylen, digest),Provides a synchronous//Password-Based Key Derivation Function (PBKDF2) implementation. A selected HMAC digest algorithm specified by digest //is applied to derive a key of the requested byte length (keylen, which is a number) from the password(string), salt//(string) and iterations(number).digest is a string, denoting the algorithm. The below code is going to append the //salt to the input string(which we are entering at runtime) and use sha512 digest algorithm 10000 times and finally //arriving at a key of 512 bytes length.Each iteration is performed on the output obtained from previous step.
    var hashed=crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    //return hashed.toString('hex');
    return ["pbkdf2Sync","10000",salt,hashed.toString('hex')].join('$');
}

app.get('/hash/:input',function(req,res){
    var hashedString=hash(req.params.input,'this-is-some-random-salt-string');
    res.send(hashedString);
});

//create an entry in the user table, for that we require a hashed password, username, email, name.Since this is a post request, //we can't just go to the browser and type in url/create-user, it would throw an error, we make a post request //XMLHttpRequest object for this endpoint API in main.js, like we did for counter or submit name, but instead of get we'll //make a post request. If we want to just test this API out, we use a tool called curl. We need to tell express that we are //sending content type json in request using curl so that json object values of the body are extracted using body-parser.For that //we specify a header -H 'Content-Type: application/json' in curl request
app.post('/create-user',function(req,res){
    //We are assuming its a JSON request, if its a JSON request, we have to tell our express framework to look for these keys//(username, password, name, email) inside the request body, and this request body is going to be a JSON, for that we //need the body-parser which is an express library, that we import at the beginning.
    var dbUserName=req.body.username;
    var dbName=req.body.name;
    var dbEmail=req.body.email;
    var password=req.body.password;
    var salt=crypto.randomBytes(128).toString('hex');
    var dbPassword=hash(password,salt);
    pool.query('INSERT INTO "user" (username, name, email, password) VALUES ($1,$2,$3,$4)',[dbUserName, dbName, dbEmail, dbPassword],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send("User successfully created:"+username);
        }
    });
});

//login using the data entered into the database, by fetching from the database
app.post('/login',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    pool.query('SELECT * FROM "user" WHERE username=$1',[username],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else
        { 
            if(result.rows.length===0) { res.status(403).send("Username/Password is invalid"); } 
            else
           { //Match the password
           var dbpasswrd=result.rows[0].password;//obtaining password stored against the username from result returned after //                                  //querying database
           var salt=passwrd.split('$')[2];//splitting the password obtained above with '$' and obtaining the stored salt
           var hashedPasswrd=hash(password,salt);//encrypting the password submitted by the user using the same salt
           if(hashedPasswrd==dbpasswrd)//matching the hashed password with the one stored in hashed form in the database
           {
               res.send("User logged in successfully"+username);
           }
           else { res.status(403).send("Password is invalid"); }
               
           }
        }
    });
});

var commentobj={comment:`
        <input type="text" id="commentinput" placeholder="Enter Your Comments" style="width:50%" onclick="onclick(event)"  onblur="onblur(event)"></input>
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
    <script type="text/javascript" src="/ui/main.js"></script>
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
            </div><script type="text/javascript" src="/ui/articlejs.js"></script>
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

var comments=[];
app.get('/article-comment',function(req,res){
    var comment=req.query.comment;
    comments.push(comment);
    res.send(JSON.stringify(comments));
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
    //var namendate=data.namendate;
    var date=data.date;
    var content= data.content;
    var comment=commentobj.comment;
    
var htmlTemplate=`
<html>
    <head><title>${title}</title>
    <link href="/ui/style.css" rel="stylesheet" />
    <script type="text/javascript" src="/ui/main.js"></script>
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
                <h5>${date.toDateString()}</h5>
                
                ${content}
            </div>
            <div>${comment}</div>
            </div><script type="text/javascript" src="/ui/articlejs.js"></script>
        </body>
</html>`;
return htmlTemplate;
}

//if this url is requested, i.e. if user uses a slash, this function will execute, function tells pick up index.html and send contents of that index.html to response object res
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

/*
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
*/

app.get('/articles/:articleName', function (req, res) {
    
    //SELECT * FROM app_article WHERE urlpathkeyword='article-one'
    //pool.query("SELECT * FROM app_article WHERE urlpathkeyword='"+req.params.articleName+"'",function(err,result){
    pool.query("SELECT * FROM app_article WHERE urlpathkeyword=$1",[req.params.articleName],function(err,result){
        if(err){ res.status(500).send(err.toString()); }
        else if(result.rows.length===0){  res.status(404).send('Article Not Found'); }
        else 
        { 
            var articleData=result.rows[0]; 
            res.send(createTemplate(articleData,commentobj)); 
            
        }
    });
    
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

app.get('/ui/articlejs.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'articlejs.js'));
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
