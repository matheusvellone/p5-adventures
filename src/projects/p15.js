const size = 4 // TODO: dynamic size

const resolution = getResolution()

const cellHeight = resolution.height / size
const cellWidth = resolution.width / size

class PuzzleCell extends Cell {
  constructor(x, y) {
    super(x, y)

    this.value = x + y === 0 ? null : y * size + x
    this.position = this.value
  }

  show() {
    const { x, y } = indexToGridIndex(this.position, size)

    noFill()
    rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight)
    fill(0)

    if (this.value !== null) {
      textSize(32)
      textAlign(CENTER, CENTER)
      text(`${this.value} ${this.getHeuristics()}`, x * cellWidth + cellWidth / 2, y * cellHeight + cellHeight / 2)
    }
  }

  updatePosition({ x, y }) {
    this.position = y * size + x
  }

  getHeuristics() {
    const { x, y } = indexToGridIndex(this.position, size)

    return abs(this.x - x) + abs(this.y - y)
  }
}

const grid = initializeGrid(size, size, PuzzleCell)
let current

function setup () {
  createCanvas(resolution.width, resolution.height)
  background(255)

  shuffleGrid(grid, {
    shuffleCallback: (cell, newPosition) => {
      cell.updatePosition(newPosition)
    }
  })

  grid.forEach((row) => {
    row.forEach((cell) => {
      cell.show()
    })
  })
}
