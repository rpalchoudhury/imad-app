//The server.js file holds all the endpoints/requests for which the server must listen

var express = require('express');
var morgan = require('morgan');
var path = require('path');

//For connecting to database, you need to do npm i pg and make sure node-postgres is installed at minimum 6.0.0.
var Pool=require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');
var session=require('express-session');

var config={
    user:'rpalchoudhury50',
    database:'rpalchoudhury50',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret:'someRandomSecretValue',
    cookie: { maxAge: 1000*60*60*24*30 }//all our cookies has been set to a age of a month, quite long lasting
    
}));

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


//hashing, security
function hash(input, salt)
{
    var hashed=crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    //return hashed.toString('hex');
    return ["pbkdf2Sync","10000",salt,hashed.toString('hex')].join('$');//We are using hexadecimal encoding to convert the //returned sequence of bytes obtained from encrypting in previous step to readable and printable string format
}

app.get('/hash/:input',function(req,res){
    var hashedString=hash(req.params.input,'this-is-some-random-salt-string');
    res.send(hashedString);
});

app.post('/create-user',function(req,res){
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
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else
        { 
            if(result.rows.length===0) { res.status(403).send("Username/Password is invalid"); } 
            else
           { //Match the password
           var dbpasswrd=result.rows[0].password;//obtaining password stored against the username from result returned after //                                  //querying database
           var salt=dbpasswrd.split('$')[2];//splitting the password obtained above with '$' and obtaining the stored salt
           var hashedPasswrd=hash(password,salt);//encrypting the password submitted by the user using the same salt
           if(hashedPasswrd==dbpasswrd)//matching the hashed password with the one stored in hashed form in the database
           {
               //We have to set the session value before sending the response(with res.send) from the server
               req.session.auth ={userId: result.rows[0].id};
               res.send("User logged in successfully"+username);
           }
           else { res.status(403).send("Password is invalid"); }
               
           }
        }
    });
});

app.get('/check-login',function(req,res){
    if(req.session&&req.session.auth&&req.session.auth.userId){
        res.send('You are logged in: '+req.session.auth.userId.toString());
    }else
    {
        res.send('You are not logged in!!!');
    }
});

//logout endpoint that deletes the auth object, does not store the session id anymore
app.get('/logout',function(req,res){
   delete req.session.auth;
   res.send('Logged out successfully');
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

var comments=[];
app.get('/article-comment',function(req,res){
    var comment=req.query.comment;
    comments.push(comment);
    res.send(JSON.stringify(comments));
});

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


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});


app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/articlejs.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'articlejs.js'));
});


app.get('/ui/flower.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'flower.jpg'));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
