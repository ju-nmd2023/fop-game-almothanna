// REFERENCES:
// - https://p5js.org/reference/
// - https://www.w3schools.com/jsref/
// - Log logic inspired by: https://youtu.be/giXV6xErw0Y (Frogger Game)
// - Some collision logic and wraparound code explained by ChatGPT and p5.js forums, Code is cleaned as well and some are organised by CHATGPT.




let player;
let vehicles = [];
let logs = [];

let score = 0;
let lives = 3;
let gameState = "start";

let lanes = {
  roadStart: 400,
  roadEnd: 520,
  riverStart: 160,
  riverEnd: 280
};

function setup() {
  createCanvas(600, 600);
  player = new Player();

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let y = 400 + i * 40;
      let x = j * 220;
      let speed = 2 + i;
      let dir = i % 2 === 0 ? 1 : -1;
      vehicles.push(new Vehicle(x, y, speed, dir));
    }
  }

  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      let y = 160 + i * 40;

      let x;
      if (i === 0 && j === 0) x = 10; 
      else x = j * 250 + (i % 2 === 0 ? 100 : 50);

      let speed = 2 + i * 0.5;
      let dir = i % 2 === 0 ? 1 : -1;
      logs.push(new Log(x, y, 120, speed, dir));
    }
  }
}

function draw() {
  background(50);

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
  drawZones();

  for (let v of vehicles) {
    v.move();
    v.show();
    if (v.hits(player)) loseLife();
  }

  let onLog = false;
  for (let l of logs) {
    l.move();
    l.show();
    if (l.carries(player)) {
      player.x += l.speed * l.dir;
      onLog = true;
    }
  }

  if (player.y >= lanes.riverStart && player.y < lanes.riverEnd && !onLog) {
    loseLife();
  }

  player.update();
  player.show();

  if (player.y < 40) {
    score++;
    player.reset();
  }

  drawHUD();
}

function loseLife() {
  lives--;
  if (lives <= 0) {
    gameState = "gameover";
  }
  player.reset();
}

function keyPressed() {
  if (gameState === "start" && keyCode === ENTER) {
    gameState = "playing";
  }

  if (gameState === "gameover" && key === 'r') {
    lives = 3;
    score = 0;
    gameState = "playing";
    player.reset();
  }

  if (gameState === "playing") {
    player.move(keyCode);
  }
}

function drawZones() {
  fill(100);
  rect(0, 0, width, 40);
  rect(0, height - 40, width, 40);

  fill(150);
  rect(0, 400, width, 120);

  fill(30, 144, 255);
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
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);
  }

  show() {
    fill(0, 255, 0);
    rect(this.x, this.y, this.size, this.size);
  }

  move(keyCode) {
    let step = 32; 

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
    if (this.x > width + this.w) this.x = -this.w;
    if (this.x < -this.w) this.x = width + this.w;
  }

  show() {
    fill(255, 0, 0);
    rect(this.x, this.y, this.w, this.h);
  }

  hits(player) {
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
    if (this.x > width + this.w) this.x = -this.w;
    if (this.x < -this.w) this.x = width + this.w;
  }

  show() {
    fill(139, 69, 19);
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
  text("Score: " + score, 10, 20);
  text("Lives: " + lives, 500, 20);
}

function drawStartScreen() {
  background(30);
  fill(255);
  textAlign(CENTER);
  textSize(28);
  text("FROGGER", width / 2, height / 2 - 40);
  textSize(18);
  text("Press ENTER to Start", width / 2, height / 2);
}

function drawEndScreen() {
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(28);
  text("Game Over", width / 2, height / 2 - 40);
  textSize(18);
  text("Score: " + score, width / 2, height / 2);
  text("Press R to Restart", width / 2, height / 2 + 40);
}
