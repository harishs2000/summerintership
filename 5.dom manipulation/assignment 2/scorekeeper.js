var p1score=0;
var p2score=0;
var maxscore=5;
playone=document.getElementById("p1");
playtwo=document.getElementById("p2");
reset=document.getElementById("r");
playonescore = document.getElementById("p1s");
playtwoscore = document.getElementById("p2s");
maxdisplay= document.getElementById("max");
changemaxscore= document.getElementById("change");
playone.addEventListener("click",function(){if(p1score<maxscore){playonescore.textContent=++p1score;if(maxscore==p1score){playonescore.style.color="green";}}});
playtwo.addEventListener("click",function(){if(p2score<maxscore){playtwoscore.textContent=++p2score;if(maxscore==p2score){playtwoscore.style.color="green";}}});
reset.addEventListener("click",restart);
function restart()
{
    p1score=0;
    playonescore.textContent=0;
    playonescore.style.color="black";
    p2score=0;
    playtwoscore.textContent=0;
    playtwoscore.style.color="black";
}
changemaxscore.addEventListener("change",function(){maxscore=changemaxscore.value;restart();maxdisplay.textContent=changemaxscore.value});




