class Player {
	constructor(x, y, color) {
	  this.x = x;
	  this.y = y;
	  this.color = color;
	  this.width = 20; // Adjust the player's width as needed
	  this.height = 120; // Adjust the player's height as needed
	}
  
	draw(ctx) {
	  ctx.fillStyle = this.color;
	  ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	getTop() {
		return this.y;
	}

	getBottom() {
		return this.y + this.height;
	}

	getCenter() {
		return this.y + (this.height / 2);
	}
}
  
export default Player;
  