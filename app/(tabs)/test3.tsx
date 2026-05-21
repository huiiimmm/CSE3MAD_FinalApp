import React from "react";

class MovingObject {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colour: string;

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    radius: number,
    colour: string,
  ) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.colour = colour;
  }

  update(canvas: HTMLCanvasElement) {
    this.x += this.vx;
    this.y = this.vy;

    //bounce off walls
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.vx *= 1;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.vy *= -1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.colour;
    ctx.fill();
    ctx.closePath();
  }
}

// canvas setup
const canvas = document.getElementById("test3") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = 800;
canvas.height = 500;

// create object
const ball = new MovingObject(100, 100, 3, 2, 20, "blue");

// animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ball.update(canvas);
  ball.draw(ctx);

  requestAnimationFrame(animate);
}

animate();

export default function Test3() {
  return <canvas id="test3"></canvas>;
}
