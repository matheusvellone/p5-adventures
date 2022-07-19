const cols = 15
const rows = 15

const width = 450
const height = 450

const cellHeight = height / rows
const cellWidth = width / cols

let start
let end

const grid = []

let paragraph

function setup () {
  createCanvas(width, height)
  fill(0)
  background(255)
}

const points = []
let count = 0

const findTwoClosest = ([x, y]) => {
  const closestTwo = [
  ]

  points.forEach((point, index) => {
    const pointDistance = dist(x, y, point[0], point[1])
    console.log(index, pointDistance, closestTwo)

    if (closestTwo.length < 2 || pointDistance < closestTwo[0].dist) {
      if (closestTwo[0]) {
        closestTwo[1] = closestTwo[0]
      }
      closestTwo[0] = {
        dist: pointDistance,
        point,
      }
    }
  })

  console.log(closestTwo)

  return [
    closestTwo[0].point,
    closestTwo[1].point
  ]
}

function mousePressed() {
  if (mouseX > width || mouseY > height || mouseX < 0 || mouseY < 0) {
    return false
  }
  fill(0)
  ellipse(mouseX, mouseY, 5)

  if (points.length < 2) {
    points.push([mouseX, mouseY])
    return false
  }

  const [p1, p2] = findTwoClosest([mouseX, mouseY])
  console.log(p1, p2)

  fill(random(255), random(255), random(255))
  beginShape()
  vertex(p1[0], p1[1])
  vertex(p2[0], p2[1])
  vertex(mouseX, mouseY)
  vertex(p1[0], p1[1])
  endShape()

  const halfwayX = (p1[0] + p2[0] + mouseX) / 3
  const halfwayY = (p1[1] + p2[1] + mouseY) / 3
  noFill()
  circle(halfwayX, halfwayY, dist(halfwayX, halfwayY, p1[0], p1[1]))
  fill(0)
  ellipse(halfwayX, halfwayY, 5)

  points.push([mouseX, mouseY])

  return false
}

window.setup = setup
window.mousePressed = mousePressed
