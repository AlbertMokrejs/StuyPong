var canvas = document.getElementById("game");
canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 68 - 19 - 40;

var ctx = canvas.getContext("2d");

ctx.fillStyle = "#f0f000";
ctx.strokeStyle = "#00f0f0";

var Powerups = [];

var PaddleMeta = {
  length: canvas.height / 6,
  height: 10,
  img: new Image()
}

var Ball = {
  coors: {
    x: 0,
    y: 0
  },
  velocity: {
    y: 0,
    x: 0
  },
  img: new Image(),
  move: function(x, y) {
    if (Ball.coors.x > canvas.width - 50 && Ball.coors.y > Computer.coors.y && Ball.coors.y < Computer.coors.y + 30) {
      Ball.velocity.x *= -1
    } else if (Ball.coors.x < 40 && Ball.coors.y > Player.coors.y && Ball.coors.y < Player.coors.y + PaddleMeta.length) {
      Ball.velocity.x += Player.velocity / 2
      Ball.velocity.x *= -1
    } else if (Ball.coors.x < 40 && Ball.coors.y > Computer.coors.y && Ball.coors.y < Computer.coors.y + PaddleMeta.length) {
      Ball.velocity.x += Computer.velocity / 2
      Ball.velocity.x *= -1
    }

    if (Ball.coors.y > canvas.height || Ball.coors.y < 0) {
      Ball.velocity.y *= -1
    }

    Ball.coors.x += Ball.velocity.x;
    Ball.coors.y += Ball.velocity.y;
    ctx.drawImage(Ball.img, Ball.coors.x, Ball.coors.y, 10, 10);
  },
  reset: function() {
    Ball.coors.x = canvas.width / 2;
    Ball.coors.y = canvas.height / 2;
    Ball.velocity.x = 20 * Math.random() - 10;
  }
}

var Computer = {
  coors: {
    x: canvas.width - 30,
    y: canvas.height / 2 - (PaddleMeta.length / 2)
  },
  velocity: 0,
  score: 0,
  maxVelocity: 0,
  move: function () {
    var diff = -(Computer.coors.y - Ball.coors.y);
    if(diff < 0 && diff < -40) { // max speed left
      diff = -40;
    } else if(diff > 0 && diff > 40) { // max speed right
      diff = 40;
    }

    ctx.drawImage(PaddleMeta.img, Computer.coors.x, Computer.coors.y - diff, PaddleMeta.height, PaddleMeta.length);
    if(Computer.coors.y < 0) {
      Computer.coors.y = 0;
    } else if (Computer.coors.y + 50 > canvas.height) {
      Computer.coors.y = canvas.height - Computer.coors.y;
    }
  }
}

var Player = {
  coors: {
    x: 30,
    y: canvas.height / 2 - (PaddleMeta.length / 2)
  },
  score: 0,
  velocity: 0,
  move: function () {
    if ( Player.coors.y - PaddleMeta.height / 2 <= canvas.height || Player.coors.y + PaddleMeta.height / 2 <= canvas.height) {
      return;
    }

    if (findIn("bpaddle") != -1) {
      var tmpx = Math.abs(Powerups[findIn("bpaddle")]["Ball.coors.x"]);
      var tmpy = Math.abs(Powerups[findIn("bpaddle")]["Ball.coors.y"]);
      ctx.fillStyle = "#FF00FF";
      ctx.fillRect(tmpx - 5, tmpy - 5, 10, 10);
      if (Math.abs(Powerups[findIn("bpaddle")]["Ball.coors.x"] - Ball.coors.x) < 10 && Math.abs(Powerups[findIn("bpaddle")]["Ball.coors.y"] - Ball.coors.y) < 10) {
        PaddleMeta.length *= 1.25;
        Powerups[findIn("bpaddle")]["time"] = Powerups[findIn("bpaddle")]["time"] - 1;
        if (Powerups[findIn("bpaddle")]["time"] == 0) {
          PaddleMeta.length = canvas.height / 6;
          Powerups.splice(Powerups[findIn("bpaddle")], 1);
        }
      }
    }
    if (findIn("smallpaddle") != -1) {
      var tmpx = Math.abs(Powerups[findIn("smallpaddle")]["Ball.coors.x"]);
      var tmpy = Math.abs(Powerups[findIn("smallpaddle")]["Ball.coors.y"]);
      ctx.fillStyle = "#FFFF00";
      ctx.fillRect(tmpx - 5, tmpy - 5, 10, 10);
      if (Math.abs(Powerups[findIn("smallpaddle")]["Ball.coors.x"] - Ball.coors.x) < 10 && Math.abs(Powerups[findIn("smallpaddle")]["Ball.coors.y"] - Ball.coors.y) < 10) {
        PaddleMeta.length *= 2 / 3;

        Powerups[findIn("smallpaddle")]["time"] = Powerups[findIn("smallpaddle")]["time"] - 1;
        if (Powerups[findIn("smallpaddle")]["time"] == 0) {
          PaddleMeta.length = canvas.height / 6;
          Powerups.splice(Powerups[findIn("smallpaddle")], 1);
        }
      }
    }


    ctx.drawImage(PaddleMeta.img, Player.coors.x, Player.coors.y, PaddleMeta.height, PaddleMeta.length);
  }
}

var exist = false;
var run = false;
var difficulty = 1;

var start = function(e) {
  if (e) {
    e.preventDefault();
  }
  PaddleMeta.img.src = "paddle.png";
  Ball.img.src = "ball.png";

  if (!exist) {
    Ball.coors.x = canvas.width - 50;
    Ball.coors.y = canvas.height / 2;
    Ball.velocity.y = -10;
    Ball.velocity.x = Math.random() * 20 - 10;
    exist = !exist;
    run = true;

    window.requestAnimationFrame(frame);
  }

  if (!run) {
    run = !run;
    window.requestAnimationFrame(frame);

  }
}

var frame = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Ball.move();
  Player.move();
  Computer.move();


  if (Math.floor(Math.random() * 100) == 1) {
    randomPowerUp();
  }

  checkScore();
  if (run) {
    window.requestAnimationFrame(frame);
  }
}

var findIn = function(a) {
  for (i = 0; i < Powerups.length; i++) {
    if (Powerups[i]["type"] == a) {
      return i;
    }
  }
  return -1;
}

var clear = function(e) {
  e.preventDefault();
  exist = false;
  run = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  window.cancelAnimationFrame(frame);
}

var checkScore = function() {
  if (Ball.coors.x > canvas.width - 30) {
    Player.score += 1;
    Ball.reset()
  }
  if (Ball.coors.x < 30) {
    Computer.score += 1;
    Ball.reset()
  }
  document.querySelector('.scoreboard .player .score').innerHTML = Player.score.toString();
  document.querySelector('.scoreboard .computer .score').innerHTML = Computer.score.toString();
}

/**
 * Power Up Code
 */

 var makePowerUp = function(a, x, y) {
   var z = {};
   z["type"] = a;
   z["Ball.coors.x"] = x;
   z["Ball.coors.y"] = y;
   //correction type --> z["type"]
   if (z["type"] == "bpaddle" || z["type"] == "smallpaddle") {
     z["time"] = 600;
   } else {
     z["time"] = 1;
   }
   return z;
 }
 var makeRandomLoc = function(a) {
   var newx = Math.random() * (canvas.width - 60) + 30;
   var newy = Math.random() * (canvas.height - 60) + 30;
   return makePowerUp(a, newx, newy);
 }

 var randomPowerUp = function() {
   var types = ["bpaddle", "smallpaddle", "fast", "slow", "randdir"];
   var type = types[Math.floor(Math.random() * 5)];
   Powerups[Powerups.length] = makeRandomLoc(type);
 }

/**
 * Event Handlers
 */


document.addEventListener("keyup", function(e) {
  key = e.keyCode;
  if (key == 40 && Player.velocity > 0) {
    Player.velocity = 0;
    e.preventDefault()
  } else if (key == 38 && Player.velocity < 0) {
    Player.velocity = 0;
    e.preventDefault()
  }
});

document.addEventListener("keydown", function(e) {
  key = e.keyCode;
  if (Player.velocity == 0) {
    Player.velocity = canvas.height * 0.05;
  }

  if (key == 40) {
    Player.velocity = Math.abs(Player.velocity);
    e.preventDefault()
  } else if (key == 38) {
    Player.velocity = -1 * Math.abs(Player.velocity);
    e.preventDefault()
  }
});

document.getElementById("clear").addEventListener("click", start);
document.getElementById("easy").addEventListener("click", function() {
  Computer.maxVelocity = canvas.height * 0.025;
  start();
});
document.getElementById("medium", function() {
  Computer.maxVelocity = canvas.height * 0.05;
  start();
});
document.getElementById("hard", function() {
  Computer.maxVelocity = canvas.height * 0.075;
  start();
});
