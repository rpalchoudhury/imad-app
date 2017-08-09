console.log('Loaded ArticleJS');
var onclick=function(){
    if(document.getElementById('commentinput').placeholder == 'Enter Your Comments')
    {
        console.log('Inside if else Clicked!');
    //document.getElementById('commentinput').value='';//obj.value='';
    document.getElementById('commentinput').placeholder='';
    }
    console.log('Outside if else Clicked!');
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
var submitbutton=document.getElementById('submit');
var commentList=document.getElementById('comments');
console.log(submitbutton);
submitbutton.onclick=function(){
    console.log('inside submitbtn');
    if(document.getElementById('commentinput').value.length===0)
    {
        alert('Please Enter Some Comment');
    }
    else if(document.getElementById('commentinput').value.length<6)
    {
        alert('Your Comment Is Too Short!!!');
        document.getElementById('commentinput').placeholder='Enter Your Comments';
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
var comment=document.getElementById('commentinput').value;
document.getElementById('commentinput').value='';
document.getElementById('commentinput').placeholder='Enter Your Comments';
console.log('before opening request');
request.open('GET','http://rpalchoudhury50.imad.hasura-app.io/article-comment?comment='+comment,true);
console.log('request opened');
request.send(null);
console.log('request sent');
}
};
