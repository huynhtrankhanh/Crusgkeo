import DetectCell from "./DetectCell";
import DrawBoard from "./DrawBoard";
import GameStateManager from "./GameState";
import MousePosition from "./MousePosition";
import { waitForAllImages } from "./textures";

await waitForAllImages;

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

const rowCount = 3;
const columnCount = 8;

const state = new GameStateManager(rowCount, columnCount);

requestAnimationFrame(function animate(time) {
  requestAnimationFrame(animate);

  const cellWidth = Math.min(
    Math.trunc(Math.min((width - 20) / columnCount, (height - 20) / rowCount)),
    64
  );
  const shapeSize = Math.trunc(cellWidth * 0.85);

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

  if (
    state.state.type === "animate swap" ||
    state.state.type === "reject swap"
  ) {
    const { heldCell, swappedWith, board } = state.state;
    drawBoard.drawBoard(board, {
      type: "ignore cells",
      cells: [heldCell, swappedWith],
    });
    const { animationTimeOrigin } = state.state;

    const animationDuration = state.state.type === "reject swap" ? 300 : 100;
    const progress = (time - animationTimeOrigin) / animationDuration;
    if (progress >= 1) {
      state.completeSwap(time);
      drawBoard.drawBoard(board);
    } else {
      drawBoard.displayPartialSwap(
        board[heldCell.row][heldCell.column],
        board[swappedWith.row][swappedWith.column],
        heldCell,
        swappedWith,
        state.state.type === "animate swap"
          ? progress
          : progress <= 0.5
          ? 2 * progress
          : 2 - 2 * progress
      );
    }
  } else if (state.state.type === "shrink candies") {
    const animationDuration = 100;
    const progress =
      (time - state.state.animationTimeOrigin) / animationDuration;
    if (progress >= 1) {
      state.completeShrink(time);
    } else {
      drawBoard.drawBoard(state.state.board, {
        type: "shrink candies",
        checkAffected: state.state.toBeCleared,
        progress,
      });
    }
  } else if (state.state.type === "new candies") {
    const animationDuration = 100;
    const progress =
      (time - state.state.animationTimeOrigin) / animationDuration;
    if (progress >= 1) {
      state.completeFall(time);
    } else {
      const { board, newCandies } = state.state;
      drawBoard.drawPartialFall(board, newCandies, progress);
    }
  } else {
    const { board } = state.state;
    drawBoard.drawBoard(board);
  }

  if (cell !== null) drawBoard.highlightCell(cell.row, cell.column);
});

export {};
