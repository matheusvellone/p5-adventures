import Cell from '../common/Cell.js'
import Grid from '../common/Grid.js'
import { DIRECTION, getResolution } from '../common/helpers.js'

const SIZE = 17
const resolution = getResolution()

const isPrime = (value) => {
  if (value === 1) {
    return false
  }

  if (value === 2) {
    return true
  }

  if (value % 2 === 0) {
    return false
  }

  const end = Math.sqrt(value)
  for (let i = 3; i <= end; i+= 2) {
    if (value % i === 0) {
      return false
    }
  }

  return true
}

class UlamCell extends Cell {
  draw(value, previousCell) {
    this.value = value

    if (isPrime(value)) {
      fill(0, 255, 0)
      stroke(0, 255, 0)
      circle(this.posX, this.posY, 100 / SIZE)
    }

    if (previousCell) {
      stroke(50)
      line(this.posX, this.posY, previousCell.posX, previousCell.posY)
    }
  }
}

const grid = new Grid(SIZE, SIZE, resolution, UlamCell)

const setup = () => {
  createCanvas(resolution.width, resolution.height)
  background(0)
}

let number = 1
let direction = DIRECTION.RIGHT
let lastCell
const currentPosition = {
  x: Math.floor(SIZE / 2),
  y: Math.floor(SIZE / 2),
}

const draw = () => {
  grid.grid[currentPosition.x][currentPosition.y].draw(number, lastCell)
  lastCell = grid.grid[currentPosition.x][currentPosition.y]

  switch (direction) {
    case DIRECTION.RIGHT:
      currentPosition.x++
      break
    case DIRECTION.UP:
      currentPosition.y--
      break
    case DIRECTION.LEFT:
      currentPosition.x--
      break
    case DIRECTION.DOWN:
      currentPosition.y++
      break
  }

  number++
  if (number > SIZE * SIZE) {
    noLoop()
    return
  }

  switch (direction) {
    case DIRECTION.RIGHT:
      if (!grid.grid[currentPosition.x][currentPosition.y - 1].value) {
        direction = DIRECTION.UP
      }
      break
    case DIRECTION.UP:
      if (!grid.grid[currentPosition.x - 1][currentPosition.y].value) {
        direction = DIRECTION.LEFT
      }
      break
    case DIRECTION.LEFT:
      if (!grid.grid[currentPosition.x][currentPosition.y + 1].value) {
        direction = DIRECTION.DOWN
      }
      break
    case DIRECTION.DOWN:
      if (!grid.grid[currentPosition.x + 1][currentPosition.y].value) {
        direction = DIRECTION.RIGHT
      }
      break
  }
}

window.setup = setup
window.draw = draw
