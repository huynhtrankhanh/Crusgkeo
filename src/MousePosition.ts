class MousePosition {
  x: number = 0;
  y: number = 0;
  leftButtonHeld: boolean = false;
  constructor(canvas: HTMLCanvasElement) {
    canvas.addEventListener("mousedown", (event) => {
      this.leftButtonHeld = true;
      this.x = event.clientX;
      this.y = event.clientY;
    });
    canvas.addEventListener("mouseup", (event) => {
      this.leftButtonHeld = false;
      this.x = event.clientX;
      this.y = event.clientY;
    });
    canvas.addEventListener("mousemove", (event) => {
      this.x = event.clientX;
      this.y = event.clientY;
    });

    canvas.addEventListener("touchstart", (event) => {
      this.leftButtonHeld = true;
      if (event.touches.length < 1) return;
      this.x = event.touches[0].clientX;
      this.y = event.touches[0].clientY;
    });
    canvas.addEventListener("touchcancel", () => {
      this.leftButtonHeld = false;
    });
    canvas.addEventListener("touchend", (event) => {
      this.leftButtonHeld = false;
      if (event.touches.length < 1) return;
      this.x = event.touches[0].clientX;
      this.y = event.touches[0].clientY;
    });
    canvas.addEventListener("touchmove", (event) => {
      if (event.touches.length < 1) return;
      this.x = event.touches[0].clientX;
      this.y = event.touches[0].clientY;
    });
  }
}

export default MousePosition;
