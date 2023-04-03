import { Board, generateBoardWithoutMatches } from "./Board";

type Effect = undefined; // sorry let's stub this out for now

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
      animateProgress: number;
    }
  | {
      board: Board;
      type: "cascade";
      effects: Effect[];
      animateProgress: number;
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
  releaseMouse() {
    if (this.state.type === "cell held") {
      this.state = {
        board: this.state.board,
        mouseNotReleasedYet: false,
        type: "nothing",
      };
      return;
    }
    if (this.state.type === "nothing") {
      this.state.mouseNotReleasedYet = false;
      return;
    }
  }
}

export default GameStateManager;
