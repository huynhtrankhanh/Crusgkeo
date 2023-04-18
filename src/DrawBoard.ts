import { Board, BoardWithBlanks, Candy, fillNewCandies } from "./Board";
import DrawShapes from "./DrawShapes";
import { boardTexture } from "./textures";

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

    const {x: topLeftX, y: topLeftY} = this.#realCoordinates(0, 0);
    this.#context.drawImage(boardTexture, topLeftX, topLeftY, this.#columnCount * this.#cellWidth, this.#rowCount * this.#cellWidth)

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
        const { x, y } = this.#realCoordinates(row, column);
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
        this.#drawCandy(candy, 0, 0);

        this.#context.restore();
      }
  }

  highlightCell(row: number, column: number) {
    const { x, y } = this.#realCoordinates(row, column);
    this.#context.lineWidth = 3;
    this.#context.strokeStyle = "black";
    this.#context.strokeRect(x, y, this.#cellWidth, this.#cellWidth);
  }

  displayPartialSwap(
    candy1: Candy,
    candy2: Candy,
    { row: row1, column: column1 }: { row: number; column: number },
    { row: row2, column: column2 }: { row: number; column: number },
    animationProgress: number
  ) {
    const { x: x1, y: y1 } = this.#realCoordinates(row1, column1);
    const { x: x2, y: y2 } = this.#realCoordinates(row2, column2);

    const interpolate = this.#interpolate(animationProgress);

    this.#drawCandy(
      candy1,
      interpolate(x1, x2) + this.#cellWidth / 2,
      interpolate(y1, y2) + this.#cellWidth / 2
    );
    this.#drawCandy(
      candy2,
      interpolate(x2, x1) + this.#cellWidth / 2,
      interpolate(y2, y1) + this.#cellWidth / 2
    );
  }

  #interpolate(animationProgress: number) {
    return (from: number, to: number) =>
      from * (1 - animationProgress) + to * animationProgress;
  }

  #realCoordinates(row: number, column: number) {
    const centerX = this.#width / 2;
    const centerY = this.#height / 2;
    const topLeftX = centerX - (this.#cellWidth * this.#columnCount) / 2;
    const topLeftY = centerY - (this.#cellWidth * this.#rowCount) / 2;

    return {
      x: topLeftX + column * this.#cellWidth,
      y: topLeftY + row * this.#cellWidth,
    };
  }

  #drawCandy(candy: Candy, x: number, y: number) {
    const {
      drawCircle,
      drawSquare,
      drawDiamond,
      drawColorBomb,
      drawVerticalStripes,
      drawHorizontalStripes,
    } = new DrawShapes(this.#context, this.#shapeSize);

    if (candy.type === "color bomb") drawColorBomb(x, y);
    else {
      if (candy.type === "circle") drawCircle(x, y);
      else if (candy.type === "square") drawSquare(x, y);
      else if (candy.type === "diamond") drawDiamond(x, y);

      if (candy.attribute === "striped horizontal") drawHorizontalStripes(x, y);
      else if (candy.attribute === "striped vertical")
        drawVerticalStripes(x, y);
      else if (candy.attribute === "wrapped") drawColorBomb(x, y);
    }
  }

  drawPartialFall(
    board: BoardWithBlanks,
    newCandies: Candy[][],
    progress: number
  ) {
    let counter = 0;
    const stubbedBoard = board.map((row) =>
      row.map((x) => (x === null ? null : counter++))
    );
    const stubbedNewCandies = newCandies.map((column) =>
      column.map(() => counter++)
    );
    const afterFilling = fillNewCandies(stubbedBoard, stubbedNewCandies);

    const newPositions = Array.from({ length: counter }, () => ({
      row: 9000,
      column: 9000,
    }));

    afterFilling.forEach((values, row) =>
      values.forEach((id, column) => {
        newPositions[id] = { row, column };
      })
    );

    const oldPositions = Array.from({ length: counter }, () => ({
      row: 9000,
      column: 9000,
    }));

    stubbedBoard.forEach((values, row) =>
      values.forEach((id, column) => {
        if (id === null) return;
        oldPositions[id] = { row, column };
      })
    );

    stubbedNewCandies.forEach((values, column) =>
      values.forEach((id, index) => {
        oldPositions[id] = { row: -values.length + index, column };
      })
    );

    this.#clear();

    const {x: topLeftX, y: topLeftY} = this.#realCoordinates(0, 0);
    this.#context.drawImage(boardTexture, topLeftX, topLeftY, this.#columnCount * this.#cellWidth, this.#rowCount * this.#cellWidth)


    // draw the grid that makes up the background
    for (let row = 0; row < this.#rowCount; row++)
      for (let column = 0; column < this.#columnCount; column++) {
        this.#context.strokeStyle = "black";
        this.#context.lineWidth = 1;
        const { x, y } = this.#realCoordinates(row, column);
        this.#context.strokeRect(x, y, this.#cellWidth, this.#cellWidth);
      }

    this.#context.save();
    this.#context.beginPath();
    this.#context.rect(
      topLeftX,
      topLeftY,
      this.#columnCount * this.#cellWidth,
      this.#rowCount * this.#cellWidth
    );
    this.#context.clip();

    const filledBoard = fillNewCandies(board, newCandies);

    const interpolate = this.#interpolate(progress);
    for (let i = 0; i < this.#rowCount; i++)
      for (let j = 0; j < this.#columnCount; j++) {
        const id = afterFilling[i][j];
        const candy = filledBoard[i][j];
        const { row: oldRow, column: oldColumn } = oldPositions[id];
        const { row: newRow, column: newColumn } = newPositions[id];
        const { x, y } = this.#realCoordinates(
          interpolate(oldRow, newRow),
          interpolate(oldColumn, newColumn)
        );
        this.#drawCandy(
          candy,
          x + this.#cellWidth / 2,
          y + this.#cellWidth / 2
        );
      }

    this.#context.restore();
  }
}

export default DrawBoard;
