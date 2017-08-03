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

var count=0;
var button=document.getElementById('buttoncount');
   button.onclick=function(){
    //Make a request to the counter endpoint
    //Capture the response and store it in a variable
    //Render the value of the variable in the correct span
      count++;
      var c=document.getElementById('counter');
      c.innerHTML=count.toString();
};




