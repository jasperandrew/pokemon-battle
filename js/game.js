var currentState;
var enemyPkmn;
var playerPkmn;

var playerTurn = {
  play: function(){
    var move;
    function setupUserField() {
      var moveButtons = ["#move-1 .move-text", "#move-2 .move-text", "#move-3 .move-text", "#move-4 .move-text"];

      $("#player-buttons").removeClass("hide");
      $("#action-text").text("What will " + playerPkmn.name + " do?");

      for(var i = 0; i < 4; i++){
        $(moveButtons[i]).text(moveList[playerPkmn.moves[i]].name);
      }
    };

    function prepAttack() {
      $("#player-buttons").addClass("hide");
      $("#player").animate({
        top: "+=10px",
      }, 200, function(){
        $("#player").animate({
          top: "-=10px",
        }, 200)
      })
      getAccuracy();
    };

    function getAccuracy() {
      var accuracy = Math.random();
      if(accuracy <= move.acc){
        $("#action-text").text(move.name + " hit!");
        getMoveClass();
      }else{
        $("#action-text").text(move.name + " missed!");
        currentState = enemyTurn;
        setTimeout(loop, 1500);
      }
    };

    function getMoveClass() {
      animateMove();
      if(move.class == "phys" || move.class == "spec"){
        setTimeout(attack, 1500);
      }else{
        setTimeout(defend, 1500);
      }
    };

    function animateMove() {
      $("#attack").addClass("player-attack");
      $("#attack").removeClass("hide");
      $("#attack").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
    };

    function attack() {
      $("#attack").addClass("hide");
      $("#attack").removeClass("player-attack");
      if(!playerPkmn.effect){
        enemyPkmn.health -= move.pwr;
      }else{
        enemyPkmn.health -= move.pwr - (move.pwr * enemyPkmn.effect);
        enemyPkmn.effect = null;
      }
      $("#enemy-health").animate({
        width: (enemyPkmn.health/enemyPkmn.max_health)*100 + "%",
      }, 200);
      currentState = enemyTurn;
      loop();
    };

    function defend() {
      $("#attack").addClass("hide");
      $("#attack").removeClass("player-attack");
      enemyPkmn.effect = move.pwr;
      currentState = enemyTurn;
      loop();
    };

    $(".move-button").unbind().click(function(){
      move = moveList[playerPkmn.moves[$(this).attr("value")]];
      prepAttack();
    });

    setupUserField();
  }
};

var enemyTurn = {
  play: function(){
    var move = moveList[enemyPkmn.moves[Math.floor(Math.random() * 4)]];
    $("#action-text").text("Enemy " + enemyPkmn.name + " used " + move.name + "!");

    function prepAttack() {
      $("#enemy").animate({
        top: "+=10px",
      }, 200, function(){
        $("#enemy").animate({
          top: "-=10px",
        }, 200)
      })
      getAccuracy();
    };

    function getAccuracy() {
      var accuracy = Math.random();
      if(accuracy <= move.acc){
        $("#action-text").text(move.name + " hit!");
        getMoveClass();
      }else{
        $("#action-text").text(move.name + " missed!");
        currentState = playerTurn;
        setTimeout(loop, 1500);
      }
    };

    function getMoveClass() {
      animateMove();
      if(move.class == "phys" || move.class == "spec"){
        setTimeout(attack, 1500);
      }else{
        setTimeout(defend, 1500);
      }
    };

    function animateMove() {
      $("#attack").addClass("enemy-attack");
      $("#attack").removeClass("hide");
      $("#attack").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
    };

    function attack() {
      $("#attack").addClass("hide");
      $("#attack").removeClass("enemy-attack");
      if(!enemyPkmn.effect){
        playerPkmn.health -= move.pwr;
      }else{
        playerPkmn.health -= move.pwr - (move.pwr * playerPkmn.effect);
        playerPkmn.effect = null;
      }
      $("#player-health").animate({
        width: (playerPkmn.health/playerPkmn.max_health)*100 + "%",
      }, 200);
      currentState = playerTurn;
      loop();
    };

    function defend() {
      $("#attack").addClass("hide");
      $("#attack").removeClass("enemy-attack");
      playerPkmn.effect = move.pwr;
      currentState = playerTurn;
      loop();
    };

    setTimeout(prepAttack, 1500);
  }
};

function loop() {
  if(playerPkmn.health <= 0 || enemyPkmn.health <= 0){
    $("#game-over").removeClass("hide");
    console.log("GAME OVER");
  }else{
    currentState.play();
  }
}

function init() {
  playerPkmn = charmander;
  enemyPkmn = pikachu;

  $("#player-name").text(playerPkmn.name);
  $("#player-lvl").text("lv" + playerPkmn.lvl);
  $("#player-health").css("width", (playerPkmn.health/playerPkmn.max_health)*100 + "%");
  $("#enemy-name").text(enemyPkmn.name);
  $("#enemy-lvl").text("lv" + enemyPkmn.lvl);
  $("#enemy-health").css("width", (enemyPkmn.health/enemyPkmn.max_health)*100 + "%");

  currentState = playerTurn;
  loop();
}

init();
