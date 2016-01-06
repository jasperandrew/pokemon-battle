var currentState, cpuPkmn, playerPkmn;
var attacker, attackerTxt, target, targetTxt, nextTurn;

// GLOBAL ATTACK FUNCTION //
function attack(move) {
  function animateAttack() {
    // Run the correct player animation //
    if(attackerTxt == "player"){
      $("#player").animate({ left: "+=10px" }, 100, function(){
        $("#player").animate({ left: "-=10px" }, 100)
      });
    }else{
      $("#cpu").animate({ right: "+=10px" }, 100, function(){
        $("#cpu").animate({ right: "-=10px" }, 100)
      });
    }

    // Run the hit effect //
    $("#attack").addClass(attackerTxt + "-attack");
    $("#attack").removeClass("hide");
    $("#attack").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
    setTimeout(function(){
      $("#attack").addClass("hide");
      $("#attack").removeClass(attackerTxt + "-attack");
    }, 1000);

    setTimeout(calcAttack, 1000);
  }

  // Function to calculate damage/effects //
  function calcAttack() {
    if(move.class == "phys" || move.class == "spec"){
      if(!attacker.effect){
        target.health -= move.pwr;
      }else{
        target.health -= move.pwr + (move.pwr * target.effect);
        target.effect = null;
      }
      $("#" + targetTxt + "-health").animate({
        width: (target.health/target.max_health)*100 + "%",
      }, 200);
      currentState = nextTurn;
      loop();
    }else{
      target.effect = move.pwr;
      currentState = nextTurn;
      loop();
    }
  }

  // Figure out if the attack will hit //
  var accuracy = Math.random();
  if(accuracy <= move.acc){
    console.log(attackerTxt + " hit with " + move.name + " (" + move.class + ")");
    $("#action-text").text(move.name + " hit!");
    animateAttack(); // If the attack hits, continue to animate it //
  }else{
    console.log(attackerTxt + " missed with " + move.name + " (" + move.class + ")");
    $("#action-text").text(move.name + " missed!");
    currentState = nextTurn;
    setTimeout(loop, 1000); // If the attack misses, exit and go to the next turn //
  }
}

// PLAYER TURN OBJECT //
var playerTurn = {
  play: function(){
    // Set the stuff //
    attacker = playerPkmn;
    attackerTxt = "player";
    target = cpuPkmn;
    targetTxt = "cpu";
    nextTurn = cpuTurn;

    // Set up user buttons //
    var moveButtons = ["#move-1 .move-text", "#move-2 .move-text", "#move-3 .move-text", "#move-4 .move-text"];
    $("#player-buttons").removeClass("hide");
    $("#action-text").text("What will " + playerPkmn.name + " do?");
    for(var i = 0; i < 4; i++){
      $(moveButtons[i]).text(moveList[playerPkmn.moves[i]].name);
    }

    // Pick a move to use //
    var move;
    $(".move-button").unbind().click(function(){
      move = moveList[playerPkmn.moves[$(this).attr("value")]];
      $("#player-buttons").addClass("hide");
      $("#action-text").text(playerPkmn.name + " used " + move.name + "!");
      setTimeout(attack, 1000, move);
    });
  }
};

// CPU TURN OBJECT //
var cpuTurn = {
  play: function(){
    // Set the stuff //
    attacker = cpuPkmn;
    attackerTxt = "cpu";
    target = playerPkmn;
    targetTxt = "player";
    nextTurn = playerTurn;

    // Randomly select a move to use //
    var move = moveList[cpuPkmn.moves[Math.floor(Math.random() * 4)]];
    $("#action-text").text("Enemy " + cpuPkmn.name + " used " + move.name + "!");
    setTimeout(attack, 1000, move);
  }
};

// GAME LOOP CHECKER FUNCTION //
function loop() {
  if(playerPkmn.health <= 0 || cpuPkmn.health <= 0){
    $("#game-over").removeClass("hide");
    console.log("GAME OVER");
  }else{
    currentState.play();
  }
}

// INITIALIZATION FUNCTION //
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
