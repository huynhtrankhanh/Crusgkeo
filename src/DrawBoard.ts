import { Board, Candy } from "./Board";
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

  drawBoard(
    board: Board,
    specialAction?:
      | { type: "ignore cells"; cells: { row: number; column: number }[] }
      | {
          type: "shrink candies";
          checkAffected: (row: number, column: number) => boolean;
          progress: number;
        }
  ) {
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

    const testIgnoredCell = Array.from(
      { length: this.#rowCount * this.#columnCount },
      () => false
    );

    if (specialAction !== undefined && specialAction.type === "ignore cells") {
      for (const { row, column } of specialAction.cells) {
        testIgnoredCell[row * this.#columnCount + column] = true;
      }
    }

    const isCellIgnored = (row: number, column: number): boolean => {
      return testIgnoredCell[row * this.#columnCount + column];
    };

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

        if (isCellIgnored(row, column)) continue;

        this.#context.save();
        this.#context.translate(
          x + this.#cellWidth / 2,
          y + this.#cellWidth / 2
        );

        const currentCellAffected =
          specialAction?.type === "shrink candies" &&
          specialAction.checkAffected(row, column);

        const zoom = (factor: number) => this.#context.scale(factor, factor);

        if (currentCellAffected) zoom(1 - specialAction.progress);

        const candy = board[row][column];
        if (candy.type === "color bomb") drawColorBomb(0, 0);
        else {
          if (candy.type === "circle") drawCircle(0, 0);
          else if (candy.type === "square") drawSquare(0, 0);
          else if (candy.type === "diamond") drawDiamond(0, 0);

          if (candy.attribute === "striped horizontal")
            drawHorizontalStripes(0, 0);
          else if (candy.attribute === "striped vertical")
            drawVerticalStripes(0, 0);
          else if (candy.attribute === "wrapped") drawColorBomb(0, 0);
        }

        this.#context.restore();
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

  displayPartialSwap(
    candy1: Candy,
    candy2: Candy,
    { row: row1, column: column1 }: { row: number; column: number },
    { row: row2, column: column2 }: { row: number; column: number },
    animationProgress: number
  ) {
    const realCoordinates = (
      row: number,
      column: number
    ): { x: number; y: number } => {
      const centerX = this.#width / 2;
      const centerY = this.#height / 2;
      const topLeftX = centerX - (this.#cellWidth * this.#columnCount) / 2;
      const topLeftY = centerY - (this.#cellWidth * this.#rowCount) / 2;

      return {
        x: topLeftX + column * this.#cellWidth,
        y: topLeftY + row * this.#cellWidth,
      };
    };

    const { x: x1, y: y1 } = realCoordinates(row1, column1);
    const { x: x2, y: y2 } = realCoordinates(row2, column2);

    const interpolate = (from: number, to: number): number =>
      from * (1 - animationProgress) + to * animationProgress;

    const {
      drawCircle,
      drawSquare,
      drawDiamond,
      drawColorBomb,
      drawVerticalStripes,
      drawHorizontalStripes,
    } = new DrawShapes(this.#context, this.#shapeSize);

    const drawCandy = (candy: Candy, x: number, y: number) => {
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
          drawVerticalStripes(x + this.#cellWidth / 2, y + this.#cellWidth / 2);
        else if (candy.attribute === "wrapped")
          drawColorBomb(x + this.#cellWidth / 2, y + this.#cellWidth / 2);
      }
    };

    drawCandy(candy1, interpolate(x1, x2), interpolate(y1, y2));
    drawCandy(candy2, interpolate(x2, x1), interpolate(y2, y1));
  }
}

export default DrawBoard;
