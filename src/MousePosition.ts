interface IEventHandler {
  handle(event: MouseEvent | TouchEvent): void;
}

class MouseEventHandler implements IEventHandler {
  constructor(private mousePosition: MousePosition) {}

  handle(event: MouseEvent | TouchEvent): void {
    if (event instanceof MouseEvent) {
      this.mousePosition.x = event.clientX;
      this.mousePosition.y = event.clientY;
    }
  }
}

class TouchEventHandler implements IEventHandler {
  constructor(private mousePosition: MousePosition) {}

  handle(event: TouchEvent): void {
    if (event.touches.length < 1) return;
    this.mousePosition.x = event.touches[0].clientX;
    this.mousePosition.y = event.touches[0].clientY;
  }
}

abstract class MouseButtonHandler {
  constructor(protected mousePosition: MousePosition) {}

  abstract handle(event: MouseEvent): void;
}

class MouseDownHandler extends MouseButtonHandler {
  handle(event: MouseEvent): void {
    this.mousePosition.leftButtonHeld = true;
    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }
}

class MouseUpHandler extends MouseButtonHandler {
  handle(event: MouseEvent): void {
    this.mousePosition.leftButtonHeld = false;
    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }
}

class MousePosition {
  x: number = 0;
  y: number = 0;
  leftButtonHeld: boolean = false;

  private mouseEventHandler: IEventHandler;
  private touchEventHandler: IEventHandler;
  private mouseDownHandler: MouseButtonHandler;
  private mouseUpHandler: MouseButtonHandler;

  constructor(canvas: HTMLCanvasElement) {
    this.mouseEventHandler = new MouseEventHandler(this);
    this.touchEventHandler = new TouchEventHandler(this);
    this.mouseDownHandler = new MouseDownHandler(this);
    this.mouseUpHandler = new MouseUpHandler(this);

    canvas.addEventListener("mousedown", (event) => this.mouseDownHandler.handle(event));
    canvas.addEventListener("mouseup", (event) => this.mouseUpHandler.handle(event));
    canvas.addEventListener("mousemove", (event) => this.mouseEventHandler.handle(event));
    canvas.addEventListener("touchstart", (event) => {
      this.leftButtonHeld = true;
      this.touchEventHandler.handle(event);
    });
    canvas.addEventListener("touchcancel", () => {
      this.leftButtonHeld = false;
    });
    canvas.addEventListener("touchend", (event) => {
      this.leftButtonHeld = false;
      this.touchEventHandler.handle(event);
    });
    canvas.addEventListener("touchmove", (event) => this.touchEventHandler.handle(event));
  }
}

export default MousePosition;
