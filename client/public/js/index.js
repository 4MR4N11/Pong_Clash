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
	for (let i = 0; i < backendPlayers.length; i++) {
		if (!players[backendPlayers[i]]) {
			players[backendPlayers[i]] = new Player(x, y * i, 'white');
		}
	}
	for (const id in players) {
		if (!backendPlayers.includes(id)) {
			delete players[id]
		}
	}
	console.log(players);
});

let animationId
let score = 0
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
