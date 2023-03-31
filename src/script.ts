import { generateBoardWithoutMatches } from "./Board";
import DetectCell from "./DetectCell";
import DrawBoard from "./DrawBoard";
import MousePosition from "./MousePosition";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const mousePosition = new MousePosition(canvas);

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

const context = canvas.getContext("2d");
if (context === null) throw new Error("Failure obtaining context");

const cellWidth = 64;
const rowCount = 8;
const columnCount = 8;

const shapeSize = 48;

const board = generateBoardWithoutMatches(columnCount, rowCount);

requestAnimationFrame(function animate() {
  requestAnimationFrame(animate);

  context.clearRect(0, 0, width, height);

  const drawBoard = new DrawBoard(
    width,
    height,
    cellWidth,
    rowCount,
    columnCount,
    shapeSize,
    context
  );

  drawBoard.drawBoard(board);

  const detectCell = new DetectCell(
    width,
    height,
    rowCount,
    columnCount,
    cellWidth
  );

  const cell = detectCell.detect(mousePosition.x, mousePosition.y);

  if (cell !== null) drawBoard.highlightCell(cell.row, cell.column);
});

export {};
