console.log('Loaded ArticleJS');
var comments_section=document.getElementById('commentssection');
var loggedField=document.getElementById('loggedinornot');
var logintoview=document.getElementById('login');

var onload=function(){
    console.log('Inside onload for article page');
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
    
        if(request.readyState==XMLHttpRequest.DONE)
        {
            if(request.status==200)
            {
                var sessionvalue=request.responseText;
                console.log("sessionvalue:-"+sessionvalue);
                if(sessionvalue!="You are not logged in!!!")
                {
                    comments_section.style.display="block";
                    logintoview.style.display="none";
                    loggedField.value="1";console.log('Inside onload article page Session exists');
                    
                }
                else{
                    comments_section.style.display="none";loggedField.value="0";
                    logintoview.style.display="block";logintoview.style.fontWeight="bold";
                    logintoview.innerHTML='<p>Please <a href="/">Login</a> To View Comments</p>';
                    console.log('Inside onload article page Session does not exist');
                }
                
            }
        }
    };
    
        request.open("GET","http://rpalchoudhury50.imad.hasura-app.io/check-login",true);
        request.send(null);
        
        //For loading comments:-
        var commentrequest=new XMLHttpRequest();
        commentrequest.onreadystatechange=function(){
            if(commentrequest.readyState==XMLHttpRequest.DONE)
            {
                if(commentrequest.status==200)
                {
                var comments=commentrequest.responseText;
                comments=JSON.parse(comments);
                }
                else if(commentrequest.status==403)
                {
                    comments=commentrequest.responseText;
                }
                else
                {
                    comments="Can't display comments..database getting updated...regret inconvenience caused..";
                }
            }
        };
        
        commentrequest.open("GET","http://rpalchoudhury50.imad.hasura-app.io/loadcomments",true);
        commentrequest.send(null);
};


var onclick=function(e){
    if(document.getElementById('commentinput').placeholder == 'Enter Your Comments')
    {
        e.preventDefault();
        console.log('Inside if else Clicked!');
    //document.getElementById('commentinput').value='';//obj.value='';
    document.getElementById('commentinput').placeholder='';
    e.stopImmediatePropagation();
    }
    console.log('Outside if else Clicked!');
};
var onblur=function(e){
    if(document.getElementById('commentinput').value==='')
    {
        e.preventDefault();
        console.log('Inside if else blurred!');
        document.getElementById('commentinput').placeholder='Enter Your Comments';
         e.stopImmediatePropagation();
    }
    console.log('Outside if else, blurred!');
    
};
//Comments section
var submitbutton=document.getElementById('submit');
var commentList=document.getElementById('comments');
console.log(submitbutton);
submitbutton.onclick=function(){
    console.log('inside submitbtn');
    if(document.getElementById('commentinput').value.length===0)
    {
        alert('Please Enter Some Comment');
         document.getElementById('commentinput').focus();
    }
    else if(document.getElementById('commentinput').value.length<6)
    {
        alert('Your Comment Is Too Short!!!');
        document.getElementById('commentinput').focus();
    }
    else
    {
    //Create request object
    var request=new XMLHttpRequest();
    console.log('before readystate function');
    request.onreadystatechange=function(){
        console.log('inside ready state function');
        if(request.readyState==XMLHttpRequest.DONE)
        {
            if(request.status==200)
            {
                console.log('status 200');
                var comment=request.responseText;
                var li = document.createElement('li');
                console.log('new li node created');
                li.innerHTML=comment;
                console.log('li node innerHTML is set');
                commentList.appendChild(li);
            }
        }
    };

//Make the request
var comment=document.getElementById('commentinput').value;
document.getElementById('commentinput').value='';
document.getElementById('commentinput').placeholder='Enter Your Comments';
console.log('before opening request');var time;
var today = new Date();var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
var hrs=today.getHours();
if(hrs>=0&&hrs<=12)
time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+"AM";
else
time= today.getHours()-12 + ":" + today.getMinutes() + ":" + today.getSeconds()+"PM";
console.log("Date:-"+date+"Time:-"+time);
request.open('GET','http://rpalchoudhury50.imad.hasura-app.io/article-comment?comment='+comment+'&date='+date+'&time='+time,true);
console.log('request opened');
request.send(null);
console.log('request sent');
}
};
