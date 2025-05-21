
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
let gameState = "start"; //  Game state: "start", "playing" or "gameover"

// River/road lane positioning
let lanes = {
  roadStart: 400,
  roadEnd: 520,
  riverStart: 160,
  riverEnd: 280
};

function setup() {
  createCanvas(600, 600);
  player = new Player();


  // vehicles/ the red moving objects?
  // creates 3 lanes of cars, each with different speed and direction
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let y = 400 + i * 40;
      let x = j * 220;
      let speed = 2 + i; // faster lanes as we go up
      let dir = i % 2 === 0 ? 1 : -1; // alternate directions
      vehicles.push(new Vehicle(x, y, speed, dir));
    }
  }

  // Logs
  // 🪵 Each log lane has 2 logs. Log movement logic inspired by The Coding Train
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      let y = 160 + i * 40; // river zones start at y=160
      // stagger logs so they don’t all align (ChatGPT suggestion)
      let x = j * 300 + (i % 2 === 0 ? 0 : 100);
      let speed = 2 + i * 0.5;
      let dir = i % 2 === 0 ? 1 : -1;
      logs.push(new Log(x, y, 100, speed, dir));
    }
  }
}

function draw() {
  background(50);

  // Game State Logic
  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "playing") {
    drawGame();
  } else if (gameState === "gameover") {
    drawEndScreen();
  }
}


  drawZones(); // Draw safe zones, river, and road

  // cars
  for (let v of vehicles) {
    v.move();
    v.show();
    if (v.hits(player)) {
      player.reset(); // a collision with car resets player
    }
  }

  // logs + water death
  let onLog = false;
  for (let l of logs) {
    l.move();
    l.show();
    if (l.carries(player)) {
      // Player rides log – a mechanic from classic Frogger youtube vidoe
      player.x += l.speed * l.dir;
      onLog = true;
    }
  }

  // if player is in river area but not on a log, they die
  // Used bounding box Y check (from p5.js reference)
  if (player.y >= 160 && player.y < 280 && !onLog) {
    player.reset(); // “Fall in water” effect
  }

  player.update();
  player.show();


  function keyPressed() {
    if (gameState === "start" && keyCode === ENTER) {
      gameState = "playing";
    }
  
    if (gameState === "gameover" && key === 'r') {
      // Reset game
      lives = 3;
      score = 0;
      gameState = "playing";
      player.reset();
    }
  
    if (gameState === "playing") {
      player.move(keyCode);
    }
  }

//  The visual lanes: river, road, safe zones so player doesnt die
function drawZones() {
  fill(100); // Safe zones
  rect(0, 0, width, 40);
  rect(0, height - 40, width, 40);

  fill(150); // Road section
  rect(0, 400, width, 120);

  fill(30, 144, 255); // River (dodger blue)
  rect(0, 160, width, 120);
}

// This is the player class 
class Player {
  constructor() {
    this.size = 22;
    this.reset();
  }

  reset() {
    // to start at the center bottom
    this.x = width / 2;
    this.y = height - this.size - 10;
  }

  update() {
    // This to keeping the player inside the screen
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);
  }

  show() {
    fill(0, 255, 0);
    rect(this.x, this.y, this.size, this.size);
  }

  move(keyCode) {
    // The movement code from p5.js keycode references
    if (keyCode === LEFT_ARROW) this.x -= 20;
    else if (keyCode === RIGHT_ARROW) this.x += 20;
    else if (keyCode === UP_ARROW) this.y -= 20;
    else if (keyCode === DOWN_ARROW) this.y += 20;
  }
}

// Vehicle class 
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
    // Horizontal movement with looping at screen edge
    this.x += this.speed * this.dir;

    // Wraparound code adapted from ChatGPT suggestion
    if (this.x > width + this.w) this.x = -this.w;
    if (this.x < -this.w) this.x = width + this.w;
  }

  show() {
    fill(255, 0, 0); // Red car
    rect(this.x, this.y, this.w, this.h);
  }

  hits(player) {
    // Axis-Aligned Bounding Box collision (from W3Schools)
    return (
      player.x < this.x + this.w &&
      player.x + player.size > this.x &&
      player.y < this.y + this.h &&
      player.y + player.size > this.y
    );
  }
}

//  Log class
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

    // Log wrap-around inspired by vehicle logic (Gotten by CHATGPT)
    if (this.x > width + this.w) this.x = -this.w;
    if (this.x < -this.w) this.x = width + this.w;
  }

  show() {
    fill(139, 69, 19); // Brown color (the wooden log)
    rect(this.x, this.y, this.w, this.h);
  }

  carries(player) {
    // This Checks if the player overlaps log bounds
    return (
      player.x + player.size > this.x &&
      player.x < this.x + this.w &&
      player.y + player.size > this.y &&
      player.y < this.y + this.h
    );
  }
}
