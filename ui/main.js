console.log('Loaded!');
var loggedField=document.getElementById('logged');


    
    //XMLHttpRequest For Login Endpoint
    var login=document.getElementById('login');
    login.onclick=function(){
        console.log('inside onclick login');
        var request=new XMLHttpRequest();
        request.onreadystatechange=function(){
            if(request.readyState==XMLHttpRequest.DONE)
            {
                if(request.status==200)
                {
                    alert('logged in successfully');
                    loggedField.value="1";
                }
                else if(request.status==403){
                alert('username/password incorrect');
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
    var register=document.getElementById('register');
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
    if(loggedValue==1||loggedValue.equals("1"))
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
    




