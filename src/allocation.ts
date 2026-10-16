export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let numProducers = 2;

function update() {
  const totalProducers = numProducers * 3;
  const totalConsumption = 6;
  const balance = totalProducers - totalConsumption;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < numProducers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < numProducers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${numProducers} / 6`, 18, 76);
  ctx.fillText(`Production: ${totalProducers}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, totalProducers * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${totalConsumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, totalConsumption * 14, 20);
  readout.textContent =
    `Assigned: ${numProducers}/6 · Production: ${totalProducers} · Consumption: ${totalConsumption} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  numProducers = Math.max(0, numProducers - 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  numProducers = Math.min(6, numProducers + 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    numProducers = 2;
    update();
  };
update();
