import { generateBoardWithoutMatches } from "./Board";
import DrawBoard from "./DrawBoard";
import DrawShapes from "./DrawShapes";
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

class GameState {}

class Grid {}

class CandiesFalling extends GameState {}

class CandiesIdle extends GameState {}

const centerX = width / 2;
const centerY = height / 2;

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
});

export {};
