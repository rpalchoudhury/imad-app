console.log('Loaded!');
var loggedField=document.getElementById('logged');
var textField=document.getElementById('loginsection');
var loginnout=document.getElementById('loginnout');
var login=document.getElementById('login');
var register=document.getElementById('register');

var onload=function(){
    console.log('Inside onload index.html');
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
    
        if(request.readyState==XMLHttpRequest.DONE)
        {
            if(request.status==200)
            {
                var sessionvalue=request.responseText;
                if(sessionvalue!="You are not logged in!!!")
                {
                    loggedField.value="1";console.log('Inside onload index.html Session exists');
                    textField.innerHTML="Hi"+'&npsp;'+username;
                    loginnout.innerHTML='<br><input type="submit" id="logout" value="Logout" />';
                    
                }
                
            }
        }
    };
    
        request.open("GET","http://rpalchoudhury50.imad.hasura-app.io/check-login",true);
        request.send(null);
};

    
    //XMLHttpRequest For Login Endpoint
    console.log("login button:-"+login);
    login.onclick=function(){
        console.log('inside onclick login');
        var request=new XMLHttpRequest();
        request.onreadystatechange=function(){
            if(request.readyState==XMLHttpRequest.DONE)
            {
                if(request.status==200)
                {
                    alert('logged in successfully');
                    loggedField.value="1";var username=request.responseText;
                    textField.innerHTML="Hi"+'&npsp;'+username;
                    loginnout.innerHTML='<br><input type="submit" id="logout" value="Logout" />';
                    
                    
                }
                else if(request.status==403){
                    var text=request.responseText;
                alert(text);
            }
            else if(request.status==500)
            {
                alert('something went wrong on the server');
            }
            }
            
        };
        var username=document.getElementById('username').value;
        var password=document.getElementById('password').value;
        //console.log(username);console.log(password);
        request.open("POST","http://rpalchoudhury50.imad.hasura-app.io/login",true);
        request.setRequestHeader('Content-Type','application/json');
        request.send(JSON.stringify({username: username, password: password}));
    };
    
     //XMLHttpRequest For Register Endpoint
    register.onclick=function(){
        console.log('inside onclick register');
        var request=new XMLHttpRequest();
        request.onreadystatechange=function(){
            if(request.readyState==XMLHttpRequest.DONE)
            {
                if(request.status==200)
                {
                    alert('registered successfully');
                }
                else if(request.status==500)
                {
                alert('something went wrong on the server,please wait for sometime to register again,sorry for inconvenience');
                }
            }
            
        };
        var username=document.getElementById('username').value;
        var password=document.getElementById('password').value;
        //console.log(username);console.log(password);
        request.open("POST","http://rpalchoudhury50.imad.hasura-app.io/create-user",true);
        request.setRequestHeader('Content-Type','application/json');
        request.send(JSON.stringify({username: username, password: password}));
    };
    
    //XMLHttpRequest For Logout Endpoint
    var loggedValue=loggedField.value;
    if(loggedValue==1||loggedValue=="1")
    {
    var logout=document.getElementById('logout');
    logout.onclick=function(){
        console.log('inside onclick logout');
        var request=new XMLHttpRequest();
        request.onreadystatechange=function(){
            if(request.readyState==XMLHttpRequest.DONE)
            {
                if(request.status==200)
                {
                    loggedField.value="0";
                    alert('logged out successfully');
                }
                else if(request.status==500)
                {
                alert('something went wrong on the server,please logout again,sorry for inconvenience');
                }
            }
            
        };
        //Make the request for endpoint
        request.open("GET","http://rpalchoudhury50.imad.hasura-app.io/logout",true);
        request.send(null);
    };
    }
    




