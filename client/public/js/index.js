const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#scoreEl')
const socket = io();
canvas.width = innerWidth
canvas.height = innerHeight

const x = canvas.width / 2
const y = canvas.height - 25

const players = {}

socket.on('updatePlayers', (backendPlayers) => {
	for (const id in players) {
			delete players[id];
	}
	for (let i = 0; i < backendPlayers.length; i++) {
		if (backendPlayers[i] && !players[backendPlayers[i].id]) {
			players[backendPlayers[i].id] = new Player(x + backendPlayers[i].x, y * i, 'white');
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

let animationId
function animate() {
	animationId = requestAnimationFrame(animate)
	c.fillStyle = 'rgba(0, 0, 0, 0.1)'
	c.fillRect(0, 0, canvas.width, canvas.height)
	c.beginPath();
	c.strokeStyle = 'white';
	c.lineWidth = 2;
	c.moveTo(0, canvas.height / 2);          // Starting point at x=0, middle of the canvas
	c.lineTo(canvas.width, canvas.height / 2); // Ending point at the canvas width, middle of the canvas
	c.stroke();
	

	for (const id in players) {
		players[id].draw()
	}
}



animate()

window.addEventListener('keydown', (e) => {
	const speed = 20;
	switch (e.code) {
		case 'KeyD':
			if (players[socket.id].x + 185 + 20 >= canvas.width) {
				break;
			}
			players[socket.id].x += speed;
			socket.emit('keyDown', 'right');
			break;
		case 'KeyA':
			if (players[socket.id].x <= 0) {
				break;
			}
			players[socket.id].x -= speed;
			socket.emit('keyDown', 'left');
			break;
		case 'ArrowLeft':
			if (players[socket.id].x <= 0) {
				break;
			}
			players[socket.id].x -= speed;
			socket.emit('keyDown', 'left');
			break;
		case 'ArrowRight':
			if (players[socket.id].x + 185 + 20 >= canvas.width) {
				break;
			}
			players[socket.id].x += speed;
			socket.emit('keyDown', 'right');
			break;
	}
});