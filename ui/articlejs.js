console.log('Loaded ArticleJS');
var onclick=function(){
    if(document.getElementById('commentinput').placeholder == 'Enter Your Comments')
    {
        console.log('Inside if else Clicked!');
    //document.getElementById('commentinput').value='';//obj.value='';
    document.getElementById('commentinput').placeholder='';
    }
    console.log('Outside if else Clicked!'+obj.value);
};
var onblur=function(){
    if(document.getElementById('commentinput').value==='')
    {
        console.log('Inside if else blurred!');
        document.getElementById('commentinput').placeholder='Enter Your Comments';
    }
    console.log('Outside if else, blurred!');
    
};
//Comments section
var submitbutton=document.getElementById('ssubmit');
var commentList=document.getElementById('comments');
submitbutton.onclick=function(){
    console.log('inside submitbtn');
    //Create request object
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState==XMLHttpRequest.DONE)
        {
            if(request.status==200)
            {
                console.log('status 200');
                var comments=request.responseText;
                comments=JSON.parse(comments);var list='';
                for(var i=0;i<comments.length;i++){
                    list +='<li>'+comments[i]+'</li>';
                }
                commentList.innerHTML=list;
            }
        }
    };

//Make the request
var comment=document.getElementById('commentinput');
console.log('before opening request');
request.open('GET','http://rpalchoudhury50.imad.hasura-app.io/article-comment?comment='+comment,true);
console.log('request opened');
request.send(null);
console.log('request sent');
};
