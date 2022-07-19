import Cell from './Cell.js'

export default class Grid {
  constructor(
    columns,
    rows,
    { width, height },
    cellInitializer,
  ) {
    this.columns = columns
    this.rows = rows

    const cellWidth = width / columns
    const cellHeight = height / rows

    this.grid = []

    for (let x = 0; x < columns; x++) {
      this.grid[x] = []
      for (let y = 0; y < rows; y++) {
        if (cellInitializer.prototype) {
          this.grid[x][y] = new cellInitializer(x, y, cellWidth, cellHeight)
        } else {
          this.grid[x][y] = cellInitializer({
            cellWidth, cellHeight,
            x, y
          })
        }
      }
    }
  }

  forEach(fn) {
    this.grid.forEach((row) => {
      row.forEach((cell) => {
        fn(cell)
      })
    })
  }

  getCell(x, y) {
    return this.grid[x]?.[y]
  }

  show() {
    this.forEach((cell) => {
      cell.show()
    })
  }

  getIndex(x, y) {
    return y * this.rows + x
  }
}
