$(document).on("pagecreate", "#gamescreen", function(){
  $("#gamescreen").on("click",function(){
    playermove=true;
    upordown=0;
    nowheight=player.y;
  })
  $("#restart").on("click", function(){
    initialvariables();
//    location.reload();
    $("#overlay").modal("hide");
    setgift();
    walls();
    fadeinaudio(music);
    drawgamescreen();
  });
  $("#quit").on("click", function(){navigator.app.exitApp();});

  setcanvas();
  screensize();
  setgift();
  walls();
  fadeinaudio(music);
  drawgamescreen();
})


function setcanvas(){ /* set the canvas variables */
  cvs=document.getElementById("canvas");
  var elemLeft = cvs.offsetLeft,
  elemTop = cvs.offsetTop,
  elements = [];
  cv=cvs.getContext("2d");
  cvs.addEventListener("click",function(event){
    var x = event.pageX - elemLeft,
    y = event.pageY - elemTop;
    if(gifttopress){
      if(y>chunkheight*85&&y<chunkheight*85+chunkheight*10&&x>chunkwidth*90&&x<chunkwidth*90+chunkheight*10){
        redeemgift();
      }
    }
  })
  return;
}

function screensize(){ /* set the screensize and size of sprites */
  height=$(window).height();
  width=$(window).width();
  cvs.width=width;
  cvs.height=height;
  chunkheight=height/100;
  chunkwidth=width/100;
  canvascolour=randomcolour();
  wallwidth=chunkwidth;
  player={"x":50,"y":100,"xl":chunkwidth*5,"yl":chunkwidth*5};
  gift.x=width;
  gift.xl=chunkwidth*4;
  gift.yl=chunkwidth*4;
  return;
}

function setgift(){
  var num=randomnumber(3);
  if(num==1){
    gift_on_screen=gift_a;
    giftno=1;
  }
  else if(num==2){
    gift_on_screen=gift_b;
    giftno=2;
  }
  else{
    gift_on_screen=gift_c;
    giftno=3;
  }
}

function walls(){ /* put ten walls into array */
  var len=wall.x.length; /* get the number already in the array */
  for (i=len;i<10;i++){ /* run this up to ten times, minus what is already in the array */
    if (i==0){ /* if this is the first wall */
      wall.x[i]=width+100; /* set it just outside of the screen width */
    }
    else{
      wall.x[i]=wall.x[i-1]+randomnumber(300)+distance; /* the next wall x is added off the last one */
    }
    wall.y[i]=randomstart("y"); /* random assign wall to top or bottom */
    if(!shortwalls){ /* if normal play */
      count=0;
      wall.l[i]=randomstart(wall.y[i]); /* random length of wall */
    }
    if(shortwalls){ /* if gift is in play */
      count++;
      wall.l[i]=5;
      wall.y[i]=chunkheight*99;
      if(count>7){
        shortwalls=false;
      }
    }
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
    var num=randomnumber(chunkheight*70);
    if (num<100){
      num+=100; /* don't allow a height above 200, this stops the wall from being so high you can't get over it */
    }
    return num;
    break;

    default:
    if (key==0){ /* if the wall starts from the top */
      var num=randomnumber(height); /* get a random height */
      if (num>height-100){ /* don't allow the wall to be so low you can't get under it */
        num-=100;
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
  runtime++; /* increase the runtime counter */
  drop++;
  if(drop%500==0){
    setgift();
    giftdrop=true;
  }
  if(giftdrop){
    gift.x-=speed;
    gift.y+=2;
    if(gift.y+gift.yl>=height){
      giftdrop=false;
      gift.y=gift.y-gift.yl;
    }
    if(gift.x<=0-gift.xl){
      giftdrop=false;
      gift.x=width;
      gift.y=0-gift.yl;
    }
  }
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
  if(!playersafe){
    if (hit){
      runtime=0; /* reset the runtime counter */
      countb=0;
      resize++; /* start shrinking the player */
      if (resize<10){
        player.xl-=chunkwidth/5;
        player.yl-=chunkwidth/5;
      }
    }
    if (resize>=10){
      hit=false; /* no longer hitting the wall */
      resize=0; /* reset the resize counter */
    //  playerspeed++; /* increase the player drop speed */
    }
  }
  if(playersafe){
    countb++;
    hit=false;
    if(countb>500){
      playersafe=false;
      playercolour="#000";
      powerup="";
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
    cv.lineWidth=1;
    cv.fillStyle=playercolour;
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
    /* draw gift drop */
    cv.drawImage(gift_on_screen,gift.x,gift.y,gift.xl,gift.yl);
    /* write score on screen */
    cv.font ="1em Sans-serif"
    cv.strokeStyle="white";
    cv.lineWidth=2;
    cv.strokeText("High : "+scoreselect, chunkwidth*5, chunkheight*10);
    cv.strokeText(powerup,chunkwidth*40,chunkheight*10);
    cv.strokeText(score, chunkwidth*90,chunkheight*10);
    cv.fillStyle="black";
    cv.fillText("High : "+scoreselect, chunkwidth*5, chunkheight*10);
    cv.fillText(powerup,chunkwidth*40,chunkheight*10);
    cv.fillText(score, chunkwidth*90,chunkheight*10);
    /* draw current gift collected */
    if (gifttopress){
      cv.drawImage(currentgift, chunkwidth*90,chunkheight*85,chunkheight*10,chunkheight*10);
    }
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
  if (gift.x<player.x+player.xl&&gift.x+gift.xl>player.x&&
  gift.y<player.y+player.yl&&gift.y+gift.yl>player.y){
    giftreceived();

  }
  return;
}

function giftreceived(){
  gift.x=width;
  gift.y=0-gift.xl;
  giftdrop=false;
  ding.play();
  currentgift=gift_on_screen;
  gifttopress=true;
  giftcurrent=giftno;
}

function redeemgift(){
  gifttopress=false;
  switch(giftcurrent){
    case 1: /* make player full size */
      player.yl=50, player.xl=50;
      break;
    case 2: /* make walls short for 10 walls */
      shortwalls=true;
      powerup="Short Walls";
      wall.x.splice(2,8);
      wall.y.splice(2,8);
      wall.l.splice(2,8);
      wall.c.splice(2,8);
      setInterval(function(){powerup="";},6000);
      break;
    case 3: /* make player indestructable for short time */
      playersafe=true;
      powerup="Invincibility"
      playercolour="#87ceeb"
      break;
  }
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

function nextlevel(){
  speed++;
  playerspeed+=0.33;
  fadeoutaudio(music);
  level.music.splice(0,1);
  music=new Audio(level.music[0]);
  fadeinaudio(music);
}
