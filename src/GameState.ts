import { Board } from "./Board";

type Effect = undefined; // sorry let's stub this out for now

type GameState =
  | {
      board: Board;
      type: "nothing";
    }
  | {
      board: Board;
      type: "cell held";
      heldCell: { row: number; column: number };
    }
  | {
      board: Board;
      type: "animate swap" | "revert swap";
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
