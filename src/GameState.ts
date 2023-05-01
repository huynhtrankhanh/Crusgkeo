import {
  Board,
  BoardWithBlanks,
  Candy,
  blankAllMatches,
  doesBoardHaveMatches,
  fillNewCandies,
  generateBoardWithoutMatches,
  generateNewCandies,
  getToBeBlankedCells,
} from "./Board";

type GameFadeStatus =
  | { type: "no" }
  | { type: "fading"; startFadingAt: number };

type InGame =
  | {
      board: Board;
      type: "nothing";
      // when the user holds a cell and drags to another cell, the two cells are swapped and then the game state transitions back to "nothing". however this doesn't mean when the user continues moving the cursor we should continue swapping immediately. the user must release the mouse in order to perform a new swap
      mouseNotReleasedYet: boolean;
      fadeStatus: GameFadeStatus;
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
      fadeStatus: GameFadeStatus;
    }
  | {
      board: Board;
      type: "shrink candies";
      toBeCleared: (row: number, column: number) => boolean;
      animationTimeOrigin: number;
      mouseNotReleasedYet: boolean;
      fadeStatus: GameFadeStatus;
    }
  | {
      board: BoardWithBlanks;
      type: "new candies";
      newCandies: Candy[][];
      animationTimeOrigin: number;
      mouseNotReleasedYet: boolean;
      fadeStatus: GameFadeStatus;
    };

type StartScreen =
  | {
      type: "start screen";
    }
  | { type: "start screen fades away"; animationTimeOrigin: number };

type ResultScreen =
  | {
      type: "result screen";
      score: number;
    }
  | {
      type: "result screen fades away";
      score: number;
      animationTimeOrigin: number;
    };

type GameState =
  | StartScreen
  | (InGame & { score: number; gameStartAt: number })
  | ResultScreen;

class GameStateManager {
  state: GameState;
  #rowCount: number;
  #columnCount: number;
  constructor(rowCount: number, columnCount: number) {
    this.state = { type: "start screen" };
    this.#rowCount = rowCount;
    this.#columnCount = columnCount;
  }

  displayStartScreen() {
    this.state = { type: "start screen" };
  }

  fadeStartScreen(timeOrigin: number) {
    this.state = {
      type: "start screen fades away",
      animationTimeOrigin: timeOrigin,
    };
  }

  displayGame(timeOrigin: number) {
    this.state = {
      board: generateBoardWithoutMatches(this.#columnCount, this.#rowCount),
      type: "nothing",
      mouseNotReleasedYet: false,
      score: 0,
      gameStartAt: timeOrigin,
      fadeStatus: { type: "no" },
    };
  }

  fadeGame(timeOrigin: number) {
    if (
      this.state.type === "start screen" ||
      this.state.type === "start screen fades away" ||
      this.state.type === "result screen" ||
      this.state.type === "result screen fades away"
    )
      return;

    if (this.state.type === "cell held") {
      this.state = {
        type: "nothing",
        board: this.state.board,
        fadeStatus: { type: "fading", startFadingAt: timeOrigin },
        mouseNotReleasedYet: true,
        score: this.state.score,
        gameStartAt: this.state.gameStartAt,
      };
    } else {
      this.state.fadeStatus = { type: "fading", startFadingAt: timeOrigin };
    }
  }

  showResult() {
    if (
      this.state.type === "start screen" ||
      this.state.type === "start screen fades away"
    )
      return;

    this.state = { type: "result screen", score: this.state.score };
  }

  fadeResult(timeOrigin: number) {
    if (this.state.type !== "result screen") return;

    this.state = {
      type: "result screen fades away",
      score: this.state.score,
      animationTimeOrigin: timeOrigin,
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
        score: this.state.score,
        gameStartAt: this.state.gameStartAt,
        fadeStatus: { type: "no" },
      };
    }
  }

  holdCell(row: number, column: number, timeOrigin: number) {
    if (
      this.state.type === "start screen" ||
      this.state.type === "start screen fades away" ||
      this.state.type === "result screen" ||
      this.state.type === "result screen fades away"
    )
      return;

    if (this.state.type !== "cell held" && this.state.mouseNotReleasedYet) {
      return;
    }
    if (this.state.type === "nothing") {
      this.state = {
        board: this.state.board,
        type: "cell held",
        heldCell: { row, column },
        score: this.state.score,
        gameStartAt: this.state.gameStartAt,
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
        const determineType = (
          board: Board
        ): "animate swap" | "reject swap" => {
          // Swap two cells temporarily to check whether this move is legal
          [board[row][column], board[row1][column1]] = [
            board[row1][column1],
            board[row][column],
          ];
          const matchesExist = doesBoardHaveMatches(board);
          // Swap two cells back
          [board[row][column], board[row1][column1]] = [
            board[row1][column1],
            board[row][column],
          ];
          return matchesExist ? "animate swap" : "reject swap";
        };

        this.state = {
          board: this.state.board,
          type: determineType(board),
          heldCell: this.state.heldCell,
          swappedWith: { row, column },
          animationTimeOrigin: timeOrigin,
          mouseNotReleasedYet: true,
          score: this.state.score,
          gameStartAt: this.state.gameStartAt,
          fadeStatus: { type: "no" },
        };
      } else {
        this.state = {
          board: this.state.board,
          type: "nothing",
          mouseNotReleasedYet: true,
          score: this.state.score,
          gameStartAt: this.state.gameStartAt,
          fadeStatus: { type: "no" },
        };
      }
    }
  }

  releaseMouse() {
    if (
      this.state.type === "start screen" ||
      this.state.type === "start screen fades away" ||
      this.state.type === "result screen" ||
      this.state.type === "result screen fades away"
    )
      return;

    if (this.state.type === "cell held") {
      this.state = {
        board: this.state.board,
        mouseNotReleasedYet: false,
        type: "nothing",
        score: this.state.score,
        gameStartAt: this.state.gameStartAt,
        fadeStatus: { type: "no" },
      };
      return;
    } else {
      this.state.mouseNotReleasedYet = false;
      return;
    }
  }

  completeSwap(animationTimeOrigin: number) {
    if (this.state.type === "animate swap") {
      const { row: row1, column: column1 } = this.state.heldCell;
      const { row: row2, column: column2 } = this.state.swappedWith;

      [this.state.board[row1][column1], this.state.board[row2][column2]] = [
        this.state.board[row2][column2],
        this.state.board[row1][column1],
      ];

      this.state = {
        board: this.state.board,
        mouseNotReleasedYet: this.state.mouseNotReleasedYet,
        type: "shrink candies",
        toBeCleared: getToBeBlankedCells(this.state.board),
        animationTimeOrigin,
        score: this.state.score,
        gameStartAt: this.state.gameStartAt,
        fadeStatus: { type: "no" },
      };
    } else if (this.state.type === "reject swap") {
      this.state = {
        board: this.state.board,
        mouseNotReleasedYet: this.state.mouseNotReleasedYet,
        type: "nothing",
        score: this.state.score,
        gameStartAt: this.state.gameStartAt,
        fadeStatus: { type: "no" },
      };
    }
  }

  completeShrink(animationTimeOrigin: number) {
    if (this.state.type !== "shrink candies") return;
    const blankedBoard = blankAllMatches(this.state.board);
    const newCandies = generateNewCandies(blankedBoard);

    this.state = {
      board: blankedBoard,
      mouseNotReleasedYet: this.state.mouseNotReleasedYet,
      type: "new candies",
      newCandies,
      animationTimeOrigin,
      score:
        this.state.score +
        blankedBoard.reduce(
          (accumulated, current) =>
            accumulated +
            current.reduce(
              (accumulated, current) => accumulated + Number(current === null),
              0
            ),
          0
        ),
      gameStartAt: this.state.gameStartAt,
      fadeStatus: { type: "no" },
    };
  }

  completeFall(animationTimeOrigin: number) {
    if (this.state.type !== "new candies") return;
    const newBoard = fillNewCandies(this.state.board, this.state.newCandies);

    if (doesBoardHaveMatches(newBoard)) {
      this.state = {
        board: newBoard,
        mouseNotReleasedYet: this.state.mouseNotReleasedYet,
        type: "shrink candies",
        toBeCleared: getToBeBlankedCells(newBoard),
        animationTimeOrigin,
        score: this.state.score,
        gameStartAt: this.state.gameStartAt,
        fadeStatus: { type: "no" },
      };
    } else {
      this.state = {
        board: newBoard,
        mouseNotReleasedYet: this.state.mouseNotReleasedYet,
        type: "nothing",
        score: this.state.score,
        gameStartAt: this.state.gameStartAt,
        fadeStatus: { type: "no" },
      };
    }
  }
}

export default GameStateManager;
