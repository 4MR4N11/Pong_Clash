class Ball {
	constructor(x, y, velovityX, velovityY, maxheight, maxwidth, color) {
		this.x = x
		this.y = y
		this.color = color
		this.velovityX = velovityX
		this.velovityY = velovityY
		this.speed = 5
		this.maxwidth = maxwidth
		this.maxheight = maxheight
	}

	draw() {
		c.beginPath()
		c.arc(this.x, this.y, 15, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}
}