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

requestAnimationFrame(function animate() {
  requestAnimationFrame(animate);

  context.clearRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;

  const cellWidth = 64;
  const cellHeight = 64;
  const rowCount = 3;
  const columnCount = 10;

  const shapeSize = 48;

  const {
    drawCircle,
    drawSquare,
    drawDiamond,
    drawColorBomb,
    drawVerticalStripes,
    drawHorizontalStripes,
  } = new DrawShapes(context, shapeSize);

  for (let row = 0; row < rowCount; row++)
    for (let column = 0; column < columnCount; column++) {
      context.lineWidth = 1;
      context.strokeStyle = "black";
      const x = centerX - (cellWidth * columnCount) / 2 + column * cellWidth;
      const y = centerY - (cellWidth * rowCount) / 2 + row * cellWidth;
      context.strokeRect(x, y, cellWidth, cellHeight);

      const remainder = (row + column) % 4;
      if (remainder === 0) {
        drawCircle(x + cellWidth / 2, y + cellWidth / 2);
        drawVerticalStripes(x + cellWidth / 2, y + cellWidth / 2);
        drawColorBomb(x + cellWidth / 2, y + cellWidth / 2);
      } else if (remainder === 1) {
        drawSquare(x + cellWidth / 2, y + cellWidth / 2);
        drawHorizontalStripes(x + cellWidth / 2, y + cellWidth / 2);
      } else if (remainder === 2)
        drawDiamond(x + cellWidth / 2, y + cellWidth / 2);
      else if (remainder === 3)
        drawColorBomb(x + cellWidth / 2, y + cellWidth / 2);
    }
});

export {};
