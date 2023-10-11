class Ball {
	constructor(x, y, speedX, speedY, radius, color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.speedX = speedX; // Adjust the initial speed as needed
		this.speedY = speedY;
	}
  
	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}
  
	update(canvas, player) {
		this.x += this.speedX;
		this.y += this.speedY;
		
	
		// Check for goal
		if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
			this.x = canvas.width / 2;
			this.y = canvas.height / 2;
			this.speedX = Math.random() * 10 - 5; 
			this.speedY = 5 
		}
	
		if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
			this.speedY *= -1; // Reverse the vertical direction
		}

		// Check for collisions with the player
		for (const id in player) {
			const p = player[id];
			if (this.x + this.radius >= p.x && this.x - this.radius <= p.x + p.width) {
				const playerTop = p.getTop();
				const playerBottom = p.getBottom();
				const playerCenter = p.getCenter();
				if (this.y + this.radius >= playerTop && this.y - this.radius <= playerBottom) {
					this.speedX *= -1; // Reverse the horizontal direction
					const angle = (this.y - playerCenter) / (p.height / 2);
					this.speedY = angle * Math.random() * 10 - 5;
				}
			}
		}
		// if (this.x + this.radius >= player.x && this.x - this.radius <= player.x + player.width) {
		// 	const playerTop = player.getTop();
		// 	const playerBottom = player.getBottom();
		// 	const playerCenter = player.getCenter();
		// 	if (this.y + this.radius >= playerTop && this.y - this.radius <= playerBottom) {
		// 		this.speedX *= -1; // Reverse the horizontal direction
		// 		const angle = (this.y - playerCenter) / (player.height / 2);
		// 		this.speedY = angle * Math.random() * 10 - 5;
		// 	}
		// }
	}
}
  
export default Ball;
  