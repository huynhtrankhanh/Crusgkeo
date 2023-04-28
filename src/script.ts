import DetectCell from "./DetectCell";
import DrawBoard from "./DrawBoard";
import GameStateManager from "./GameState";
import MousePosition from "./MousePosition";
import { waitForAllImages } from "./textures";
(async () => {
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

  canvas.addEventListener("click", (event) => {
    if (state.state.type === "start screen") {
      state.fadeStartScreen(event.timeStamp);
    } else if (state.state.type === "result screen") {
      state.fadeResult(event.timeStamp);
    }
  });

  requestAnimationFrame(function animate(time) {
    requestAnimationFrame(animate);

    const cellWidth = Math.min(
      Math.trunc(
        Math.min((width - 20) / columnCount, (height - 20) / rowCount)
      ),
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

    const drawStartScreen = () => {
      context.save();
      context.clearRect(0, 0, width, height);
      context.fillStyle = "red";
      context.font = 'bold 56px "Lobster Two"';

      const drawText = (text: string, centerX: number, centerY: number) => {
        const metrics = context.measureText(text);
        context.fillText(
          text,
          centerX - metrics.width / 2,
          centerY - metrics.actualBoundingBoxAscent / 2
        );
      };

      {
        const text = "Candy Crush Clone";
        const metrics = context.measureText(text);
        if (metrics.width >= width) context.font = 'bold 48px "Lobster Two"';
        drawText("Candy Crush Clone", width / 2, height / 2);
      }
      context.font = '30px "Lobster Two"';
      context.fillStyle = "black";
      drawText("tap anywhere to play", width / 2, height / 2 + 30);
      context.restore();
    };

    if (state.state.type === "start screen") {
      drawStartScreen();
      return;
    } else if (state.state.type === "start screen fades away") {
      const origin = state.state.animationTimeOrigin;
      const duration = 1000;
      const progress = (time - origin) / duration;

      if (progress >= 1) {
        state.displayGame(time);
      } else {
        context.save();
        context.globalAlpha = 1 - progress;
        drawStartScreen();
        context.restore();
      }
      return;
    } else if (state.state.type === "result screen") {
      return;
    } else if (state.state.type === "result screen fades away") {
      return;
    }

    if (mousePosition.leftButtonHeld) {
      if (cell === null) {
        state.holdOutsideBoard();
      } else {
        state.holdCell(cell.row, cell.column, time);
      }
    } else {
      state.releaseMouse();
    }

    const drawGame = (time: number, suspend: boolean) => {
      if (
        state.state.type === "start screen" ||
        state.state.type === "start screen fades away" ||
        state.state.type === "result screen" ||
        state.state.type === "result screen fades away"
      )
        return;

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

        const animationDuration =
          state.state.type === "reject swap" ? 300 : 100;
        const progress = Math.min(
          (time - animationTimeOrigin) / animationDuration,
          1
        );
        if (progress >= 1 && !suspend) {
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
        const progress = Math.min(
          (time - state.state.animationTimeOrigin) / animationDuration,
          1
        );
        if (progress >= 1 && !suspend) {
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
        const progress = Math.min(
          (time - state.state.animationTimeOrigin) / animationDuration,
          1
        );
        if (progress >= 1 && !suspend) {
          state.completeFall(time);
        } else {
          const { board, newCandies } = state.state;
          drawBoard.drawPartialFall(board, newCandies, progress);
        }
      } else {
        const { board } = state.state;
        drawBoard.drawBoard(board);
      }

      drawBoard.displayScore(state.state.score);
      const timeElapsed = time - state.state.gameStartAt;
      const timeLimit = 30000;
      const displayedTimeLeft = Math.trunc(
        Math.max(timeLimit - timeElapsed, 0)/1000
      );
      drawBoard.displayTime(displayedTimeLeft);
      if (timeElapsed >= timeLimit) state.fadeGame(time);
    };

    if (
      state.state.type === "cell held" ||
      state.state.fadeStatus.type === "no"
    ) {
      drawGame(time, false);
    } else {
      context.save();
      const duration = 1000;
      const progress = (time - state.state.fadeStatus.startFadingAt) / duration;
      if (progress >= 1) {
        state.showResult();
      } else {
        context.clearRect(0, 0, width, height);
        context.globalAlpha = 1 - progress;
        drawGame(state.state.fadeStatus.startFadingAt, true);
      }
      context.restore();
    }

    if (cell !== null) drawBoard.highlightCell(cell.row, cell.column);
  });
})();
export {};
