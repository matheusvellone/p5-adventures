export const initializeGrid = (cols, rows, Class) => {
  const grid = []

  for (let x = 0; x < cols; x++) {
    grid[x] = []
    for (let y = 0; y < rows; y++) {
      grid[x][y] = new Class(x, y)
    }
  }

  return grid
}

export class Cell {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  toString() {
    return `${this.constructor.name}: ${this.x}, ${this.y}`
  }
}

export const getResolution = (size = 400) => {
  // TODO: como deixar dinâmico e redimensionável?
  return {
    width: size,
    height: size,
  }
}

export const indexToGridIndex = (index, rows, cols = rows) => {
  return {
    x: index % cols,
    y: Math.floor(index / rows),
  }
}

export const shuffleGrid = (grid, options = {}) => {
  const {
    rows = grid.length,
    cols = grid[0].length,
    shuffleCallback,
  } = options

  const cellCount = rows * cols

  for (let i = 0; i < cellCount; i++) {
    const p1 = indexToGridIndex(i, rows, cols)
    const p2 = indexToGridIndex(floor(random(cellCount)), rows, cols);

    if (shuffleCallback) {
      shuffleCallback(grid[p1.x][p1.y], p2)
      shuffleCallback(grid[p2.x][p2.y], p1)
    }
    [grid[p1.x][p1.y], grid[p2.x][p2.y]] = [grid[p2.x][p2.y], grid[p1.x][p1.y]]
  }

  return grid
}

export const getRandomGridElement = (grid, n = 1) => {
  const flattenedGrid = grid.reduce((acc, row) => {
    return acc.concat(row)
  }, [])

  if (n === 1) {
    return random(flattenedGrid)
  }

  const getRandom = () => random(flattenedGrid)
  const selected = {}

  return Array(n).fill(null).map(() => {
    let randomElement = getRandom()
    while (selected[randomElement]) {
      randomElement = getRandom()
      continue
    }

    selected[randomElement] = true
    return randomElement
  })
}

export const DIRECTION = {
  UP: 0,
  0: 'UP',
  RIGHT: 1,
  1: 'RIGHT',
  DOWN: 2,
  2: 'DOWN',
  LEFT: 3,
  3: 'LEFT',
}

export const rotate = (direction, clockwise = true) => {
  if (clockwise) {
    return (DIRECTION[direction] + 1) % 4
  }

  if (direction === DIRECTION.UP) {
    return DIRECTION.LEFT
  }

  return Math.abs((DIRECTION[direction] - 1) % 4)
}
