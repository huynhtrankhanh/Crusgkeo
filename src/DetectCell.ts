class DetectCell {
  #width: number;
  #height: number;
  #rowCount: number;
  #columnCount: number;
  #cellWidth: number;

  constructor(
    width: number,
    height: number,
    rowCount: number,
    columnCount: number,
    cellWidth: number
  ) {
    this.#width = width;
    this.#height = height;
    this.#rowCount = rowCount;
    this.#columnCount = columnCount;
    this.#cellWidth = cellWidth;
  }

  detect(x: number, y: number): { row: number; column: number } | null {
    const centerX = this.#width / 2;
    const centerY = this.#height / 2;
    const topLeftX = centerX - (this.#cellWidth * this.#columnCount) / 2;
    const topLeftY = centerY - (this.#cellWidth * this.#rowCount) / 2;
    const translatedX = x - topLeftX;
    const translatedY = y - topLeftY;
    if (
      translatedX < 0 ||
      translatedY < 0 ||
      translatedX >= this.#columnCount * this.#cellWidth ||
      translatedY >= this.#rowCount * this.#cellWidth
    )
      return null;

    return {
      row: Math.trunc(translatedY / this.#cellWidth),
      column: Math.trunc(translatedX / this.#cellWidth),
    };
  }
}

export default DetectCell;
