import boardTextureURL from "../Textures/BoardTexture.svg";
import circleCandyURL from "../Textures/CircleCandy.svg";
import squareCandyURL from "../Textures/SquareCandy.svg";
import diamondCandyURL from "../Textures/DiamondCandy.svg";

const makeImageObject = (url: string) => {
  const image = new Image();
  image.src = url;
  return image;
};

export const boardTexture = makeImageObject(boardTextureURL);
export const circleCandy = makeImageObject(circleCandyURL);
export const squareCandy = makeImageObject(squareCandyURL);
export const diamondCandy = makeImageObject(diamondCandyURL);

const waitOnLoad = (image: HTMLImageElement) => new Promise(resolve => {
  image.onload = resolve;
})

export const waitForAllImages = Promise.all([boardTexture, circleCandy, squareCandy, diamondCandy].map(waitOnLoad))