var width, height, chunkwidth, chunkheight, canvas, cv, distance=200, wallwidth, playerspeed=1;
var gamespeed=30, score=0, upordown=0, runtime=0;
var wall={"x":[],"y":[],"l":[],"c":[]};
var speed=5, running=true, playermove=false, hit=false, resize=0;
var player={"x":50,"y":100,"xl":50,"yl":50};
var level={"music":["snd/levelOne.mp3","snd/levelTwo.mp3","snd/levelThree.mp3","snd/levelFour.mp3"]}
var music=new Audio(level.music[0]);
var defeat=new Audio("snd/Defeat.mp3");
var status, canvascolour, nowheight;

$(document).on("pagecreate", "#gamescreen", function(){
  $("#gamescreen").on("click",function(){
    playermove=true;
    upordown=0;
    nowheight=player.y;
  })
  setcanvas();
  screensize();
  walls();
  fadeinaudio(music);
  drawgamescreen();
})

function setcanvas(){ /* set the canvas variables */
  cvs=document.getElementById("canvas");
  cv=cvs.getContext("2d");
  return;
}

function screensize(){ /* set the screensize */
  height=$(window).height();
  width=$(window).width();
  cvs.width=width;
  cvs.height=height;
  chunkheight=height/100;
  chunkwidth=width/100;
  canvascolour=randomcolour();
  wallwidth=chunkwidth;
  player={"x":50,"y":100,"xl":chunkwidth*5,"yl":chunkwidth*5};
  console.log(chunkwidth+" "+player.xl) // NOTE: remove when done
  return;
}

function walls(){ /* put ten walls into array */
  var len=wall.x.length; /* get the number already in the array */
  for (i=len;i<10;i++){ /* run this up to ten times, minus what is already in the array */
    if (i==0){ /* if this is the first wall */
      wall.x[i]=width+20; /* set it just outside of the width */
    }
    else{
      wall.x[i]=wall.x[i-1]+randomnumber(300)+distance; /* the next wall x is added off the last one */
    }
    wall.y[i]=randomstart("y"); /* random assign wall to top or bottom */
    wall.l[i]=randomstart(wall.y[i]); /* random length of wall */
    wall.c[i]=randomcolour();
  }
  return;
}

function randomstart(key){
  switch (key){
    case "y":
    var toporbottom=randomnumber(2);
    if (toporbottom==1){ /* random top or bottom */
      return 0;
    }
    var num=randomnumber(height);
    if (num<200){
      num+=200; /* don't allow a height above 200, this stops the wall from being so high you can't get over it */
    }
    return num;
    break;

    default:
    if (key==0){ /* if the wall starts from the top */
      var num=randomnumber(height); /* get a random height */
      if (num>height-200){ /* don't allow the wall to be so low you can't get under it */
        num-=200;
      }
      return num;
    }
    return height-key;
    break;
  }
}

function randomnumber(number){
  return Math.floor((Math.random() * number) +1); /* generate a random number between 1 and the number passed in */
}

function randomcolour(){
  return "#"+Math.floor(Math.random()*16777215).toString(16); /* random HEX colour code */
}

function drawgamescreen(){
  if (running){ /* only continue if the game is running */
    calculate();
    draw();
    requestAnimationFrame(drawgamescreen); /* continue to loop */
  }
}

function calculate(){
  runtime++ /* increase the runtime counter */
  if (playermove){ /* if the screen has been tapped */
    upordown++; /* increase the counter */
    if (player.y>=0&&upordown<40){ /* if the player is not at the top of the screen already */
      player.y-=chunkheight*playerspeed; /* remove this amount (go up) */
      if (player.y<=nowheight-(chunkheight*33)){ /* make sure that the jump is no more than 1/3 screen height */
        upordown=40;
      }
    }
    if (upordown==40){
      upordown=0; /* reset the counter */
      playermove=false; /* stop moving up */
    }
  }
  if (!playermove){
    player.y+=chunkheight*playerspeed; /* player drop */
  }
  checkposition();
  if (hit){
    runtime=0; /* reset the runtime counter */
    resize++; /* start shrinking the player */
    if (resize<10){
      player.xl-=chunkwidth/5;
      player.yl-=chunkwidth/5;
    }
    if (resize>=10){
      hit=false; /* no longer hitting the wall */
      resize=0; /* reset the resize counter */
    //  playerspeed++; /* increase the player drop speed */
    }
  }
  if (player.xl<=0){ /* if the player size is zero */
    endcondition();
  }
  if (runtime>500){ /* if the player doesn't hit a wall for a while */
    resize++; /* increase the resize counter */
    if (resize<10&&player.xl<chunkwidth*5){ /* increase the size of the player */
      player.xl++;
      player.yl++;
    }
    if (resize>=10){ /* if the resize counter hits 10 */
      resize=0; /* reset the counter */
      runtime=0; /* reset the run time counter */
    }
  }
  movewalls();
  wallcalc();
  return;
}

function draw(){
  cv.clearRect(0,0,cvs.width,cvs.height);
  cv.beginPath();
  /* draw background colour */
  cv.rect(0,0,cvs.width,cvs.height)
  cv.fillStyle=canvascolour;
  cv.fill();
  for (i=0;i<10;i++){
    /* draw player block */
    cv.fillStyle="#000";
    cv.fillRect(player.x,player.y,player.xl,player.yl);
    /* draw player outline */
    cv.strokeStyle="#fff";
    cv.strokeRect(player.x,player.y,player.xl,player.yl);
    /* draw walls */
    cv.fillStyle=wall.c[i];
    cv.fillRect(wall.x[i],wall.y[i],wallwidth,wall.l[i]);
    /* draw outline of walls */
    cv.strokeStyle="#fff";
    cv.strokeRect(wall.x[i],wall.y[i],wallwidth,wall.l[i]);
    /* write score on screen */
    cv.fillStyle="black";
    cv.font="1em Arial";
    cv.fillText(score, chunkwidth*90,chunkheight*10)
  }
  return;
}

function movewalls(){
  var len=wall.x.length;
  for (i=0;i<len;i++){
    wall.x[i]-=speed;
  }
  return;
}

function wallcalc(){
  if (wall.x[0]+wallwidth<0){
    wall.x.splice(0,1);
    wall.y.splice(0,1);
    wall.l.splice(0,1);
    wall.c.splice(0,1);
    walls();
    score+=10;
    if (score%1000==0){
      nextlevel();
    }
  }
  return;
}

function checkposition(){
  var numwalls=wall.x.length;
  if (player.y+player.yl>=height){
    player.y=height-player.yl;
  }
  if (player.y<=0){
    player.y=0;
  }
  for (i=0;i<numwalls;i++){
    if (wall.x[i]<player.x+player.xl&&wall.x[i]+wallwidth>player.x&&
    wall.y[i]<player.y+player.yl&&wall.y[i]+wall.l[i]>player.y){
      canvascolour=randomcolour();
      hit=true;
    }
  }
  return;
}

function fadeoutaudio(p_audio){
    var actualVolume=p_audio.volume;
    var fadeOutInterval=setInterval(function(){
        actualVolume=(parseFloat(actualVolume) - 0.1).toFixed(1);
        if (actualVolume>=0){
            p_audio.volume=actualVolume;
        }
        else{
            p_audio.pause();
            status="pause";
            clearInterval(fadeOutInterval);
        }
    }, 200);
}

function fadeinaudio(p_audio){
    var actualVolume = 0;
    p_audio.play();
    status = 'play';
    var fadeInInterval = setInterval(function(){
        actualVolume = (parseFloat(actualVolume) + 0.1).toFixed(1);
        if(actualVolume <= 1){
            p_audio.volume = actualVolume;
        } else {
            clearInterval(fadeInInterval);
        }
    }, 100);
}

function endcondition(){
  fadeoutaudio(music);
  running=false;
  defeat.play();
}

function nextlevel(){
  speed++;
  playerspeed+=0.33;
  fadeoutaudio(music);
  level.music.splice(0,1);
  music=new Audio(level.music[0]);
  fadeinaudio(music);
}
