console.log('Loaded!');
var loggedField=document.getElementById('logged');
var textField=document.getElementById('loginsection');
var loginnout=document.getElementById('loginnout');
var login=document.getElementById('login');
var register=document.getElementById('register');var logout;

//XMLHttpRequest for Logout endpoint
var performLogout=function(){
        console.log('inside onclick logout');
        var request=new XMLHttpRequest();
        request.onreadystatechange=function(){
            if(request.readyState==XMLHttpRequest.DONE)
            {
                if(request.status==200)
                {
                    loggedField.value="0";
                    alert('logged out successfully');
                    textField.innerHTML="Login/Register to unlock awesome features";
                    loginnout.innerHTML=` <input type="text" id="username" placeholder="Username" />
                                          <input type="password" id="password" placeholder="Password" /><br><br>
                                          <input type="submit" id="login" value="Submit" />
                                          <input type="submit" id="register" value="Register" /><br><br>`;
                    login=document.getElementById('login');
                    register=document.getElementById('register');
                    login.setAttribute('onclick', 'performLogin();');
                    register.setAttribute('onclick', 'performRegistration();');
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
                    textField.innerHTML="Hi "+sessionvalue;
                    loginnout.innerHTML='<br><input type="submit" id="logout" value="Logout" />';
                    logout=document.getElementById('logout');
                    console.log("onload logoutbutton=>>"+logout);
                    logout.setAttribute('onclick', 'performLogout();');
                    
                }
                
            }
        }
    };
    
        request.open("GET","http://rpalchoudhury50.imad.hasura-app.io/check-login",true);
        request.send(null);
};

    
    //XMLHttpRequest For Login Endpoint
    console.log("login button:-"+login);
    //login.onclick=function(){
    var performLogin=function(){
        console.log('inside onclick login');
        var request=new XMLHttpRequest();
        request.onreadystatechange=function(){
            if(request.readyState==XMLHttpRequest.DONE)
            {
                if(request.status==200)
                {
                    alert('logged in successfully');
                    loggedField.value="1";var username=request.responseText;
                    textField.innerHTML="Hi"+'&nbsp;'+username;
                    loginnout.innerHTML='<br><input type="submit" id="logout" value="Logout" />';
                    logout=document.getElementById('logout');
                    console.log(" after logged in logoutbutton=>>"+logout);
                    logout.setAttribute('onclick', 'performLogout();');
                    
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
        request.setRequestHeader("device", "laptop");
        request.send(JSON.stringify({username: username, password: password}));
    };
    
     //XMLHttpRequest For Register Endpoint
    //register.onclick=function(){
    var performRegistration=function(){
        console.log('inside onclick register');
        var request=new XMLHttpRequest();
        request.onreadystatechange=function(){
            if(request.readyState==XMLHttpRequest.DONE)
            {
                var reqmsg=request.responseText;
                if(request.status==200)
                {
                    if(request.responseText=="User Already Exists...please login to continue...")
                    alert(request.responseText);
                    else
                    alert('registered successfully');
                }
                else if(request.status==500)
                {
                alert('something went wrong on the server,please wait for sometime to register again,sorry for inconvenience');
                }
                console.log("Ritu:-"+reqmsg);
            }
            
        };
        var username=document.getElementById('username').value;
        var password=document.getElementById('password').value;
        //console.log(username);console.log(password);
        request.open("POST","http://rpalchoudhury50.imad.hasura-app.io/create-user",true);
        request.setRequestHeader('Content-Type','application/json');
         request.setRequestHeader("device", "laptop");
        request.send(JSON.stringify({username: username, password: password}));
    };
    
 



