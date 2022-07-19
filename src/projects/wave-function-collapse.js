import { DIRECTION } from "../common/helpers.js"
import { loadSpriteSheet } from "../common/spritesheet.js"

const tilesData = []

const SIZE = 104
let tiles
let img

const preload = () => {
  img = loadImage('./tilemap.png')
}

let button
let currentIndex = 0
let referenceIndex = currentIndex + 1

const setup = () => {
  const canvas = createCanvas(1000, 1000)

  canvas.mousePressed(selectTile)

  tiles = loadSpriteSheet(img, SIZE)
  button = createButton('accept')

  renderMatches()
  selectTile()

  noLoop()
}

const selected = {
  [DIRECTION.UP]: false,
  [DIRECTION.RIGHT]: false,
  [DIRECTION.DOWN]: false,
  [DIRECTION.LEFT]: false,
}

function selectTile() {
  let changed = false

  if (mouseX >= SIZE && mouseX <= SIZE * 2) {
    if (mouseY <= SIZE) {
      selected[DIRECTION.UP] = !selected[DIRECTION.UP]
      changed = true
    }
    if (mouseY >= SIZE * 2) {
      selected[DIRECTION.DOWN] = !selected[DIRECTION.DOWN]
      changed = true
    }
  }

  if (mouseY >= SIZE && mouseY <= SIZE * 2) {
    if (mouseX <= SIZE) {
      selected[DIRECTION.LEFT] = !selected[DIRECTION.LEFT]
      changed = true
    }
    if (mouseX >= SIZE * 2) {
      selected[DIRECTION.RIGHT] = !selected[DIRECTION.RIGHT]
      changed = true
    }
  }

  if (mouseY >= SIZE && mouseY <= SIZE * 2 && mouseX >= SIZE && mouseX <= SIZE * 2) {
    if (selected[DIRECTION.UP]) {
      tilesData[currentIndex][DIRECTION.UP].push(referenceIndex)
      tilesData[referenceIndex][DIRECTION.DOWN].push(currentIndex)
    }
    if (selected[DIRECTION.RIGHT]) {
      tilesData[currentIndex][DIRECTION.RIGHT].push(referenceIndex)
      tilesData[referenceIndex][DIRECTION.LEFT].push(currentIndex)
    }
    if (selected[DIRECTION.DOWN]) {
      tilesData[currentIndex][DIRECTION.DOWN].push(referenceIndex)
      tilesData[referenceIndex][DIRECTION.UP].push(currentIndex)
    }
    if (selected[DIRECTION.LEFT]) {
      tilesData[currentIndex][DIRECTION.LEFT].push(referenceIndex)
      tilesData[referenceIndex][DIRECTION.RIGHT].push(currentIndex)
    }

    console.log(tilesData)

    referenceIndex += 1
    renderMatches()
  }

  noFill()
  strokeWeight(3)

  stroke(selected[DIRECTION.UP] ? 'green' : 'red')
  rect(SIZE, 0, SIZE, SIZE)

  stroke(selected[DIRECTION.LEFT] ? 'green' : 'red')
  rect(0, SIZE, SIZE, SIZE)

  stroke(selected[DIRECTION.RIGHT] ? 'green' : 'red')
  rect(SIZE * 2, SIZE, SIZE, SIZE)

  stroke(selected[DIRECTION.DOWN] ? 'green' : 'red')
  rect(SIZE, SIZE * 2, SIZE, SIZE)
}

function renderMatches () {
  selected[DIRECTION.UP] = false
  selected[DIRECTION.RIGHT] = false
  selected[DIRECTION.DOWN] = false
  selected[DIRECTION.LEFT] = false

  if (referenceIndex === tiles.length) {
    currentIndex += 1
    referenceIndex = currentIndex + 1
  }

  if (currentIndex === tiles.length - 1) {
    loop()
    return
  }

  if (!tilesData[currentIndex]) {
    tilesData[currentIndex] = {
      [DIRECTION.UP]: [],
      [DIRECTION.RIGHT]: [],
      [DIRECTION.DOWN]: [],
      [DIRECTION.LEFT]: [],
    }
  }

  if (!tilesData[referenceIndex]) {
    tilesData[referenceIndex] = {
      [DIRECTION.UP]: [],
      [DIRECTION.RIGHT]: [],
      [DIRECTION.DOWN]: [],
      [DIRECTION.LEFT]: [],
    }
  }

  background(255)
  image(tiles[currentIndex], SIZE, SIZE)

  image(tiles[referenceIndex], SIZE, 0) // UP
  image(tiles[referenceIndex], 0, SIZE) // RIGHT
  image(tiles[referenceIndex], SIZE, 2 * SIZE) // DOWN
  image(tiles[referenceIndex], 2 * SIZE, SIZE) // LEFT
  // tiles.forEach((tile, index) => {
  //   image(tile, Math.floor(index / 4) * SIZE , Math.floor(index % 4) * SIZE)
  //   fill(0, 255, 0)
  //   text(index, Math.floor(index / 4) * SIZE + SIZE / 2, Math.floor(index % 4) * SIZE + SIZE / 2)
  // })
}

let current = 0

const draw = () => {
  // console.log('showing image', current)
  // image(tiles[current], 0, 0)
  // current++
  // if (current === tiles.length) {
  //   current = 0
  // }
}

window.setup = setup
window.draw = draw
window.preload = preload
