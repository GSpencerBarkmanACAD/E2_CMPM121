export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;

let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

const modelChanges = new EventTarget();

type Snapshot = {
  current: number;
  capacity: number;
  missing: number;
};

function shieldSnapshot(): Snapshot {
  return {
    current: count,
    capacity: 10,
    missing: 10 - count,
  };
}

function drawMeter() {
  const current_shield = shieldSnapshot();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < current_shield.capacity; i++) {
    ctx.fillStyle = i < current_shield.current ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }

  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(
    `${current_shield.current} / ${current_shield.capacity} shield`,
    12,
    100,
  );
  readout.textContent =
    `Shield charge: ${current_shield.current} / ${current_shield.capacity}`;
}

function updateStats() {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  if (!panel) return;

  const shield = shieldSnapshot();
  panel.textContent =
    `Shield charge: ${shield.current} · Missing charge: ${shield.missing}`;
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(10, next));
  if (bounded === count) return;
  count = bounded;

  modelChanges.dispatchEvent(new Event("Shield Changed"));
}

modelChanges.addEventListener("Shield Changed", () => {
  drawMeter();
});

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);

  const shield = shieldSnapshot();
  panel.textContent =
    `Shield charge: ${shield.current} · Missing charge: ${shield.missing}`;

  modelChanges.addEventListener("Shield Changed", updateStats);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;

  modelChanges.removeEventListener("Shield Changed", updateStats);

  panel.remove();
  panel = null;
};
drawMeter();
