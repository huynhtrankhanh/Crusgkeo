type Candy =
  | {
      type: "circle" | "square" | "diamond";
      attribute: "none" | "striped vertical" | "striped horizontal" | "wrapped";
    }
  | { type: "color bomb" };

type Board = Candy[][];

const doesBoardHaveMatches = (board: Board) =>
  areThereThreeItemsOnALine(board.map((row) => row.map(({ type }) => type)));

const areThereThreeItemsOnALine = <T>(board: T[][]) =>
  board.some(checkRow) || transpose(board).some(checkRow);

const transpose = <T>(board: T[][]) =>
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
    if (!areThereThreeItemsOnALine(board)) return board;
  }
};
