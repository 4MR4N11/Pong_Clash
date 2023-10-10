class Player {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.color = color
  }

  draw() {
    c.beginPath()
    c.rect(this.x, this.y, 20, 120)
    c.fillStyle = this.color
    c.fill()
  }
  
}
