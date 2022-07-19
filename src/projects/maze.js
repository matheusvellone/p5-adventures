import Cell from '../common/Cell.js'
import Grid from '../common/Grid.js'
import { getResolution } from '../common/helpers.js'

const cols = 20
const rows = 20

const resolution = getResolution()

const cellHeight = resolution.height / rows
const cellWidth = resolution.width / cols

const start = [0, 0]
  // [floor(random(0, cols)), floor(random(0, rows))] // random
const end = [cols - 1, rows - 1]
  // [floor(random(0, cols)), floor(random(0, rows))] // random

let paragraph

class MazeCell extends Cell {
  constructor (x, y, w, h) {
    super(x, y, w ,h)
    this.walls = [true, true, true, true]

    this.visited = false

    this.gScore = this.isStart() ? 0 : Infinity
    this.fScore = Infinity

    this.neighbors = []
  }

  show (dim = false) {
    const x = this.x * this.width
    const y = this.y * this.height
    if (this.isEnd()) {
      fill(255, 150, 150)
    } else if (this.isStart()) {
      fill(150, 255, 150)
    } else if (this === currentNode) {
      fill(dim ? 230 : 127)
    } else if (this.visited) {
      fill(230)
    } else {
      !dim && fill(255)
    }
    strokeWeight(0)
    rect(x, y, this.width, this.height)
    strokeWeight(1)
    stroke(0)
    if (this.walls[0]) {
      line(x, y, x + this.width, y)
    }
    if (this.walls[1]) {
      line(x + this.width, y, x + this.width, y + this.height)
    }
    if (this.walls[2]) {
      line(x + this.width, y + this.height, x, y + this.height)
    }
    if (this.walls[3]) {
      line(x, y + this.height, x, y)
    }
  }

  setupNeighbors () {
    const top = grid.getCell(this.x, this.y - 1)
    if (top) {
      this.neighbors.push(top)
    }

    const right = grid.getCell(this.x + 1, this.y)
    if (right) {
      this.neighbors.push(right)
    }

    const bottom = grid.getCell(this.x, this.y + 1)
    if (bottom) {
      this.neighbors.push(bottom)
    }

    const left = grid.getCell(this.x - 1, this.y)
    if (left) {
      this.neighbors.push(left)
    }
  }

  getNeighbors () {
    if (!this.neighbors.length) {
      this.setupNeighbors()
    }

    return this.neighbors
  }

  getRandomNeighbor () {
    const validNeighbors = this.getNeighbors().filter(neighbor => !neighbor.visited)

    if (validNeighbors.length) {
      return validNeighbors[floor(random(0, validNeighbors.length))]
    }

    return null
  }

  removeWalls (other) {
    const x = other.x - this.x
    if (x === 1) {
      this.walls[1] = false
      other.walls[3] = false
    } else if (x === -1) {
      this.walls[3] = false
      other.walls[1] = false
    }
    const y = other.y - this.y
    if (y === 1) {
      this.walls[2] = false
      other.walls[0] = false
    } else if (y === -1) {
      this.walls[0] = false
      other.walls[2] = false
    }
  }

  getNeighborsBlockedByWalls () {
    const neighbors = []

    const top = grid.getCell(this.x, this.y - 1)
    if (top && !this.walls[0]) {
      neighbors.push(top)
    }

    const right = grid.getCell(this.x + 1, this.y)
    if (right && !this.walls[1]) {
      neighbors.push(right)
    }

    const bottom = grid.getCell(this.x, this.y + 1)
    if (bottom && !this.walls[2]) {
      neighbors.push(bottom)
    }

    const left = grid.getCell(this.x - 1, this.y)
    if (left && !this.walls[3]) {
      neighbors.push(left)
    }

    return neighbors
  }

  heuristicToEnd () {
    return abs(this.x - end[0]) + abs(this.y - end[1])
  }

  isStart () {
    return this.x === start[0] && this.y === start[1]
  }

  isEnd () {
    return this.x === end[0] && this.y === end[1]
  }
}

const grid = new Grid(
  cols, rows,
  resolution,
  ({ cellWidth, cellHeight, x, y}) => new MazeCell(x, y, cellWidth, cellHeight)
)

let currentNode = null

const toVisit = []

const openSet = []

const drawPath = (current, count = 1, start = false) => {
  if (start) {
    noFill()
    if (current.isEnd()) {
      stroke(34, 237, 93)
    } else {
      stroke(222, 222, 90)
    }
    strokeWeight(Math.min(cellWidth, cellHeight) / 5)
    beginShape()
  }
  current.vertex()
  if (current.isStart()) {
    endShape()
    solutionSteps = count
    return
  }
  drawPath(current.previous, count + 1)
}

function setup () {
  createCanvas(resolution.width, resolution.height)

  toVisit.push(grid.getCell(start[0], start[1]))
  paragraph = createP()

  background(255)
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      grid.getCell(x, y).show()
    }
  }
}

let mazeFinished = false
let visited = 0
let finished = 0
let solutionSteps = 0

const cells = cols * rows

function draw () {
  if (!mazeFinished) {
    const data = [
      'Step: Maze generation',
      `Visited: ${visited}/${cells} (${floor(visited / cells * 100)}%)`,
      `Finished: ${finished}/${cells} (${floor(finished / cells * 100)}%)`,
    ]
    paragraph.html(data.join('<br>'))

    if (toVisit.length) {
      currentNode = toVisit.pop()
      if (!currentNode.visited) {
        visited++
      }
      currentNode.visited = true
      currentNode.show()

      const next = currentNode.getRandomNeighbor()
      if (next) {
        toVisit.push(currentNode)
        currentNode.removeWalls(next)
        currentNode.show(true)
        next.show()
        toVisit.push(next)
      } else {
        finished++
      }
    } else {
      mazeFinished = true
      openSet.push(grid.getCell(start[0], start[1]))

      paragraph.html('Step: Path finding')
      visited = 1

      background(255)
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          grid.getCell(x, y).show(true)
        }
      }
    }

    return
  }

  if (openSet.length) {
    const current = openSet.shift()

    drawPath(current, 1, true)
    if (current.isEnd()) {
      const data = [
        'Path found',
        `Visited: ${visited}/${cells} (${floor(visited / cells * 100)}%)`,
        `Solution steps: ${solutionSteps}/${cells} (${floor(solutionSteps / cells * 100)}%)`,
        `Efficiency: ${solutionSteps}/${visited} (${floor(solutionSteps / visited * 100)}%)`,
      ]
      paragraph.html(data.join('<br>'))
      noLoop()
      return
    }

    current.getNeighborsBlockedByWalls().forEach((neighbor) => {
      const currentGScore = current.gScore + 1
      if (currentGScore < neighbor.gScore) {
        if (neighbor.gScore === Infinity) {
          visited++
        }
        neighbor.gScore = currentGScore
        neighbor.fScore = currentGScore + neighbor.heuristicToEnd()
        neighbor.previous = current

        let insertionIndex = 0
        const alreadyExists = openSet.some((cell, index) => {
          if (cell === neighbor) {
            return true
          }

          if (cell.fScore < neighbor.fScore) {
            insertionIndex = index
            return false
          }
        })

        if (!alreadyExists) {
          openSet.splice(insertionIndex, 0, neighbor)
        }
      }
    })
  } else {
    paragraph.html('No path exists')
    noLoop()
  }
}

window.setup = setup
window.draw = draw
