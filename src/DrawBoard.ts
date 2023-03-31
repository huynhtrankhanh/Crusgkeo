import { Board } from "./Board";
import DrawShapes from "./DrawShapes";

class DrawBoard {
  #width: number;
  #height: number;
  #cellWidth: number;
  #rowCount: number;
  #columnCount: number;
  #shapeSize: number;
  #context: CanvasRenderingContext2D;
  constructor(
    width: number,
    height: number,
    cellWidth: number,
    rowCount: number,
    columnCount: number,
    shapeSize: number,
    context: CanvasRenderingContext2D
  ) {
    this.#width = width;
    this.#height = height;
    this.#cellWidth = cellWidth;
    this.#rowCount = rowCount;
    this.#columnCount = columnCount;
    this.#shapeSize = shapeSize;
    this.#context = context;
  }

  #clear() {
    this.#context.clearRect(0, 0, this.#width, this.#height);
  }

  drawBoard(board: Board) {
    this.#clear();
    const {
      drawCircle,
      drawSquare,
      drawDiamond,
      drawColorBomb,
      drawVerticalStripes,
      drawHorizontalStripes,
    } = new DrawShapes(this.#context, this.#shapeSize);

    const centerX = this.#width / 2;
    const centerY = this.#height / 2;

    for (let row = 0; row < this.#rowCount; row++)
      for (let column = 0; column < this.#columnCount; column++) {
        this.#context.lineWidth = 1;
        this.#context.strokeStyle = "black";
        const x =
          centerX -
          (this.#cellWidth * this.#columnCount) / 2 +
          column * this.#cellWidth;
        const y =
          centerY -
          (this.#cellWidth * this.#rowCount) / 2 +
          row * this.#cellWidth;
        this.#context.strokeRect(x, y, this.#cellWidth, this.#cellWidth);

        const candy = board[row][column];
        if (candy.type === "color bomb")
          drawColorBomb(x + this.#cellWidth / 2, y + this.#cellWidth / 2);
        else {
          if (candy.type === "circle")
            drawCircle(x + this.#cellWidth / 2, y + this.#cellWidth / 2);
          else if (candy.type === "square")
            drawSquare(x + this.#cellWidth / 2, y + this.#cellWidth / 2);
          else if (candy.type === "diamond")
            drawDiamond(x + this.#cellWidth / 2, y + this.#cellWidth / 2);

          if (candy.attribute === "striped horizontal")
            drawHorizontalStripes(
              x + this.#cellWidth / 2,
              y + this.#cellWidth / 2
            );
          else if (candy.attribute === "striped vertical")
            drawVerticalStripes(
              x + this.#cellWidth / 2,
              y + this.#cellWidth / 2
            );
          else if (candy.attribute === "wrapped")
            drawColorBomb(x + this.#cellWidth / 2, y + this.#cellWidth / 2);
        }
      }
  }

  highlightCell(row: number, column: number) {
    const centerX = this.#width / 2;
    const centerY = this.#height / 2;
    const topLeftX = centerX - (this.#cellWidth * this.#columnCount) / 2;
    const topLeftY = centerY - (this.#cellWidth * this.#rowCount) / 2;
    this.#context.lineWidth = 3;
    this.#context.strokeStyle = "red";
    this.#context.strokeRect(
      topLeftX + column * this.#cellWidth,
      topLeftY + row * this.#cellWidth,
      this.#cellWidth,
      this.#cellWidth
    );
  }
}

export default DrawBoard;
