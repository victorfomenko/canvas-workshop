const COLOR_LINE = "#009ee3";
const LINE_WIDTH = 2;

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
ctx.strokeStyle = COLOR_LINE;
ctx.lineWidth = LINE_WIDTH;

scaledData.forEach(({ x, y }) => {
  ctx.lineTo(x, y);
});

ctx.stroke();
