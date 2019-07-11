const COLOR_LINE = "#009ee3";
const LINE_WIDTH = 2;
const GRADIENT_START = "rgba(0, 159, 228, 0)";
const GRADIENT_STOP = "rgba(0, 159, 228, 0.18)";

const scale = window.devicePixelRatio;
const canvas = document.getElementById("canvas");
canvas.height = canvas.clientHeight * scale;
canvas.width = canvas.clientWidth * scale;

let xMin = null;
let xMax = null;
let yMin = null;
let yMax = null;

for (let i of candles) {
  if (i.from < xMin || !xMin) {
    xMin = i.from;
  }
  if (i.from > xMax || !xMax) {
    xMax = i.from;
  }
  if (i.open < yMin || !yMin) {
    yMin = i.open;
  }
  if (i.open > yMax || !yMax) {
    yMax = i.open;
  }
}

const xRange = xMax - xMin;
const yRange = yMax - yMin;
const xScale = canvas.width / xRange;
const yScale = canvas.height / yRange;

const scaledData = candles.map(i => {
  return {
    x: (i.from - xMin) * xScale,
    y: (i.open - yMin) * yScale
  };
});

const ctx = canvas.getContext("2d");
const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, GRADIENT_STOP);
gradient.addColorStop(1, GRADIENT_START);

ctx.strokeStyle = COLOR_LINE;
ctx.lineWidth = LINE_WIDTH;
ctx.fillStyle = gradient;

const updateChart = data => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  data.forEach(({ x, y }, index) => {
    ctx.lineTo(x, y);
  });

  ctx.stroke();

  ctx.lineTo(xMax, canvas.height);
  ctx.lineTo(0, canvas.height);

  ctx.fill();
};

// Initial draw
updateChart(scaledData);

// Animation
const duration = 300;
const frames = 24;
const itervalTime = duration / frames;
let counter = 0;
const interval = setInterval(() => {
  const tickData = candles.map(({ from, open }, index) => {
    const nextTickTime = candles[index - 1]
      ? candles[index - 1].from
      : candles[0].from - duration;
    const delta = from - nextTickTime;
    const frameTime = (delta / frames) * counter;
    return { x: (from - frameTime - xMin) * xScale, y: (open - yMin) * yScale };
  });

  requestAnimationFrame(updateChart.bind(null, tickData));
  counter++;
}, itervalTime);
