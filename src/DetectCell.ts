interface IDetectCell {
  detect(x: number, y: number): { row: number; column: number } | null;
}

class DetectCellConfig {
  width: number;
  height: number;
  rowCount: number;
  columnCount: number;
  cellWidth: number;

  constructor(
    width: number,
    height: number,
    rowCount: number,
    columnCount: number,
    cellWidth: number
  ) {
    this.width = width;
    this.height = height;
    this.rowCount = rowCount;
    this.columnCount = columnCount;
    this.cellWidth = cellWidth;
  }
}

class DetectCellBuilder {
  private config: DetectCellConfig;

  constructor() {
    this.config = new DetectCellConfig(0, 0, 0, 0, 0);
  }

  public withWidth(width: number): DetectCellBuilder {
    this.config.width = width;
    return this;
  }

  public withHeight(height: number): DetectCellBuilder {
    this.config.height = height;
    return this;
  }

  public withRowCount(rowCount: number): DetectCellBuilder {
    this.config.rowCount = rowCount;
    return this;
  }

  public withColumnCount(columnCount: number): DetectCellBuilder {
    this.config.columnCount = columnCount;
    return this;
  }

  public withCellWidth(cellWidth: number): DetectCellBuilder {
    this.config.cellWidth = cellWidth;
    return this;
  }

  public build(): IDetectCell {
    return new DetectCell(this.config);
  }
}

class DetectCell implements IDetectCell {
  #config: DetectCellConfig;

  constructor(config: DetectCellConfig) {
    this.#config = config;
  }

  detect(x: number, y: number): { row: number; column: number } | null {
    const centerX = this.#config.width / 2;
    const centerY = this.#config.height / 2;
    const topLeftX = centerX - (this.#config.cellWidth * this.#config.columnCount) / 2;
    const topLeftY = centerY - (this.#config.cellWidth * this.#config.rowCount) / 2;
    const translatedX = x - topLeftX;
    const translatedY = y - topLeftY;
    if (
      translatedX < 0 ||
      translatedY < 0 ||
      translatedX >= this.#config.columnCount * this.#config.cellWidth ||
      translatedY >= this.#config.rowCount * this.#config.cellWidth
    )
      return null;

    return {
      row: Math.trunc(translatedY / this.#config.cellWidth),
      column: Math.trunc(translatedX / this.#config.cellWidth),
    };
  }
}

export { IDetectCell, DetectCellBuilder };
