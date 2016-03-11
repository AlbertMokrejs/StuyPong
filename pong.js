var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var clr = document.getElementById("clear");
var eas = document.getElementById("easy");
var med = document.getElementById("med");
var hrd = document.getElementById("hard");

var powerups = [];
var paddlev = 0;
var plength = canvas.height / 6;
var pheight = 10;
var pycor = canvas.height / 2 - (plength / 2);

var pad = new Image();
pad.src = "paddle.png";

var ball = new Image();
ball.src = "ball.png";

ctx.fillStyle = "#f0f000";
ctx.strokeStyle = "#00f0f0";

var Ball = {
  coors: {
    x: 0,
    y: 0
  },
  velocity: {
    y: 0,
    x: 0
  },
  move: function() {

  }
}

var Computer = {
  coors: {
    y: canvas.height / 2 - (plength / 2)
  },
  velocity: 1
}

var pscore;
var cscore;

var exist = false;
var run = false;
var difficulty = 1;

var start = function(e) {
  e.preventDefault();
  canvas.width = window.innerWidth - 100;
  canvas.height = window.innerHeight - 68 - 19 - 40;
  pscore = 0;
  cscore = 0;
  if (!exist) {
    Ball.coors.x = canvas.width - 50;
    Ball.coors.y = canvas.height / 2;
    Ball.velocity.y = -10;
    Ball.velocity.x = Math.random() * 20 - 10;
    exist = !exist;
    run = true;

    window.requestAnimationFrame(play);
  }

  if (!run) {
    run = !run;
    window.requestAnimationFrame(play);

  }
}

var clear = function(e) {
  e.preventDefault();
  exist = false;
  run = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  window.cancelAnimationFrame(play);
}

var play = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  movePaddle();
  moveBall();
  aiMove();
  if (Math.floor(Math.random() * 100) == 1) {
    randomPowerUp();
  }
  checkScore();
  if (run) {
    window.requestAnimationFrame(play);
  }
}

var movePaddle = function() {
  pycor = pycor + paddlev;

  if (findIn("bpaddle") != -1) {
    var tmpx = Math.abs(powerups[findIn("bpaddle")]["Ball.coors.x"]);
    var tmpy = Math.abs(powerups[findIn("bpaddle")]["Ball.coors.y"]);
    ctx.fillStyle = "#FF00FF";
    ctx.fillRect(tmpx - 5, tmpy - 5, 10, 10);
    if (Math.abs(powerups[findIn("bpaddle")]["Ball.coors.x"] - Ball.coors.x) < 10 && Math.abs(powerups[findIn("bpaddle")]["Ball.coors.y"] - Ball.coors.y) < 10) {
      plength *= 1.25;
      powerups[findIn("bpaddle")]["time"] = powerups[findIn("bpaddle")]["time"] - 1;
      if (powerups[findIn("bpaddle")]["time"] == 0) {
        plength = canvas.height / 6;
        powerups.splice(powerups[findIn("bpaddle")], 1);
      }
    }
  }
  if (findIn("smallpaddle") != -1) {
    var tmpx = Math.abs(powerups[findIn("smallpaddle")]["Ball.coors.x"]);
    var tmpy = Math.abs(powerups[findIn("smallpaddle")]["Ball.coors.y"]);
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(tmpx - 5, tmpy - 5, 10, 10);
    if (Math.abs(powerups[findIn("smallpaddle")]["Ball.coors.x"] - Ball.coors.x) < 10 && Math.abs(powerups[findIn("smallpaddle")]["Ball.coors.y"] - Ball.coors.y) < 10) {
      plength *= 2 / 3;

      powerups[findIn("smallpaddle")]["time"] = powerups[findIn("smallpaddle")]["time"] - 1;
      if (powerups[findIn("smallpaddle")]["time"] == 0) {
        plength = canvas.height / 6;
        powerups.splice(powerups[findIn("smallpaddle")], 1);
      }
    }
  }
  ctx.drawImage(pad, 30, pycor, pheight, plength);
}


var moveBall = function() {
  if (Ball.coors.x > canvas.width - 50 && Ball.coors.y > Computer.coors.y && Ball.coors.y < Computer.coors.y + 30) {
    Ball.velocity.x *= -1
  } else if (Ball.coors.x < 40 && Ball.coors.y > pycor && Ball.coors.y < pycor + plength) {
    Ball.velocity.x += paddlev / 2
    Ball.velocity.x *= -1
  }
  if (Ball.coors.y > canvas.height || Ball.coors.y < 0) {
    Ball.velocity.y *= -1
  }
  /*
  if (findIn("randdir") != -1) {
      var tmpx = Math.abs(powerups[findIn("randdir")]["Ball.coors.x"]);
      var tmpy = Math.abs(powerups[findIn("randdir")]["Ball.coors.y"]);
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(tmpx - 5, tmpy - 5, 10,10);
      if (Math.abs(powerups[findIn("randdir")]["Ball.coors.x"] - Ball.coors.x) < 10 && Math.abs(powerups[findIn("randdir")]["Ball.coors.y"] - Ball.coors.y) < 10){
      Ball.velocity.x = Math.random() * 20 - 10;
      Ball.velocity.y = Math.random() * 20 - 10;
      powerups[findIn("randdir")]["time"] = powerups[findIn("randdir")]["time"] - 1;
      if (powerups[findIn("randdir")]["time"] == 0) {
        powerups.splice(powerups[findIn("randdir")], 1);
      }
      }
    }
    if (findIn("slow") != -1) {
      var tmpx = Math.abs(powerups[findIn("slow")]["Ball.coors.x"]);
      var tmpy = Math.abs(powerups[findIn("slow")]["Ball.coors.y"]);
      ctx.fillStyle = "#00FF00";
      ctx.fillRect(tmpx - 5, tmpy - 5, 10,10);
      if (Math.abs(powerups[findIn("slow")]["Ball.coors.x"] - Ball.coors.x) < 10 && Math.abs(powerups[findIn("slow")]["Ball.coors.y"] - Ball.coors.y) < 10){
      Ball.velocity.x = Ball.velocity.x / 2;
      Ball.velocity.y = Ball.velocity.y / 2;
      powerups[findIn("slow")]["time"] = powerups[findIn("slow")]["time"] - 1;
      if (powerups[findIn("slow")]["time"] == 0) {
        powerups.splice(powerups[findIn("slow")], 1);
      }
      }
    }
    if (findIn("fast") != -1) {
      var tmpx = Math.abs(powerups[findIn("fast")]["Ball.coors.x"]);
      var tmpy = Math.abs(powerups[findIn("fast")]["Ball.coors.y"]);
      ctx.fillStyle = "#0000FF";
      ctx.fillRect(tmpx - 5, tmpy - 5, 10,10);
      if (Math.abs(powerups[findIn("fast")]["Ball.coors.x"] - Ball.coors.x) < 10 && Math.abs(powerups[findIn("fast")]["Ball.coors.y"] - Ball.coors.y) < 10){
      Ball.velocity.x = Ball.velocity.x * 2;
      Ball.velocity.y = Ball.velocity.y * 2;
      powerups[findIn("fast")]["time"] = powerups[findIn("fast")]["time"] - 1;
      if (powerups[findIn("fast")]["time"] == 0) {
        powerups.splice(powerups[findIn("fast")], 1);
      }
      }
    }
  */
  Ball.coors.x += Ball.velocity.x;
  Ball.coors.y += Ball.velocity.y;
  ctx.drawImage(ball, Ball.coors.x, Ball.coors.y, 10, 10);
}

var findIn = function(a) {
  for (i = 0; i < powerups.length; i++) {
    if (powerups[i]["type"] == a) {
      return i;
    }
  }
  return -1;
}

var checkScore = function() {
  if (Ball.coors.x > canvas.width - 30) {
    pscore = pscore + 1;
    ballReset()
  }
  if (Ball.coors.x < 30) {
    cscore = cscore + 1;
    ballReset()
  }
  document.querySelector('.scoreboard .player .score').innerHTML = pscore.toString();
  document.querySelector('.scoreboard .computer .score').innerHTML = cscore.toString();
}

var ballReset = function() {
  Ball.coors.x = canvas.width / 2;
  Ball.coors.y = canvas.height / 2;
  Ball.velocity.x = 20 * Math.random() - 10;
  // Ball.velocity.y = 20 * Math.random() - 10;
}

/**
 * AI Code
 */

var aiMove = function() {
  var x = aiPredict();
}


var aiPredict = function() {
  // var x_pos = ball.x;
  // var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
  // if(diff < 0 && diff < -4) { // max speed left
  //   diff = -5;
  // } else if(diff > 0 && diff > 4) { // max speed right
  //   diff = 5;
  // }
  // this.paddle.move(diff, 0);
  // if(this.paddle.x < 0) {
  //   this.paddle.x = 0;
  // } else if (this.paddle.x + this.paddle.width > 400) {
  //   this.paddle.x = 400 - this.paddle.width;
  // }

  if (Ball.velocity.x > 0) {
    var t = (canvas.width - 30 - Ball.coors.x) / Ball.velocity.x
    var x = Math.abs(t * Ball.velocity.y - Ball.coors.y) % (canvas.height - 60) * Math.pow(-1, Math.floor(Math.abs(t * Ball.velocity.y - Ball.coors.y) / (canvas.height - 60)) + (canvas.height - 60) / 2);
  }
  if (Ball.velocity.x < 0) {
    var t = (canvas.width - 90 + Ball.coors.x) / Ball.velocity.x
    var x = Math.abs(t * Ball.velocity.y - Ball.coors.y) % (canvas.height - 60) * Math.pow(-1, Math.floor(Math.abs(t * Ball.velocity.y - Ball.coors.y) / (canvas.height - 60)) + (canvas.height - 60) / 2);
  }
  return x
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
   powerups[powerups.length] = makeRandomLoc(type);
 }

/**
 * Event Handlers
 */


document.addEventListener("keyup", function(e) {
  key = e.keyCode;
  if (key == 40 && paddlev > 0) {
    paddlev = 0;
    e.preventDefault()
  } else if (key == 38 && paddlev < 0) {
    paddlev = 0;
    e.preventDefault()
  }
});

document.addEventListener("keydown", function(e) {
  key = e.keyCode;
  if (paddlev == 0) {
    paddlev = 10;
  }

  if (key == 40) {
    paddlev = Math.abs(paddlev);
    e.preventDefault()
  } else if (key == 38) {
    paddlev = -1 * Math.abs(paddlev);
    e.preventDefault()
  }
});

eas.addEventListener("click", start);
clr.addEventListener("clear", start);
