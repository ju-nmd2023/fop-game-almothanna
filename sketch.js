
function setup() {
    createCanvas(600, 600);
  }
  
  function draw() {
    background(220);
  }
  

  let player;

function setup() {

  createCanvas(600, 600);
  player = new Player();

}

function draw() {
    background(220);
    player.update();
    player.show();
  }
  
  function keyPressed() {
    player.move(keyCode);
  }


  function keyPressed() {

    player.move(keyCode);

  }
  
  class Player {
    constructor() {

      this.x = width / 2;
      this.y = height - 22;
      this.size = 22;
    }
}