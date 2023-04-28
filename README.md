# Candy Crush Clone

This is a clone of the popular game "Candy Crush" implemented using HTML5 canvas, TypeScript, and OOP principles.

[Play now!](https://cheery-bublanina-f00bde.netlify.app)

## Game Rules

The game follows the same basic rules as Candy Crush, but with some limitations. The player needs to swap adjacent candies to create a row or column of three or more candies of the same type. When this happens, those candies disappear, and new ones fall from the top to fill the gaps. The game ends when the player runs out of time.

## Technologies Used

This game is built using HTML5 canvas, TypeScript, and OOP principles. The state transitions are managed using discriminated unions, and animations are managed using linear interpolation. The game is built using Vite as a build tool, and the server can be run using the command `npm run dev`. The game can be played at `localhost:5173`.

## Drag and Drop Feature

To move a candy, the player needs to drag and drop it to the desired location. The state of the game changes depending on the user's actions. When the user holds a cell and drags it to another cell, the two cells are swapped, and the game state transitions back to "nothing." However, the user must release the mouse to perform a new swap.

## State Transitions

The game state is managed using discriminated unions. Each possible state is represented by a type with a unique "type" string. For example, the "nothing" state has a type of "nothing". This makes it easier to handle game logic and animation.

## Animations

Animations in the game are managed using linear interpolation. When the state of the game changes, the game calculates the amount of time that has passed since the state change and updates the animation accordingly. This creates smooth animations that reflect the current state of the game.

The component of the game that deals with drawing the falling candies on the game board takes in the current board state, the new candies that will fall, and the progress of the animation as input. It first creates a "stubbed" version of the board and new candies, where each candy is given a unique ID. It then calculates the new position of each candy after it falls and stores it in an array. It also stores the old position of each candy in another array. The component then draws a grid on the game board, representing the background. It then uses interpolation to smoothly animate the movement of each candy from its old position to its new position, drawing each candy at its interpolated location.

## Build Tool

The game is built using Vite, a fast and lightweight build tool. To run the server, use the command `npm run dev`. The game can then be played at `localhost:5173`.

## Class Diagram

```mermaid
classDiagram
  class GameFadeStatus {
    type: string
    startFadingAt: number
  }

  class Board {}

  class InGame {
    board: Board
    type: string
    mouseNotReleasedYet: boolean
    fadeStatus: GameFadeStatus
  }

  class Nothing {
    type: "nothing"
  }

  class CellHeld {
    type: "cell held"
    heldCell: { row: number; column: number }
  }

  class AnimateSwap {
    type: "animate swap" | "reject swap"
    heldCell: { row: number; column: number }
    swappedWith: { row: number; column: number }
    animationTimeOrigin: number
  }

  class ShrinkCandies {
    type: "shrink candies"
    toBeCleared: (row: number, column: number) => boolean
    animationTimeOrigin: number
  }

  class NewCandies {
    type: "new candies"
    newCandies: Candy[][]
    animationTimeOrigin: number
  }

  class StartScreen {
    type: string
    animationTimeOrigin: number
  }

  class ResultScreen {
    type: string
    score: number
    animationTimeOrigin: number
  }

  class GameState {}

  GameFadeStatus -- InGame
  Board -- InGame
  Nothing -- InGame
  CellHeld -- InGame
  AnimateSwap -- InGame
  ShrinkCandies -- InGame
  NewCandies -- InGame
  InGame -- GameState
  StartScreen -- GameState
  ResultScreen -- GameState
```

## Conclusion

This clone of Candy Crush demonstrates how HTML5 canvas, TypeScript, and OOP principles can be used to create a simple game. By managing the game state using discriminated unions and using linear interpolation for animations, the game provides a smooth and engaging experience for players.
