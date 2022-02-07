import canvas from 'canvas';
import terminalImage from 'terminal-image';

const { createCanvas } = canvas;

let grid = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const createSandPile = (startingHeight) => {
  grid[1][1] = startingHeight;
};

const addBoarder = (grid) => {
  const newGrid = [Array.from({ length: grid[0].length + 2 }).map(() => 0)];
  grid.forEach((row) => {
    newGrid.push([0, ...row, 0]);
  });
  newGrid.push(Array.from({ length: grid[0].length + 2 }).map(() => 0));
  return newGrid;
};

const resolveSandPile = (grid) => {
  let newGrid = grid.map((row) => row.slice());

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
          newGrid[rowIndex - 1]?.[cellIndex],
          newGrid[rowIndex + 1]?.[cellIndex],
          newGrid[rowIndex]?.[cellIndex - 1],
          newGrid[rowIndex]?.[cellIndex + 1],
        ].some((cell) => cell == null)
      ) {
        newGrid = addBoarder(newGrid);
        rowIndex += 1;
        cellIndex += 1;
      }

      newGrid[rowIndex][cellIndex] = cell % 4;
      newGrid[rowIndex - 1][cellIndex] += Math.floor(cell / 4);
      newGrid[rowIndex + 1][cellIndex] += Math.floor(cell / 4);
      newGrid[rowIndex][cellIndex - 1] += Math.floor(cell / 4);
      newGrid[rowIndex][cellIndex + 1] += Math.floor(cell / 4);
    }
  });
  return newGrid;
};

const needsResolve = (grid) => grid.some((row) => row.some((cell) => cell > 3));

const colors = ['#000', '#ffdd00', '#ff6200', '#ff2f00'];

const drawCanvas = (grid) => {
  const canvas = createCanvas(grid[0].length * 10, grid.length * 10);
  const ctx = canvas.getContext('2d');

  grid.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (colors[cell]) {
        ctx.fillStyle = colors[cell];
      } else {
        ctx.fillStyle = '#e527dc';
      }
      ctx.beginPath();
      ctx.arc(cellIndex * 10 + 5, rowIndex * 10 + 5, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  });

  return canvas;
};

const main = async () => {
  createSandPile(process.argv[2]);
  while (needsResolve(grid)) {
    grid = resolveSandPile(grid);
    console.log(await terminalImage.buffer(drawCanvas(grid).toBuffer()));
  }
  // console.log(await terminalImage.buffer(drawCanvas(grid).toBuffer()));
};

main();
