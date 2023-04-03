import DetectCell from "./DetectCell";
import DrawBoard from "./DrawBoard";
import GameStateManager from "./GameState";
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
const rowCount = 3;
const columnCount = 8;

const shapeSize = 48;

const state = new GameStateManager(rowCount, columnCount);
const board = state.state.board;

requestAnimationFrame(function animate(time) {
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

  const detectCell = new DetectCell(
    width,
    height,
    rowCount,
    columnCount,
    cellWidth
  );

  const cell = detectCell.detect(mousePosition.x, mousePosition.y);

  if (mousePosition.leftButtonHeld) {
    if (cell === null) {
      state.holdOutsideBoard();
    } else {
      state.holdCell(cell.row, cell.column, time);
    }
  } else {
    state.releaseMouse();
  }

  if (state.state.type === "animate swap") {
    const { heldCell, swappedWith } = state.state;
    drawBoard.drawBoard(board, [heldCell, swappedWith]);
    const { animationTimeOrigin } = state.state;

    const animationDuration = 100;
    const progress = (time - animationTimeOrigin) / animationDuration;
    if (progress >= 1) {
      state.completeSwap();
      drawBoard.drawBoard(board);
    } else {
      drawBoard.displayPartialSwap(
        board[heldCell.row][heldCell.column],
        board[swappedWith.row][swappedWith.column],
        heldCell,
        swappedWith,
        progress
      );
    }
  } else {
    drawBoard.drawBoard(board);
  }

  if (cell !== null) drawBoard.highlightCell(cell.row, cell.column);
});

export {};
