
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


update()

 {
  this.x = constrain (this.x, 0 , width - this.size);
  this.y = constrain (this.y, 0 , height - this.size);
}



show() 
{
  fill(0, 255, 0);
  rect(this.x, this.y, this.size, this.size);

}
   

move(keyCode) {
  if (keyCode === LEFT_ARROW) this.x -= 20;
  else if (keyCode === RIGHT_ARROW) this.x += 20;
  else if (keyCode === UP_ARROW) this.y -= 20;
  else if (keyCode === DOWN_ARROW) this.y += 20;
}

}