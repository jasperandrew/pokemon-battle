 var charmander = {
   name: "CHARMANDER",
   health: 100,
   lvl: 1,
   effect: null,
   moves: [{
     name: "EMBER",
     type: "atk",
     pwr: 20,
     acc: .80
   },{
     name: "SCRATCH",
     type: "atk",
     pwr: 10,
     acc: .90
   },{
     name: "LEER",
     type: "dfn",
     pwr: .20,
     acc: 1.0
   },{
     name: "GROWL",
     type: "atk",
     pwr: .65,
     acc: .75
   }]
 };

 var pikachu = {
   name: "PIKACHU",
   health: 100,
   lvl: 1,
   effect: null,
   moves: [{
     name: "THUNDERSHOCK",
     type: "atk",
     pwr: 20,
     acc: .80
   },{
     name: "TACKLE",
     type: "atk",
     pwr: 10,
     acc: .90
   },{
     name: "TAIL WHIP",
     type: "dfn",
     pwr: .20,
     acc: 1.0
   },{
     name: "GROWL",
     type: "atk",
     pwr: .65,
     acc: .75
   }]
 };

var currentState;
var enemyPkmn;
var playerPkmn;

var playerTurn = {
  play: function(){
    var move;
    var setupUserField = function(){
      var moveButtons = ["#move-1 .move-text", "#move-2 .move-text", "#move-3 .move-text", "#move-4 .move-text"];

      $("#player-buttons").removeClass("hide");
      $("#action-text").text("What will " + playerPkmn.name + " do?");

      for(var i = 0; i < 4; i++){
        $(moveButtons[i]).text(playerPkmn.moves[i].name);
      }
    };

    var prepAttack = function(){
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

    var getAccuracy = function(){
      var accuracy = Math.random();
      if(accuracy <= move.acc){
        $("#action-text").text(move.name + " hit!");
        getMoveType();
      }else{
        $("#action-text").text(move.name + " missed!");
        currentState = enemyTurn;
        setTimeout(loop, 1500);
      }
    };

    var getMoveType = function(){
      animateMove();
      if(move.type == "atk"){
        setTimeout(attack, 1500);
      }else{
        setTimeout(defend, 1500);
      }
    };

    var animateMove = function(){
      $("#attack").addClass("player-attack");
      $("#attack").removeClass("hide");
      $("#attack").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
    };

    var attack = function(){
      $("#attack").addClass("hide");
      $("#attack").removeClass("player-attack");
      if(!playerPkmn.effect){
        enemyPkmn.health -= move.pwr;
      }else{
        enemyPkmn.health -= move.pwr - (move.pwr * enemyPkmn.effect);
        enemyPkmn.effect = null;
      }
      $("#enemy-health").animate({
        width: enemyPkmn.health + "%",
      }, 200);
      currentState = enemyTurn;
      loop();
    };

    var defend = function(){
      $("#attack").addClass("hide");
      $("#attack").removeClass("player-attack");
      enemyPkmn.effect = move.pwr;
      currentState = enemyTurn;
      loop();
    };

    $(".move-button").unbind().click(function(){
      console.log($(this).attr("value"));
      move = playerPkmn.moves[$(this).attr("value")];
      prepAttack();
    });

    setupUserField();
  }
};

var enemyTurn = {
  play: function(){
    var move = enemyPkmn.moves[Math.floor(Math.random() * 4)];
    $("#action-text").text("Enemy " + enemyPkmn.name + " used " + move.name + "!");

    var prepAttack = function(){
      $("#enemy").animate({
        top: "+=10px",
      }, 200, function(){
        $("#enemy").animate({
          top: "-=10px",
        }, 200)
      })
      getAccuracy();
    };

    var getAccuracy = function(){
      var accuracy = Math.random();
      if(accuracy <= move.acc){
        $("#action-text").text(move.name + " hit!");
        getMoveType();
      }else{
        $("#action-text").text(move.name + " missed!");
        currentState = playerTurn;
        setTimeout(loop, 1500);
      }
    };

    var getMoveType = function(){
      animateMove();
      if(move.type == "atk"){
        setTimeout(attack, 1500);
      }else{
        setTimeout(defend, 1500);
      }
    };

    var animateMove = function(){
      $("#attack").addClass("enemy-attack");
      $("#attack").removeClass("hide");
      $("#attack").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
    };

    var attack = function(){
      $("#attack").addClass("hide");
      $("#attack").removeClass("enemy-attack");
      if(!enemyPkmn.effect){
        playerPkmn.health -= move.pwr;
      }else{
        playerPkmn.health -= move.pwr - (move.pwr * playerPkmn.effect);
        playerPkmn.effect = null;
      }
      $("#player-health").animate({
        width: playerPkmn.health + "%",
      }, 200);
      currentState = playerTurn;
      loop();
    };

    var defend = function(){
      $("#attack").addClass("hide");
      $("#attack").removeClass("enemy-attack");
      playerPkmn.effect = move.pwr;
      currentState = playerTurn;
      loop();
    };

    setTimeout(prepAttack, 1500);
  }
};

var loop = function(){
  if(playerPkmn.health <= 0 || enemyPkmn.health <= 0){
    $("#game-over").removeClass("hide");
    console.log("GAME OVER");
  }else{
    currentState.play();
  }
};

var init = function(){
  playerPkmn = charmander;
  enemyPkmn = pikachu;

  $("#player-name").text(playerPkmn.name);
  $("#player-lvl").text("lv" + playerPkmn.lvl);
  $("#enemy-name").text(enemyPkmn.name);
  $("#enemy-lvl").text("lv" + enemyPkmn.lvl);

  currentState = playerTurn;
  loop();
};

init();
