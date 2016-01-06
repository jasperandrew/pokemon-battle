var currentState;
var cpuPkmn;
var playerPkmn;

function attack(user, move) {
  console.log(user + " attacked with " + move.name + " (" + move.class + ")");

  var userPkmn, targetPkmn, target, nextTurn;
  if(user == "player"){
    userPkmn = playerPkmn;
    targetPkmn = cpuPkmn;
    target = "cpu";
    nextTurn = cpuTurn;
  }else{
    userPkmn = cpuPkmn;
    targetPkmn = playerPkmn;
    target = "player";
    nextTurn = playerTurn;
  }

  $("#attack").addClass("hide");
  $("#attack").removeClass(user + "-attack");

  if(move.class == "phys" || move.class == "spec"){
    if(!userPkmn.effect){
      targetPkmn.health -= move.pwr;
    }else{
      targetPkmn.health -= move.pwr - (move.pwr * targetPkmn.effect);
      targetPkmn.effect = null;
    }
    $("#" + target + "-health").animate({
      width: (targetPkmn.health/targetPkmn.max_health)*100 + "%",
    }, 200);
    currentState = nextTurn;
    loop();
  }else{
    targetPkmn.effect = move.pwr;
    currentState = nextTurn;
    loop();
  }
}


var playerTurn = {
  play: function(){
    var move;

    function prepAttack() {
      $("#player-buttons").addClass("hide");
      $("#player").animate({
        left: "+=10px",
      }, 100, function(){
        $("#player").animate({
          left: "-=10px",
        }, 100)
      })
      getAccuracy();
    }

    function getAccuracy() {
      var accuracy = Math.random();
      if(accuracy <= move.acc){
        $("#action-text").text(move.name + " hit!");
        getMoveClass();
      }else{
        console.log("player missed with " + move.name + " (" + move.class + ")");
        $("#action-text").text(move.name + " missed!");
        currentState = cpuTurn;
        setTimeout(loop, 1500);
      }
    }

    function getMoveClass() {
      animateMove();
      setTimeout(attack, 1500, "player", move);
    }

    function animateMove() {
      $("#attack").addClass("player-attack");
      $("#attack").removeClass("hide");
      $("#attack").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
    }

    $(".move-button").unbind().click(function(){
      move = moveList[playerPkmn.moves[$(this).attr("value")]];
      prepAttack();
    });

    // Set up user buttons //
    var moveButtons = ["#move-1 .move-text", "#move-2 .move-text", "#move-3 .move-text", "#move-4 .move-text"];
    $("#player-buttons").removeClass("hide");
    $("#action-text").text("What will " + playerPkmn.name + " do?");
    for(var i = 0; i < 4; i++){
      $(moveButtons[i]).text(moveList[playerPkmn.moves[i]].name);
    }
  }
};

var cpuTurn = {
  play: function(){
    var move = moveList[cpuPkmn.moves[Math.floor(Math.random() * 4)]];
    $("#action-text").text("Enemy " + cpuPkmn.name + " used " + move.name + "!");

    function prepAttack() {
      $("#cpu").animate({
        right: "+=10px",
      }, 100, function(){
        $("#cpu").animate({
          right: "-=10px",
        }, 100)
      })
      getAccuracy();
    }

    function getAccuracy() {
      var accuracy = Math.random();
      if(accuracy <= move.acc){
        $("#action-text").text(move.name + " hit!");
        getMoveClass();
      }else{
        console.log("cpu missed with " + move.name + " (" + move.class + ")");
        $("#action-text").text(move.name + " missed!");
        currentState = playerTurn;
        setTimeout(loop, 1500);
      }
    }

    function getMoveClass() {
      animateMove();
      setTimeout(attack, 1500, "cpu", move);
    }

    function animateMove() {
      $("#attack").addClass("cpu-attack");
      $("#attack").removeClass("hide");
      $("#attack").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
    }

    setTimeout(prepAttack, 1500);
  }
};

function loop() {
  if(playerPkmn.health <= 0 || cpuPkmn.health <= 0){
    $("#game-over").removeClass("hide");
    console.log("GAME OVER");
  }else{
    currentState.play();
  }
}

function init() {
  playerPkmn = charmander;
  cpuPkmn = pikachu;

  $("#player-name").text(playerPkmn.name);
  $("#player-lvl").text("lv" + playerPkmn.lvl);
  $("#player-health").css("width", (playerPkmn.health/playerPkmn.max_health)*100 + "%");
  $("#cpu-name").text(cpuPkmn.name);
  $("#cpu-lvl").text("lv" + cpuPkmn.lvl);
  $("#cpu-health").css("width", (cpuPkmn.health/cpuPkmn.max_health)*100 + "%");

  currentState = playerTurn;
  loop();
}

init();
