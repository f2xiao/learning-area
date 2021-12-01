// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

/* create a Ball Class with: 
  x, y coordinates represents center point
  velX, velY represents speed
  color represents ball color
  size represents ball radius */

class Shape {
  constructor(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
  }
}
class Ball extends Shape {
  constructor(x, y, velX, velY, exists, color, size) {
    super(x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
  }

  // create a prototype update method to update the data
  update() {
    // left edge
    if (this.x <= this.size) {
      this.velX = -this.velX;
    }
    // top edge
    if (this.y <= this.size) {
      this.velY = -this.velY;
    }

    // right edge
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }
    // bottom edge
    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  // create a prototype draw method to draw the ball onto the screen
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // create a prototype collision dectection method
  collisionDectect() {
    for (let i = 0; i < balls.length; i++) {
      if (this.exists && !(this === balls[i])) {
        const dx = this.x - balls[i].x;
        const dy = this.y - balls[i].y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (this.size + balls[i].size > distance) {
          balls[i].color = this.color = `rgb(${random(0, 255)},${random(
            0,
            255
          )},${random(0, 255)})`;
        }
      }
    }
  }
}
class EvilCircle extends Shape {
  constructor(x, y, velX, velY, exists, color, size) {
    super(x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
  }
  checkBounds() {
    // left edge
    if (this.x <= this.size) {
      this.x += this.size;
    }
    // top edge
    if (this.y <= this.size) {
      this.y += this.size;
    }

    // right edge
    if (this.x + this.size >= width) {
      this.x -= this.size;
    }
    // bottom edge
    if (this.y + this.size >= height) {
      this.y -= this.size;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  setControls() {
    let _this = this;
    window.onkeydown = function (e) {
      if (e.key === "a") {
        _this.x -= _this.velX;
      }
      if (e.key === "w") {
        _this.y -= _this.velY;
      }
      if (e.key === "s") {
        _this.y += _this.velY;
      }
      if (e.key === "d") {
        _this.x += _this.velX;
      }
    };
  }

  collisionDectect() {
    for (let i = 0; i < balls.length; i++) {
      if (balls[i].exists) {
        const dx = this.x - balls[i].x;
        const dy = this.y - balls[i].y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (this.size + balls[i].size > distance) {
          balls[i].exists = false;
          count--;
          displayScore(count);
        }
      }
    }
  }
}

// create a loop function to animate the balls
function loop() {
  ctx.fillStyle = `rgba(0,0,0,0.25)`;
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDectect();
    }
    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDectect();
  }
  requestAnimationFrame(loop);
}

function displayScore(score) {
  counter.textContent = `Ball count: ${score}`;
}

// create an array with 25 randomly generate ball objects
let balls = [];
while (balls.length < 25) {
  let size = random(10, 20);
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    true,
    `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`,
    size
  );
  balls.push(ball);
}
const counter = document.querySelector("p");
let count = 25;
displayScore(count);
const evilCircle = new EvilCircle(
  width / 2,
  height / 2,
  20,
  20,
  true,
  "white",
  10
);
evilCircle.setControls();
loop();
