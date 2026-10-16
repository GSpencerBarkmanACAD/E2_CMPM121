export {};

type ShiftResults = {
  numProducers: number;
  production: number;
  consumption: number;
  balance: number;
};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let numProducers = 2;

function updateProducer(results: ShiftResults) {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < results.numProducers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < results.numProducers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function updateBar(results: ShiftResults) {
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${results.numProducers} / 6`, 18, 76);
  ctx.fillText(`Production: ${results.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, results.production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${results.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, results.consumption * 14, 20);
}

function shiftResults(numProducers: number): ShiftResults {
  const production = numProducers * 3;
  const consumption = 6;
  const balance = production - consumption;

  return {
    numProducers: numProducers,
    production: production,
    consumption: consumption,
    balance: balance,
  };
}

function updateText(results: ShiftResults) {
  readout.textContent =
    `Assigned: ${results.numProducers}/6 · Production: ${results.production} · Consumption: ${results.consumption} · Balance: ${
      results.balance > 0 ? "+" : ""
    }${results.balance}`;
}

function update() {
  const results = shiftResults(numProducers);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateProducer(results);

  updateBar(results);

  updateText(results);
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
