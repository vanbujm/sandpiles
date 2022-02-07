import canvas from 'canvas';
import terminalImage from 'terminal-image';

const { createCanvas } = canvas;

const gridSize = 255;
let grid = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => 0));

const randomNormal = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randomNormal(); // resample between 0 and 1
  return num;
};

const colors = ['#000', '#ffdd00', '#ff6200', '#ff2f00'];
const canvasScaleFactor = 10;

const changeCell = (x, y, value, ctx) => {
  grid[x][y] = value;

  if (colors[value]) {
    ctx.fillStyle = colors[value];
  } else {
    ctx.fillStyle = '#e527dc';
  }
  ctx.beginPath();
  ctx.arc(
    y * canvasScaleFactor + canvasScaleFactor / 2,
    x * canvasScaleFactor + canvasScaleFactor / 2,
    canvasScaleFactor / 2,
    0,
    2 * Math.PI
  );
  ctx.fill();
};

const resolveSandPile = (grid, ctx) => {
  let rowIndex = 0;
  let cellIndex = 0;
  const indexes = Array.from({ length: grid.length * grid[0].length })
    .map((_, i) => [i % grid.length, Math.floor(i / grid.length)])
    .sort(() => Math.random() - 0.5);

  indexes.forEach(([currentRowIndex, currentCellIndex]) => {
    rowIndex = currentRowIndex;
    cellIndex = currentCellIndex;
    const cell = grid[rowIndex][cellIndex];
    if (cell > 3) {
      if (
        [
          grid[rowIndex - 1]?.[cellIndex],
          grid[rowIndex + 1]?.[cellIndex],
          grid[rowIndex]?.[cellIndex - 1],
          grid[rowIndex]?.[cellIndex + 1],
        ].some((cell) => cell == null)
      ) {
        return;
      }
      changeCell(rowIndex, cellIndex, cell % 4, ctx);
      changeCell(rowIndex - 1, cellIndex, grid[rowIndex - 1][cellIndex] + Math.floor(cell / 4), ctx);
      changeCell(rowIndex + 1, cellIndex, grid[rowIndex + 1][cellIndex] + Math.floor(cell / 4), ctx);
      changeCell(rowIndex, cellIndex - 1, grid[rowIndex][cellIndex - 1] + Math.floor(cell / 4), ctx);
      changeCell(rowIndex, cellIndex + 1, grid[rowIndex][cellIndex + 1] + Math.floor(cell / 4), ctx);
    }
  });
  return grid;
};

const needsResolve = (grid) => grid.some((row) => row.some((cell) => cell > 3));

const main = async () => {
  const startingHeight = process.argv[2] || 10;
  const canvas = createCanvas(grid[0].length * canvasScaleFactor, grid.length * canvasScaleFactor);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < startingHeight; i++) {
    const x = Math.floor(randomNormal() * gridSize);
    const y = Math.floor(randomNormal() * gridSize);
    changeCell(x, y, grid[x][y] + 1, ctx);
    while (needsResolve(grid)) {
      resolveSandPile(grid, ctx);
    }
    if (i % 10 === 0) {
      console.log(await terminalImage.buffer(canvas.toBuffer()));
    }
  }
};

main();
