import boardTexturePNG from ;
import circleCandyPNG from ;
import squareCandyPNG from ;
import diamondCandyPNG from ;

const makeImageObject = (png: string) => {
  const image = new Image();
  image.src = png;
  return image;
};

export const boardTexture = makeImageObject(boardTexturePNG);
export const circleCandy = makeImageObject(circleCandyPNG);
export const squareCandy = makeImageObject(squareCandyPNG);
export const diamondCandy = makeImageObject(diamondCandyPNG);

const waitOnLoad = (image: HTMLImageElement) =>
  new Promise((resolve) => {
    image.onload = resolve;
  });

export const waitForAllImages = Promise.all(
  [boardTexture, circleCandy, squareCandy, diamondCandy].map(waitOnLoad)
);
