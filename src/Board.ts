export type Candy =
  | {
      type: "circle" | "square" | "diamond";
      attribute: "none" | "striped vertical" | "striped horizontal" | "wrapped";
    }
  | { type: "color bomb" };

export type Board = Candy[][];

export type BoardWithBlanks = (Candy | null)[][];

export const doesBoardHaveMatches = (board: Board) =>
  areThereThreeItemsOnALine(board.map((row) => row.map(({ type }) => type)));

const areThereThreeItemsOnALine = <T>(board: T[][]) =>
  board.some(checkRow) || transpose(board).some(checkRow);

export const transpose = <T>(board: T[][]) =>
  board[0].map((_, i) => board.map((row) => row[i]));

const checkRow = <T>(row: T[]) =>
  row.some(
    (value, index) =>
      index + 3 <= row.length &&
      value === row[index + 1] &&
      value === row[index + 2]
  );

export const generateAnyBoard = (width: number, height: number): Board => {
  const choices: ("square" | "circle" | "diamond")[] = [
    "square",
    "circle",
    "diamond",
  ];
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      type: choices[(Math.random() * 3) | 0],
      attribute: "none",
    }))
  );
};

// This function will be extremely slow for large boards!
export const generateBoardWithoutMatches = (width: number, height: number) => {
  while (true) {
    const board = generateAnyBoard(width, height);
    if (!doesBoardHaveMatches(board)) return board;
  }
};

// This function mutates the original array and coerces it to BoardWithBlanks
export const blankAllMatches = (board: Board): BoardWithBlanks => {
  const height = board.length;
  const width = board[0].length;

  const marked = Array.from({ length: width * height }, () => false);
  const mark = (row: number, column: number) => {
    marked[row * width + column] = true;
  };
  const check = (row: number, column: number) => marked[row * width + column];

  for (let row = 0; row < height; row++)
    for (let column = 0; column < width; column++) {
      if (row + 3 <= height) {
        const type1 = board[row][column].type;
        const type2 = board[row + 1][column].type;
        const type3 = board[row + 2][column].type;

        if (type1 === type2 && type2 === type3) {
          mark(row, column);
          mark(row + 1, column);
          mark(row + 2, column);
        }
      }

      if (column + 3 <= width) {
        const type1 = board[row][column].type;
        const type2 = board[row][column + 1].type;
        const type3 = board[row][column + 2].type;

        if (type1 === type2 && type2 === type3) {
          mark(row, column);
          mark(row, column + 1);
          mark(row, column + 2);
        }
      }
    }

  const newBoard: BoardWithBlanks = board;

  for (let row = 0; row < height; row++)
    for (let column = 0; column < width; column++) {
      if (check(row, column)) newBoard[row][column] = null;
    }

  return newBoard;
};

// column -> candies
export const generateNewCandies = (board: BoardWithBlanks): Candy[][] =>
  board[0]
    .map((_, column) =>
      board.reduce(
        (accumulated, _, row) =>
          accumulated + Number(board[row][column] === null),
        0
      )
    )
    .map((candyCount) =>
      Array.from({ length: candyCount }, (): Candy => {
        const types: ("circle" | "square" | "diamond")[] = [
          "circle",
          "square",
          "diamond",
        ];
        return {
          type: types[Math.trunc(Math.random() * 3)],
          attribute: "none",
        };
      })
    );

export const fillNewCandies = (
  board: BoardWithBlanks,
  newCandies: Candy[][]
): Board =>
  transpose(
    transpose(board).map((row, i) => [
      ...newCandies[i],
      ...(row.filter((x) => x !== null) as Candy[]),
    ])
  );
