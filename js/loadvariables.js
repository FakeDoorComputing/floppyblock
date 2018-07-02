var width, height, chunkwidth, chunkheight, canvas, cv, distance, wallwidth, playerspeed, playersafe, countb;
var gamespeed, score, upordown, runtime, drop, giftdrop, gift_on_screen, currentgift, gifttopress, giftno, giftcurrent;
var wall, shortwalls, count, powerup;
var speed, running, playermove, hit, resize, player, gift;
var level={"music":["snd/levelOne.mp3","snd/levelTwo.mp3","snd/levelThree.mp3","snd/levelFour.mp3","snd/levelFive.mp3"]}
var music;
var titlemusic=new Audio("snd/start.mp3");
var defeat=new Audio("snd/Defeat.mp3");
var ding=new Audio("snd/ding.mp3");
var gift_a=new Image;
var gift_b=new Image;
var gift_c=new Image;
gift_a.src="img/gift_01a.png";
gift_b.src="img/gift_01b.png";
gift_c.src="img/gift_01c.png";
var status, canvascolour, nowheight, pl_name=[], pl_score=[], playerselect, scoreselect;

initialvariables();

function initialvariables(){
  playercolour="#000"
  music=new Audio(level.music[0]);
  playerspeed=1;
  wall={"x":[],"y":[],"l":[],"c":[]}
  playersafe=false;
  powerup="";
  gamespeed=30;
  score=0;
  upordown=0;
  runtime=0;
  drop=0
  giftdrop=false;
  gifttopress=false;
  count=0;
  countb=0;
  distance=200;
  shortwalls=false;
  speed=5;
  running=true;
  playermove=false;
  hit=false;
  resize=0;
  player={"x":50,"y":100,"xl":50,"yl":50};
  gift={"x":600,"y":-50,"xl":32,"yl":32};
}
