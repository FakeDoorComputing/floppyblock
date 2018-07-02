$(document).on("pagecreate", "#title", function(){
  titlemusic.play();
  $("#startbtn").on("click",function(){playerselect();})
  $("#gobtn").click(function(){
    $("#titlescreen").show();
    fadeoutaudio(titlemusic);
    $.mobile.pageContainer.pagecontainer("change", "#gamescreen");
  });
  getscreen();
  showtitle();
});

function getscreen(){
  height=$(window).height();
}

function showtitle(){
  $("#titlescreen").fadeIn(2000);
}

function playerselect(){
  $("#titlescreen").hide();
  $("#players").fadeIn(2000);
  var names=(function(){
    try{
      var playernames=window.localStorage.getItem("players");
      return playernames;
    }
    catch (exception){
      return false;
    }
  }());
  if(names){
    var parsenames=JSON.parse(names);
    for(i=0;i<parsenames.length;i++){
      pl_name[i]=parsenames[i].name;
      pl_score[i]=parsenames[i].score;
      $("#players").append("<li class='nameslist'>"+pl_name[i]+" - "+pl_score[i]+"</li>");
    };
  }
  $('#players').on('click', 'li', function(e){
    var select=$(this).closest("li").index();
    select-=2;
    if(select<0){
      newplayer();
    }
    else{
      playerselect=pl_name[select],scoreselect=pl_score[select];
      $("#players").hide();
      $("#welcomeback").fadeIn(2000);
      $("#welcomeback").prepend("<p class='titletext'>Your highscore is "+scoreselect+"</p>");
      $("#welcomeback").prepend("<p class='titletext'>Welcome back "+playerselect+"</p><br>");
    }
  });
}

function newplayer(){
  $(window).keydown(function(event){
    if(event.keyCode==13){
      event.preventDefault();
      return false;
    }
  });
  $("#players").hide();
  $("#newplayer").fadeIn(2000);
  $("#gonew").click(function(){
    var text_value=$("#newname").val();
    if(text_value!=""){
      playerselect=text_value;
      scoreselect=0;
      $("#newplayer").hide();
      $("#welcomeback").fadeIn(2000);
      $("#welcomeback").prepend("<p class='titletext'>Keep going as long as you can, there is no end!</p>");
      $("#welcomeback").prepend("<p class='titletext'>Avoid the walls, collect the prizes.</p><br>");
      $("#welcomeback").prepend("<p class='titletext'>Tap the screen to make the box jump,</p>");
      $("#welcomeback").prepend("<p class='titletext'>Welcome "+playerselect+"</p><br>");
    }
  });
}
