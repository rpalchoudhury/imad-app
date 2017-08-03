console.log('Loaded!');
var element=document.getElementById('main-text');
element.innerHTML="My Name Is Rituparna";

//Move the image onClick
var img=document.getElementById("madi");
var marginLeft=0;
function moveRight()
{
    marginLeft=marginLeft+10;
    img.style.marginLeft=marginLeft+'px';
}
img.onclick=function(){
    
    //img.style.marginLeft='100px';//This will make it jump to the right becoz of 100px margin inserted to the left of the image
    //Below code to move the image gradually to right, i.e. animation
    var interval=setInterval(moveRight,100);//every 100 ms move the image to the right
};