import boardTexturePNG from "../Textures/BoardTexture.png";
import circleCandyPNG from "../Textures/CircleCandy.png";
import squareCandyPNG from "../Textures/SquareCandy.png";
import diamondCandyPNG from "../Textures/DiamondCandy.png";
import firstPlacePNG from "../Textures/FirstPlacePNG.png";
import secondPlacePNG from "../Textures/SecondPlacePNG.png";
import thirdPlacePNG from "../Textures/ThirdPlacePNG.png";
import gameBackgroundPNG from "../Textures/GameBackgroundPNG.png";
import gameBackgroundDarkPNG from "../Textures/GameBackgroundDarkPNG.png";

const makeImageObject = (png: string) => {
  const image = new Image();
  image.src = png;
  return image;
};

export const boardTexture = makeImageObject(boardTexturePNG);
export const circleCandy = makeImageObject(circleCandyPNG);
export const squareCandy = makeImageObject(squareCandyPNG);
export const diamondCandy = makeImageObject(diamondCandyPNG);
export const firstPlace = makeImageObject(firstPlacePNG);
export const secondPlace = makeImageObject(secondPlacePNG);
export const thirdPlace = makeImageObject(thirdPlacePNG);
export const gameBackground = makeImageObject(gameBackgroundPNG);
export const gameBackgroundDark = makeImageObject(gameBackgroundDarkPNG);

const waitOnLoad = (image: HTMLImageElement) =>
  new Promise((resolve) => {
    image.onload = resolve;
  });

export const waitForAllImages = Promise.all(
  [
    boardTexture,
    circleCandy,
    squareCandy,
    diamondCandy,
    firstPlace,
    secondPlace,
    thirdPlace,
    gameBackground,
    gameBackgroundDark,
  ].map(waitOnLoad)
);
