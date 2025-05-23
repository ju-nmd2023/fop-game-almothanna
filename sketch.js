// REFERENCES AND INSPIRATION NOTES:
// - p5.js Reference: https://p5js.org/reference/
// - JavaScript Reference: https://www.w3schools.com/jsref/
// - Frogger Game Mechanics & Log Logic: https://youtu.be/giXV6xErw0Y (The Coding Train - Frogger Game)

let player;
let vehicles = [];
let logs = [];

let score = 0;
let lives = 3;
let gameState = "start";

// Define lane Y positions for road and river areas
let lanes = {
  roadStart: 400,
  roadEnd: 520,
  riverStart: 160,
  riverEnd: 280
};

function setup() {
  createCanvas(600, 600); // Initialize canvas (Reference: https://p5js.org/reference/#/p5/createCanvas)
  player = new Player();

  // Creating multiple vehicle objects in different lanes
  // following 7 lines were inspired by CHATGPT: https://chatgpt.com/share/682fb5c0-d950-800e-8ac6-1b6addfd028d
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let y = 400 + i * 40;
      let x = j * 220;
      let speed = 2 + i;
      let dir = i % 2 === 0 ? 1 : -1;
      vehicles.push(new Vehicle(x, y, speed, dir));
    }
  }

  // Creating logs for river area
  // Log spacing and offset logic learned from Coding Train Frogger video
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      let y = 160 + i * 40;
      let x;
      if (i === 0 && j === 0) x = 10; // Custom offset to vary log positions
      else x = j * 250 + (i % 2 === 0 ? 100 : 50);

      let speed = 2 + i * 0.5;
      let dir = i % 2 === 0 ? 1 : -1;
      logs.push(new Log(x, y, 120, speed, dir));
    }
  }
}

function draw() {
  background(50); // Draw background

  // Game state control 
  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "playing") {
    drawGame();
  } else if (gameState === "gameover") {
    drawEndScreen();
  } else if (gameState === "win") {
    drawWinScreen();
  }
}

function drawGame() {
  drawZones(); // Draws safe zones, road and river

  // Vehicle updates and collision checks
  for (let v of vehicles) {
    v.move();
    v.show();
    if (v.hits(player)) loseLife();
  }

  // Logs update and check if player is carried
  let onLog = false;
  for (let l of logs) {
    l.move();
    l.show();
    if (l.carries(player)) {
      player.x += l.speed * l.dir; // Code logic for moving with log from Coding Train video
      onLog = true;
    }
  }

  // If player is in river area but not on log, lose a life
  if (player.y >= lanes.riverStart && player.y < lanes.riverEnd && !onLog) {
    loseLife();
  }

  player.update();
  player.show();

  // Check for reaching the top safe zone (win condition)
  if (player.y < 40) {
    score++;
    player.reset();
    if (score >= 3) {
      gameState = "win";
    }
  }

  drawHUD(); // Score and lives display
}

function loseLife() {
  lives--;
  if (lives <= 0) {
    gameState = "gameover";
  }
  player.reset();
}

function keyPressed() {
  // Starting the game
  if (gameState === "start" && keyCode === ENTER) {
    gameState = "playing";
  }

  // Restart game if over or won
  if ((gameState === "gameover" || gameState === "win") && key === 'r') {
    lives = 3;
    score = 0;
    gameState = "playing";
    player.reset();
  }

  // Move the player using arrow keys
  if (gameState === "playing") {
    player.move(keyCode);
  }
}

function drawZones() {
  fill(100); // Top safe zone
  rect(0, 0, width, 40);
  rect(0, height - 40, width, 40); // Bottom safe zone

  fill(150); // Road area
  rect(0, 400, width, 120);

  fill(30, 144, 255); // River area
  rect(0, 160, width, 120);
}

class Player {
  constructor() {
    this.size = 22;
    this.reset();
  }

  reset() {
    this.x = width / 2;
    this.y = height - this.size - 10;
  }

  update() {
    // Keep player within canvas bounds
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);
  }

  show() {
    fill(0, 255, 0);
    rect(this.x, this.y, this.size, this.size);
  }

  move(keyCode) {
    let step = 32; // Grid step size

    if (keyCode === LEFT_ARROW) this.x -= step;
    else if (keyCode === RIGHT_ARROW) this.x += step;
    else if (keyCode === UP_ARROW) this.y -= step;
    else if (keyCode === DOWN_ARROW) this.y += step;
  }
}

class Vehicle {
  constructor(x, y, speed, dir) {
    this.x = x;
    this.y = y;
    this.w = 40;
    this.h = 20;
    this.speed = speed;
    this.dir = dir;
  }

  move() {
    this.x += this.speed * this.dir;
    // Wraparound logic was fixed and helped by CHATGPT: https://chatgpt.com/share/682fb0bb-90c8-800e-a759-040c0afec545
    if (this.x > width + this.w) this.x = -this.w;
    if (this.x < -this.w) this.x = width + this.w;
  }

  show() {
    fill(255, 0, 0);
    rect(this.x, this.y, this.w, this.h);
  }

  hits(player) {
    // AABB collision detection (Axis-Aligned Bounding Box) -- Was helped and improved by chatgpt: https://chatgpt.com/share/682fc1b1-c278-800e-9871-05120a673a85
    return (
      player.x < this.x + this.w &&
      player.x + player.size > this.x &&
      player.y < this.y + this.h &&
      player.y + player.size > this.y
    );
  }
}

class Log {
  constructor(x, y, w, speed, dir) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = 20;
    this.speed = speed;
    this.dir = dir;
  }

  move() {
    this.x += this.speed * this.dir;
    // Log wraparound - similar to vehicle
    if (this.x > width + this.w) this.x = -this.w;
    if (this.x < -this.w) this.x = width + this.w;
  }

  show() {
    fill(139, 69, 19); // Brown color for log
    rect(this.x, this.y, this.w, this.h);
  }

  carries(player) {
    return (
      player.x + player.size > this.x &&
      player.x < this.x + this.w &&
      player.y + player.size > this.y &&
      player.y < this.y + this.h
    );
  }
}

function drawHUD() {
  fill(255);
  textSize(18);
  text("Score: " + score, 50, 20); // Moved more to right so it's visible (adjusted manually)
  text("Lives: " + lives, 520, 20); // Slightly left from edge
}

function drawStartScreen() {
  background(30);
  fill(255);
  textAlign(CENTER);
  textSize(28);
  text("Welcome to THE FROGGER GAME.", width / 2, height / 2 - 40);
  textSize(18);
  text("Press ENTER to BEGIN.", width / 2, height / 2);
}

function drawEndScreen() {
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(28);
  text("Game Over :'(", width / 2, height / 2 - 40);
  textSize(18);
  text("Score: " + score, width / 2, height / 2);
  text("Press R to Restart ;)", width / 2, height / 2 + 40);
}

function drawWinScreen() {
  background(20, 100, 20);
  fill(255);
  textAlign(CENTER);
  textSize(28);
  text("YAY! You Wiiiin! :D", width / 2, height / 2 - 40);
  textSize(18);
  text("Final Score: " + score, width / 2, height / 2);
  text("Press R to Restart ;)", width / 2, height / 2 + 40);
}
