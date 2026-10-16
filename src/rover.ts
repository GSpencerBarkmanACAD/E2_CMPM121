export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

const pendingList = document.querySelector<HTMLOListElement>("#rover-pending")!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;

type Directions = {
  heading: string;
  move_x: number;
  move_y: number;
};

const table: Directions[] = [
  { heading: "North", move_x: 0, move_y: -1 },
  { heading: "East", move_x: 1, move_y: 0 },
  { heading: "South", move_x: 0, move_y: 1 },
  { heading: "West", move_x: -1, move_y: 0 },
];

let x = 2;
let y = 2;
let direction = 0;

let queue: Command[] = [];

type Command = {
  label: string;
  execute: () => void;
};

const forward: Command = {
  label: "Forward",
  execute: () => {
    const current = table[direction];

    x = Math.max(0, Math.min(4, x + current.move_x));
    y = Math.max(0, Math.min(4, y + current.move_y));

    drawRover();
  },
};

const right: Command = {
  label: "Right",
  execute: () => {
    direction = (direction + 1) % 4;
    drawRover();
  },
};

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    table[direction].heading
  }`;
}

function drawQueue() {
  pendingList.replaceChildren();

  for (const command of queue) {
    const item = document.createElement("li");
    item.textContent = command.label;
    pendingList.appendChild(item);
  }

  queueStatus.textContent = `${queue.length} commands pending`;

  runButton.disabled = queue.length === 0;
  clearButton.disabled = queue.length === 0;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  queue.push(forward);
  drawQueue();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  queue.push(right);
  drawQueue();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  queue = [];
  drawRover();
  drawQueue();
};
document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  while (queue.length > 0) {
    const command = queue.shift()!;
    command.execute();
  }
  drawQueue();
};
document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  queue = [];
  drawQueue();
};
drawRover();
drawQueue();
