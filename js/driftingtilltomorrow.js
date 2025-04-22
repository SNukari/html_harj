const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const car = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 40,
  height: 20,
  angle: 0,
  vx: 0,
  vy: 0,
  acceleration: 0.3,
  maxSpeed: 4,
  friction: 0.02,
  turnSpeed: 0.04,
  lateralGrip: 0.86,
  forwardGrip: 0.95
};

const keys = {};

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function update() {
  // Get forward direction
  const forwardX = Math.cos(car.angle);
  const forwardY = Math.sin(car.angle);

  // Accelerate forward
  if (keys["ArrowUp"] || keys["KeyW"]) {
    car.vx += forwardX * car.acceleration;
    car.vy += forwardY * car.acceleration;
  }

  // Brake / reverse
  if (keys["ArrowDown"] || keys["KeyS"]) {
    car.vx -= forwardX * car.acceleration * 0.5;
    car.vy -= forwardY * car.acceleration * 0.5;
  }

  // Turning
  const speed = Math.hypot(car.vx, car.vy);
  if (speed > 0.2) {
    if (keys["ArrowLeft"] || keys["KeyA"]) {
      car.angle -= car.turnSpeed * (speed / car.maxSpeed);
    }
    if (keys["ArrowRight"] || keys["KeyD"]) {
      car.angle += car.turnSpeed * (speed / car.maxSpeed);
    }
  }

  // Decompose velocity into forward and sideways
  const dotForward = car.vx * forwardX + car.vy * forwardY;
  const dotSide = car.vx * -forwardY + car.vy * forwardX;

  // Apply grip to simulate drift
  const newVX = forwardX * (dotForward * car.forwardGrip) - forwardY * (dotSide * car.lateralGrip);
  const newVY = forwardY * (dotForward * car.forwardGrip) + forwardX * (dotSide * car.lateralGrip);

  car.vx = newVX;
  car.vy = newVY;

  // Apply friction
  car.vx *= (1 - car.friction);
  car.vy *= (1 - car.friction);

  // Update position
  car.x += car.vx;
  car.y += car.vy;
}

function drawCar() {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);

  // Car body
  ctx.fillStyle = "#f33";
  ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);

  // Front marker
  ctx.fillStyle = "#fff";
  ctx.fillRect(5, -car.height / 4, 4, car.height / 2);

  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCar();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();