console.log('Loaded!');
var submitButton=document.getElementById('submit');
 var nameList=document.getElementById('namelist');
submitButton.onclick=function(){
    
    //Create the request object
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState==XMLHttpRequest.DONE)
        {
            if(request.status==200)
            {
                //Capture a list of names (along with the new name entered appended) and render it as a list
                //var names=['name1','name2','name3','name4'];
                var names=request.responseText;
                names=JSON.parse(names);//converting the string obtained above back to an object, in this case an array object
                var list='';
                for(var i=0;i<names.length;i++)
                    {
       
                     list +='<li>'+names[i]+'</li>';
         
                    }
   
            nameList.innerHTML=list;
            }
        }
    
    };    
    
//Make a request to the server and send the name 
var inputText=document.getElementById('name').value;
request.open("GET","http://rpalchoudhury50.imad.hasura-app.io/submit-name?name="+inputText,true);//this url shud match endpoint /submit-name in //server.js
request.send(null);
   
    }; 
    
    //XMLHttpRequest For Login Endpoint
    var submit=document.getElementById('submit');
    var loggedfield=document.getElementById('logged');
    submit.onclick=function(){
        console.log('inside onclick');
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
    
    




