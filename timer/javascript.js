var hours=prompt("enter hours");
var mins=prompt("enter mins");
var secs=prompt("enter secs");
var hh= document.getElementById("hours");
var mm=document.getElementById("mins");
var ss=document.getElementById("secs");
var totalsecs=Number(hours)*3600+Number(mins)*60+Number(secs);
setInterval(display,1000);
function display()
{   currenttime=--totalsecs;
    hh.textContent=Math.floor(currenttime/3600);
    mm.textContent=Math.floor((currenttime%3600)/60);
    ss.textContent=(currenttime%3600)%60;
}
