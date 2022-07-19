export default class Cell {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y

    this.width = w
    this.height = h

    this.posX = x * w + w / 2
    this.posY = y * h + h / 2
  }

  show() {
    throw new Error('"show" method not implemented')
  }

  vertex () {
    vertex(
      this.x * this.width + this.width / 2,
      this.y * this.height + this.height / 2
    )
  }

  toString() {
    return `${this.constructor.name}: ${this.x}, ${this.y}`
  }
}
