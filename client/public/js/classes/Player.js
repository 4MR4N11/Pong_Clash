class Player {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.color = color
  }

  draw() {
    c.beginPath()
    c.rect(this.x, this.y, 180, 20)
    c.fillStyle = this.color
    c.fill()
	c.strokeStyle = 'red';
	c.lineWidth = 5;
	c.stroke();
  }
  
}
