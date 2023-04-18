import { circleCandy, diamondCandy, squareCandy } from "./textures";
class DrawShapes {
  #shapeSize: number;
  #context: CanvasRenderingContext2D;
  constructor(context: CanvasRenderingContext2D, shapeSize: number) {
    this.#context = context;
    this.#shapeSize = shapeSize;
  }
  drawCircle = (centerX: number, centerY: number) => {
    const x = centerX - this.#shapeSize / 2;
    const y = centerY - this.#shapeSize / 2;
    this.#context.drawImage(
      circleCandy,
      x,
      y,
      this.#shapeSize,
      this.#shapeSize
    );
  };

  drawSquare = (centerX: number, centerY: number) => {
    const x = centerX - this.#shapeSize / 2;
    const y = centerY - this.#shapeSize / 2;
    this.#context.drawImage(
      squareCandy,
      x,
      y,
      this.#shapeSize,
      this.#shapeSize
    );
  };

  drawDiamond = (centerX: number, centerY: number) => {
    const x = centerX - this.#shapeSize / 2;
    const y = centerY - this.#shapeSize / 2;
    this.#context.drawImage(
      diamondCandy,
      x,
      y,
      this.#shapeSize,
      this.#shapeSize
    );
  };

  drawColorBomb = (centerX: number, centerY: number) => {
    this.#context.lineWidth = 1;
    this.#context.strokeStyle = "black";
    this.#context.translate(centerX, centerY);
    this.#context.beginPath();

    const rayCount = 10;
    for (let i = 0; i < rayCount; i++) {
      const radius = (this.#shapeSize / 2) * 1.1;

      this.#context.moveTo(0, (2 * radius) / 3);
      this.#context.lineTo(0, radius);
      this.#context.moveTo(0, 0);
      this.#context.rotate((2 * Math.PI) / rayCount);
    }

    this.#context.stroke();
    this.#context.translate(-centerX, -centerY);
  };

  drawVerticalStripes = (centerX: number, centerY: number) => {
    this.#context.lineWidth = 3;
    this.#context.strokeStyle = "black";
    this.#context.translate(centerX, centerY);
    this.#context.beginPath();

    const radius = this.#shapeSize / 2 - 10;

    this.#context.moveTo(0, -radius);
    this.#context.lineTo(0, radius);
    this.#context.moveTo(10, -radius);
    this.#context.lineTo(10, radius);
    this.#context.moveTo(-10, -radius);
    this.#context.lineTo(-10, radius);

    this.#context.stroke();
    this.#context.translate(-centerX, -centerY);
  };

  drawHorizontalStripes = (centerX: number, centerY: number) => {
    this.#context.lineWidth = 3;
    this.#context.strokeStyle = "black";
    this.#context.translate(centerX, centerY);
    this.#context.beginPath();

    const radius = this.#shapeSize / 2 - 10;

    this.#context.moveTo(-radius, 0);
    this.#context.lineTo(radius, 0);
    this.#context.moveTo(-radius, 10);
    this.#context.lineTo(radius, 10);
    this.#context.moveTo(-radius, -10);
    this.#context.lineTo(radius, -10);

    this.#context.stroke();
    this.#context.translate(-centerX, -centerY);
  };
}

export default DrawShapes;
