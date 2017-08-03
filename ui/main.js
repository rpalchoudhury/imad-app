console.log('Loaded!');
var element=document.getElementById('main-text');
element.innerHTML="My Name Is Rituparna";

//Move the image onClick
var img=document.getElementById("madi");
var marginLeft=0;var flag=0;
function moveRight()
{
    if(marginLeft<=300&&flag==0)
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
img.onclick=function(){
    
    //img.style.marginLeft='100px';//This will make it jump to the right becoz of 100px margin inserted to the left of the image
    //Below code to move the image gradually to right, i.e. animation
    var interval=setInterval(moveRight,50);//every 100ms move d img to d right,u can decreasse it to 50 to make it more gradual 
};