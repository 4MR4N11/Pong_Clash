const express = require('express')
const app = express()
const port = 3000
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 2000 })
const path = require('path')

app.use(express.static(path.join(__dirname, '../client/public')))

app.get('/', (req, res) => {
	  res.sendFile(path.join(__dirname, '../client/index.html'))
});

const players = {}
const rooms = {};

io.on('connection', (socket) => {
	console.log('A user connected');

	// Find or create an available room
	let roomName = findAvailableRoom();
	socket.join(roomName);
	rooms[roomName].users[rooms[roomName].users.indexOf(null)] = {
		id: socket.id,
		y: 0,
	};
	console.log(`User ${socket.id} joined room: ${roomName}`);


	io.to(roomName).emit('updatePlayers', rooms[roomName].users);
  // Handle disconnection and remove user from the room
	socket.on('disconnect', (reason) => {
		console.log(reason);
		const room = rooms[roomName];
		for (let i = 0; i < room.users.length; i++) {
			if (room.users[i] && room.users[i].id === socket.id) {
				room.users[i] = null;
			}
		}
		io.to(roomName).emit('updatePlayers', rooms[roomName].users);
		if (room.users.length === 0) {
			delete rooms[roomName];
			console.log(`Room ${roomName} deleted`);
		}
		console.log('A user disconnected');
	});
	socket.on('keyDown', (key) => {
		const speed = 20; 
		switch (key) {
			case 'right':
				rooms[roomName].users.find(user => user.id === socket.id).y += speed;
				break;
			case 'left':
				rooms[roomName].users.find(user => user.id === socket.id).y -= speed;
				break;
			default:
				console.log('Invalid key');
		}
		io.to(roomName).emit('updatePlayers', rooms[roomName].users);
	});
	socket.on('updateBall', (ball) => {
		ball.x += ball.velovityX;
		ball.y += ball.velovityY;
		if (ball.y + 15 >= ball.maxheight || ball.y - 15 <= 0) {
			ball.velovityY *= -1;
		}
		if (rooms[roomName].users[0] && ball.x - 15 <= 20 && ball.y >= rooms[roomName].users[0].y && ball.y <= rooms[roomName].users[0].y + 120) {
			ball.velovityX *= -1;
		}
		if (rooms[roomName].users[1] && ball.x + 15 >= ball.maxwidth - 20 && ball.y >= rooms[roomName].users[1].y && ball.y <= rooms[roomName].users[1].y + 120) {
			ball.velovityX *= -1;
		}
		
		io.to(roomName).emit('updateBall', ball);
	});
});

// Function to find an available room or create a new one
function findAvailableRoom() {
	for (const roomName in rooms) {
		const room = rooms[roomName];
		for (let i = 0; i < room.users.length; i++) {
			if (room.users[i] === null) {
				return roomName;
			}
		}
	}

	// If no available rooms, create a new one
	const newRoomName = `Room_${Object.keys(rooms).length + 1}`;
	rooms[newRoomName] = {
		users: [
			null,
			null
		],
		userLimit: 2,
	};
	return newRoomName;
}

server.listen(port, () => {
  console.log(`listening on port ${port}`)
})
