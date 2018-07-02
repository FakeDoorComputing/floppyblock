function endcondition(){
  fadeoutaudio(music);
  running=false;
  defeat.play();
  $("#gameovername").text(playerselect);
  if(score>scoreselect){
    $("#gameovertext").text("New High Score : "+score);
  }
  else{
    $("#gameovertext").text("Score : "+score);
  }
  checkhighscore();
  $("#overlay").modal({backdrop: "static",keyboard: false}).modal("show");
}

function checkhighscore(){
  var len=pl_name.length;
  var playerfound=false;
  if(score>scoreselect){
    scoreselect=score;
    for(i=0;i<len;i++){
      if(playerselect==pl_name[i]){
        pl_score[i]=score;
        playerfound=true;
      }
    }
    if(!playerfound){
      pl_name.push(playerselect);
      pl_score.push(score);
    }
    var scores=[]
    len=pl_name.length;
    for(i=0;i<len;i++){
      scores.push({name: pl_name[i], score: pl_score[i]});
    }
    var json=JSON.stringify(scores);
    localStorage.setItem("players",json);
  }
}
