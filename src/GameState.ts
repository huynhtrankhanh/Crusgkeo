import {
  Board,
  BoardWithBlanks,
  Candy,
  blankAllMatches,
  doesBoardHaveMatches,
  fillNewCandies,
  generateBoardWithoutMatches,
  generateNewCandies,
} from "./Board";

type GameState =
  | {
      board: Board;
      type: "nothing";
      // when the user holds a cell and drags to another cell, the two cells are swapped and then the game state transitions back to "nothing". however this doesn't mean when the user continues moving the cursor we should continue swapping immediately. the user must release the mouse in order to perform a new swap
      mouseNotReleasedYet: boolean;
    }
  | {
      board: Board;
      type: "cell held";
      heldCell: { row: number; column: number };
    }
  | {
      board: Board;
      type: "animate swap" | "reject swap";
      heldCell: { row: number; column: number };
      swappedWith: { row: number; column: number };
      animationTimeOrigin: number;
      mouseNotReleasedYet: boolean;
    }
  | {
      board: BoardWithBlanks;
      type: "new candies";
      newCandies: Candy[][];
      animationTimeOrigin: number;
      mouseNotReleasedYet: boolean;
    };

class GameStateManager {
  state: GameState;
  constructor(rowCount: number, columnCount: number) {
    this.state = {
      board: generateBoardWithoutMatches(columnCount, rowCount),
      type: "nothing",
      mouseNotReleasedYet: false,
    };
  }

  holdOutsideBoard() {
    if (this.state.type === "nothing") {
      this.state.mouseNotReleasedYet = true;
    } else if (this.state.type === "cell held") {
      this.state = {
        board: this.state.board,
        mouseNotReleasedYet: true,
        type: "nothing",
      };
    }
  }

  // since calling this function may trigger an animation, a time origin is taken
  holdCell(row: number, column: number, timeOrigin: number) {
    if (this.state.type !== "cell held" && this.state.mouseNotReleasedYet) {
      return;
    }
    if (this.state.type === "nothing") {
      this.state = {
        board: this.state.board,
        type: "cell held",
        heldCell: { row, column },
      };
    } else if (this.state.type === "cell held") {
      if (
        row === this.state.heldCell.row &&
        column === this.state.heldCell.column
      )
        return;
      if (
        Math.abs(row - this.state.heldCell.row) +
          Math.abs(column - this.state.heldCell.column) ===
        1
      ) {
        const { row: row1, column: column1 } = this.state.heldCell;
        const { board } = this.state;
        const determineType = (): "animate swap" | "reject swap" => {
          // Swap two cells temporarily to check whether this move is legal
          [this.state.board[row][column], this.state.board[row1][column1]] = [
            this.state.board[row1][column1],
            this.state.board[row][column],
          ];
          const matchesExist = doesBoardHaveMatches(board);
          // Swap two cells back
          [this.state.board[row][column], this.state.board[row1][column1]] = [
            this.state.board[row1][column1],
            this.state.board[row][column],
          ];
          return matchesExist ? "animate swap" : "reject swap";
        };

        this.state = {
          board: this.state.board,
          type: determineType(),
          heldCell: this.state.heldCell,
          swappedWith: { row, column },
          animationTimeOrigin: timeOrigin,
          mouseNotReleasedYet: true,
        };
      } else {
        this.state = {
          board: this.state.board,
          type: "nothing",
          mouseNotReleasedYet: true,
        };
      }
    }
  }

  releaseMouse() {
    if (this.state.type === "cell held") {
      this.state = {
        board: this.state.board,
        mouseNotReleasedYet: false,
        type: "nothing",
      };
      return;
    } else {
      this.state.mouseNotReleasedYet = false;
      return;
    }
  }

  // when the swap animation is complete it's time to call this function
  // since after calling this function additional animations may be triggered, a time origin is taken
  completeSwap(animationTimeOrigin: number) {
    if (this.state.type === "animate swap") {
      const { row: row1, column: column1 } = this.state.heldCell;
      const { row: row2, column: column2 } = this.state.swappedWith;

      [this.state.board[row1][column1], this.state.board[row2][column2]] = [
        this.state.board[row2][column2],
        this.state.board[row1][column1],
      ];

      const blankedBoard = blankAllMatches(this.state.board);
      this.state = {
        board: blankedBoard,
        mouseNotReleasedYet: this.state.mouseNotReleasedYet,
        type: "new candies",
        newCandies: generateNewCandies(blankedBoard),
        animationTimeOrigin,
      };
    } else if (this.state.type === "reject swap") {
      this.state = {
        board: this.state.board,
        mouseNotReleasedYet: this.state.mouseNotReleasedYet,
        type: "nothing",
      };
    }
  }

  completeFall(animationTimeOrigin: number) {
    if (this.state.type !== "new candies") return;
    const newBoard = fillNewCandies(this.state.board, this.state.newCandies);

    if (doesBoardHaveMatches(newBoard)) {
      const blankedBoard = blankAllMatches(newBoard);
      this.state = {
        board: blankedBoard,
        mouseNotReleasedYet: this.state.mouseNotReleasedYet,
        type: "new candies",
        newCandies: generateNewCandies(blankedBoard),
        animationTimeOrigin,
      };
    } else {
      this.state = {
        board: newBoard,
        mouseNotReleasedYet: this.state.mouseNotReleasedYet,
        type: "nothing",
      };
    }
  }
}

export default GameStateManager;
