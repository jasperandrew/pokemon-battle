var currentState, cpuPkmn, playerPkmn;
var attacker, attackerTxt, target, targetTxt, nextTurn;

// GLOBAL ATTACK FUNCTION //
function attack(move) {
  function animateAttack() {
    // Run the correct player animation //
    var pkmn = document.querySelector("#" + attackerTxt);
    pkmn.classList.add(attackerTxt + "-atk");
    setTimeout(function() {
      pkmn.classList.remove(attackerTxt + "-atk");
    }, 200);

    // Run the hit effect //
    var atk = document.querySelector("#attack");
    atk.classList.add(attackerTxt + "-attack");
    atk.classList.remove("hide");
    setTimeout(function(){
      atk.classList.add("hide");
      atk.classList.remove(attackerTxt + "-attack");
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

      document.querySelector("#" + targetTxt + "-health").style.width = (target.health/target.max_health)*100 + "%";

      var hbar = document.querySelector("#" + targetTxt + "-health");
      if(target.health <= target.max_health/4){
        hbar.classList.remove("hbar-mid");
        hbar.classList.add("hbar-bad");
      }else if(target.health <= target.max_health/2){
        hbar.classList.remove("hbar-good");
        hbar.classList.remove("hbar-bad");
        hbar.classList.add("hbar-mid");
      }else{
        hbar.classList.remove("hbar-mid");
        hbar.classList.add("hbar-good");
      }

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
  var box = document.querySelector("#action-text");
  if(accuracy <= move.acc){
    console.log(attackerTxt + " hit with " + move.name + " (" + move.class + ")");
    box.innerHTML = move.name + " hit!";
    animateAttack(); // If the attack hits, continue to animate it //
  }else{
    console.log(attackerTxt + " missed with " + move.name + " (" + move.class + ")");
    box.innerHTML = move.name + " missed!";
    currentState = nextTurn;
    setTimeout(loop, 1000); // If the attack misses, exit and go to the next turn //
  }
}

// PLAYER TURN OBJECT //
var playerTurn = {
  play: function(){
    console.log("=== Player turn ===");
    // Set the stuff //
    attacker = playerPkmn;
    attackerTxt = "player";
    target = cpuPkmn;
    targetTxt = "cpu";
    nextTurn = cpuTurn;

    // Set up user buttons //
    var moveButtons = ["#move-1 .move-text", "#move-2 .move-text", "#move-3 .move-text", "#move-4 .move-text"];
    var box = document.querySelector("#action-text");
    var buttonbox = document.querySelector("#player-buttons");
    var buttons = document.getElementsByClassName("move-button");
    var move;

    buttonbox.classList.remove("hide");
    box.innerHTML = "What will " + playerPkmn.name + " do?";
    for(var i = 0; i < 4; i++){
      document.querySelector(moveButtons[i]).innerHTML = moveList[playerPkmn.moves[i]].name;
    }

    // Select a move to use //
    function buttonClick() {
      move = moveList[playerPkmn.moves[this.attributes["value"]["value"]]];
      buttonbox.classList.add("hide");
      box.innerHTML = playerPkmn.name + " used " + move.name + "!";
      setTimeout(attack, 1000, move);
    }

    // Add event listeners //
    for(var i = 0; i < 4; i++){
      buttons[i].onclick = buttonClick;
    }
  }
};

// CPU TURN OBJECT //
var cpuTurn = {
  play: function(){
    console.log("=== CPU turn ===");
    // Set the stuff //
    attacker = cpuPkmn;
    attackerTxt = "cpu";
    target = playerPkmn;
    targetTxt = "player";
    nextTurn = playerTurn;

    // Randomly select a move to use //
    var move = moveList[cpuPkmn.moves[Math.floor(Math.random() * 4)]];
    document.querySelector("#action-text").innerHTML = "Enemy " + cpuPkmn.name + " used " + move.name + "!";
    setTimeout(attack, 1000, move);
  }
};

// GAME LOOP CHECKER FUNCTION //
function loop() {
  if(playerPkmn.health <= 0 || cpuPkmn.health <= 0){
    document.querySelector("#game-over").classList.remove("hide");
    console.log("GAME OVER");
  }else{
    currentState.play();
  }
}

// INITIALIZATION FUNCTION //
function init() {
  playerPkmn = charmander;
  cpuPkmn = pikachu;

  document.querySelector("#player-name").innerHTML = playerPkmn.name;
  document.querySelector("#player-lvl").innerHTML = "lv" + playerPkmn.lvl;
  document.querySelector("#player-health").style.width = (playerPkmn.health/playerPkmn.max_health)*100 + "%";
  document.querySelector("#cpu-name").innerHTML = cpuPkmn.name;
  document.querySelector("#cpu-lvl").innerHTML = "lv" + cpuPkmn.lvl;
  document.querySelector("#cpu-health").style.width = (cpuPkmn.health/cpuPkmn.max_health)*100 + "%";

  currentState = playerTurn;
  loop();
}

init();
