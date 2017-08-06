console.log('Loaded!');
var element=document.getElementById('main-text');
element.innerHTML="My Name Is Rituparna";

//Move the image onClick
var img=document.getElementById("madi");
var marginLeft=0;var flag=0;

/*//The below function moves the image from left to right, then right to left, then left to right and so on
function moveRightLeft()
{
    if(marginLeft<=300&&flag===0)
    {
    marginLeft=marginLeft+10;
    if(marginLeft==300) flag=1;
    }
    else if(marginLeft>=-300&&flag==1)
    {
        marginLeft=marginLeft-10;
        if(marginLeft==-300) flag=0;
        
    }
    img.style.marginLeft=marginLeft+'px';
}
*/

//The below function moves the image from left to right always, when reaches the right extreme, gets reset to the left again to
//again move from left to right
function moveRightLeft()
{
    if(marginLeft<=300)
    {
    marginLeft=marginLeft+10;
    if(marginLeft==300) marginLeft=-300;
    }
   
    img.style.marginLeft=marginLeft+'px';
}
img.onclick=function(){
    
    //img.style.marginLeft='100px';//This will make it jump to the right becoz of 100px margin inserted to the left of the image
    //Below code to move the image gradually to right, i.e. animation
    var interval=setInterval(moveRightLeft,50);//every 100ms move d img to d right,u can decreasse it to 50 to make it more gradual 
};


//The code below is working for endpoint /count defined in server.js,picking up the counter value of response from that endpoint
var button=document.getElementById("buttoncount");
button.onclick=function(){
    
//Create the request object
var request = new XMLHttpRequest();
request.onreadystatechange=function(){
    
    if(request.readyState==XMLHttpRequest.DONE)
    {
        if(request.status==200)
        {
            var counter=request.responseText;
            var c=document.getElementById('counter');
            c.innerHTML=counter.toString();
            console.log("Ritu:-"+this.responseText);
        }
    }
};

//Make the request
request.open("GET","http://rpalchoudhury50.imad.hasura-app.io/counter",true);//this url shud match endpoint /count in server.js
request.send(null);

};

var inputText=document.getElementById('name').value;
var submitButton=document.getElementById('submit');
submitButton.onclick=function(){
    //Make a request to the server and send the name
    //Capture a list of names and render it as a list
    var names=['name1','name2','name3','name4'];
    var list='';
    for(var i=0;i<names.length;i++)
    {
       
        list='<li>'+names[i]+'<li>';
         console.log("Ritu:-"+list);
    }
    var nameList=document.getElementById('namelist');
    nameList.innerHTML=list;
};
//console.log(document.getElementById('buttoncount')); 
/*var count=0;
var button=document.getElementById("buttoncount");
//console.log('Button:-'+button) ;
   button.onclick=function(){
    //Make a request to the counter endpoint
    //Capture the response and store it in a variable
    //Render the value of the variable in the correct span
      count++;
      var c=document.getElementById('counter');
      c.innerHTML=count.toString();
};
*/




