const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#scoreEl')
const socket = io();
canvas.width = innerWidth
canvas.height = innerHeight

const x = canvas.width - 50
const y = canvas.height / 2 - 90

const players = {}
const ball = new Ball(canvas.width/2, canvas.height / 2, Math.random() * 10 - 5, 5, canvas.height, canvas.width, 'Blue');	
socket.on('updatePlayers', (backendPlayers) => {
	for (const id in players) {
			delete players[id];
	}
	for (let i = 0; i < backendPlayers.length; i++) {
		if (backendPlayers[i] && !players[backendPlayers[i].id]) {
			players[backendPlayers[i].id] = new Player(x * i, y + backendPlayers[i].y, 'white');
		}
	}
	const playerIds = backendPlayers.map(player => player.id);
	for (const id in players) {
		if (!playerIds.includes(id)) {
			delete players[id];
		}
	}
	console.log(players);
	
});

socket.on('updateBall', (backendBall) => {
	if (!backendBall) {
		return;
	}
	if (players[socket.id] && backendBall.x - 15 <= 20 && backendBall.y >= players[socket.id].y && backendBall.y <= players[socket.id].y + 120) {
		backendBall.velovityX *= -1;
	}
	ball.x = backendBall.x;
	ball.y = backendBall.y;
	ball.velovityX = backendBall.velovityX;
	ball.velovityY = backendBall.velovityY;
});
let animationId
function animate() {
	animationId = requestAnimationFrame(animate)
	c.fillStyle = 'rgba(0, 0, 0, 0.1)'
	c.fillRect(0, 0, canvas.width, canvas.height)
	c.beginPath();
	c.strokeStyle = 'white';
	c.lineWidth = 2;
	c.moveTo(canvas.width / 2, canvas.width / 2);          // Starting point at x=0, middle of the canvas
	c.lineTo(canvas.width / 2, 0); // Ending point at the canvas width, middle of the canvas
	c.stroke();
	
	
	for (const id in players) {
		players[id].draw()
	}
	ball.draw()
}



animate()

setInterval(() => {
	socket.emit('updateBall', ball);
	socket.emit('updatePlayers', players);

}, 15);

window.addEventListener('keydown', (e) => {
	if (!players[socket.id]) {
		return;
	}
	const speed = 20;
	switch (e.code) {
		case 'KeyD':
			if (players[socket.id].y + 120 >= canvas.height) {
				break;
			}
			players[socket.id].y += speed;
			socket.emit('keyDown', 'right');
			break;
		case 'KeyA':
			if (players[socket.id].y <= 0) {
				break;
			}
			players[socket.id].y -= speed;
			socket.emit('keyDown', 'left');
			break;
		case 'ArrowLeft':
			if (players[socket.id].y <= 0) {
				break;
			}
			players[socket.id].y -= speed;
			socket.emit('keyDown', 'left');
			break;
		case 'ArrowRight':
			if (players[socket.id].y + 120 >= canvas.height) {
				break;
			}
			players[socket.id].y += speed;
			socket.emit('keyDown', 'right');
			break;
	}
});