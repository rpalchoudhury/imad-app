//The server.js file holds all the endpoints/requests for which the server must listen

var express = require('express');
var morgan = require('morgan');
var path = require('path');

//For connecting to database, you need to do npm i pg and make sure node-postgres is installed at minimum 6.0.0.
var Pool=require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');
var session=require('express-session');
var currentArticle=0;

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
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60*24*30 }//all our cookies has been set to a age of a month, quite long lasting
    
}));

//create the pool somewhere globally so its lifetime lasts for as long as your app is running
var pool=new Pool(config);

var array=[];var temparray;var counting=0;
app.get('/get-articles',function(req,res){
    pool.query('SELECT app_article.id, app_article.title, app_article.heading, app_article.content, app_article.date, usertable.username FROM app_article,usertable WHERE app_article.user_id=usertable.id',function(err,result){
    if(err)
    {
        res.status(500).send(err.toString());
    }
    else{
        if(result.rows.length===0) res.status(403).send("No articles found");
        else{
            
            for(var i=0;i<result.rows.length;i++)
        {
            var uname=result.rows[i].username;
            var id=result.rows[i].id;var title=result.rows[i].title;var heading=result.rows[i].heading;
            var date=result.rows[i].date; var content=result.rows[i].content;
            temparray={ "id":id, "title":title, "heading":heading, "date":date, "content":content, "name":uname };
            if(counting===0)array.push(temparray);
            
        }   
        res.send(JSON.stringify(array));counting=1;
        }
        
    }
    });
});

//hashing, security
function hash(input, salt)
{
    var hashed=crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    //return hashed.toString('hex');
    return ["pbkdf2Sync","10000",salt,hashed.toString('hex')].join('$');//We are using hexadecimal encoding to convert the //returned sequence of bytes obtained from encrypting in previous step to readable and printable string format
}


app.post('/create-user',function(req,res){
    var dbUserName=req.body.username;
    var password=req.body.password;
    var devicename=req.header('Device');
    pool.query('SELECT * FROM usertable WHERE username = $1',[dbUserName],function(err,result){
        if(err)
        {
            res.status(500).send(err.toString());
        }
        else{
    if(result.rows.length===0)
    {
    var salt=crypto.randomBytes(128).toString('hex');
    var dbPassword=hash(password,salt);
    pool.query('INSERT INTO usertable (username, password) VALUES ($1,$2)',[dbUserName, dbPassword],function(err,result){
        if(err){
             if(devicename=="Android")
               {
                   var errmsg={error: err.toString()};
                   res.send(JSON.stringify(errmsg));
               }else
            res.status(500).send(err.toString());
        }else{
            if(devicename=="Android")
               {
                   var xx="User successfully created:"+dbUserName;
                   var user1={message: xx};
                   //username="{\"message\": \""+username.toString()+"\"}";
                   res.send(JSON.stringify(user1));
               }else
            res.send("User successfully created:"+dbUserName);
        }
    });
  }
  else{
      if(devicename=="Android")
               {
                   var user2={error: "User Already Exists...please login to continue..."};
                   res.status(403).send(JSON.stringify(user2));
               }else
      res.send("User Already Exists...please login to continue...");
  }
 }
});
});
//login using the data entered into the database, by fetching from the database
app.post('/login',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    var devicename=req.header('Device');
    pool.query('SELECT * FROM usertable WHERE username = $1', [username], function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else
        { 
            if(result.rows.length===0) { res.status(403).send("Username does not exist, you need to register"); } 
            else
           { //Match the password
           var dbpasswrd=result.rows[0].password;
           var salt=dbpasswrd.split('$')[2];//splitting the password obtained above with '$' and obtaining the stored salt
           var hashedPasswrd=hash(password,salt);//encrypting the password submitted by the user using the same salt
           if(hashedPasswrd==dbpasswrd)//matching the hashed password with the one stored in hashed form in the database
           {
               //We have to set the session value before sending the response(with res.send) from the server
               //req.session.auth ={userId: result.rows[0].id};
               req.session.auth ={userId: result.rows[0].id, userName: result.rows[0].username};
               if(devicename=="Android")
               {
                   var user={message: username};
                   //username="{\"message\": \""+username.toString()+"\"}";
                   res.send(JSON.stringify(user));
               }else
               res.status(200).send(username);
           }
           else { res.status(403).send("Password is incorrect"); }
               
           }
        }
    });
});

app.get('/check-login',function(req,res){
    var devicename=req.header('Device'); 
    if(req.session&&req.session.auth&&req.session.auth.userId){
        if(devicename=="Android")
        {
            var message={"message":req.session.auth.userName.toString()};
            res.send(JSON.stringify(message));
        }
        else
        res.send(req.session.auth.userName.toString());
    }else
    {
        if(devicename=="Android")
        {
        var nmessage={"message":"You are not logged in!!!"};
        res.send(JSON.stringify(nmessage));
        }else
        res.send('You are not logged in!!!');
    }
});

//logout endpoint that deletes the auth object, does not store the session id anymore
app.get('/logout',function(req,res){
   var devicename=req.header('Device');
   delete req.session.auth;
   if(devicename=="Android")
               {
                   var user={message: "Logged out successfully"};
                   res.send(JSON.stringify(user));
               }else
   res.send('Logged out successfully');
});


var commentobj={comment:`
        <div id="commentssection"><hr><h4>Submit your comments:-</h4>
        <TextArea rows="4" cols="50" id="commentinput" placeholder="Enter Your Comments" style="width:50%" onclick="onclick(event)"  onblur="onblur(event)"></TextArea><br>
        <input type="submit" id="submit" value="Submit Your Comments"></input> 
        </div>
        <h4>Comments:-</h4>
        <div id="comments" style="width: auto; height:30%; margin-left: auto; margin-right: auto;" align="left">
        </div>`};


app.get('/article-comment',function(req,res){
    var comment=req.query.comment;
    var user_name=req.session.auth.userName;
    var article_id=currentArticle;
    var date=req.query.date;
    var time=req.query.time;
     pool.query('INSERT INTO "comments" (article_id, comment, date, time, username) VALUES ($1,$2,$3,$4,$5)', [article_id, comment, date, time, user_name], function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(comment);
        }
    });
});

var temparray=[];var commentarray=[];
app.get('/loadcomments',function(req,res){
    var devicename=req.header('Device');
    if(devicename=="Android")
    {var currArticle=req.query.apparticle_id;
       pool.query('SELECT * FROM "comments" WHERE article_id=$1',[currArticle],function(err,result){
        if(err) {res.status(500).send(err.toString());}
        else { 
            if(result.rows.length===0) { res.status(403).send("No comments exist for this article yet..."); } 
            else {
           commentarray="";
                for(var i=0;i<result.rows.length;i++)
                {
                var cname=result.rows[i].username;
                var ctime=result.rows[i].time;var cdate=result.rows[i].date;var comment=result.rows[i].comment;
                var article_id=result.rows[i].article_id; var id=result.rows[i].id;
                temparray={ "id":id, "article_id":article_id, "comment":comment, "cdate":cdate, "ctime":ctime, "cname":cname };
                if(counting===0)commentarray.push(temparray);
                }   
                res.send(JSON.stringify(commentarray));  
                
            }
        }
    }); 
    }
    else{
    pool.query('SELECT * FROM "comments" WHERE article_id=$1',[currentArticle],function(err,result){
        if(err) {res.status(500).send(err.toString());}
        else { 
            if(result.rows.length===0) { res.status(403).send("No comments exist for this article yet..."); } 
            else { res.send(JSON.stringify(result));  }
        }
    });
    }
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
        <body onload="onload()">
            <div class="container">
            <!--margin: 0 auto -> automatic margin from left and right -->
            <div>
                <a href="/">Home</a>
            </div>
            <hr/>
            <div>
                <h1>${heading}</h1><input type="hidden" id="loggedinornot" value="0" />
                <h5>${date.toDateString()}</h5>
                
                ${content}
            </div>
            <div><span id="login"></span>${comment}</div>
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
    if(req.params.articleName=="article-one") currentArticle=1;
    else if (req.params.articleName=="article-two") currentArticle=2;
    else if (req.params.articleName=="article-three") currentArticle=3;
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
