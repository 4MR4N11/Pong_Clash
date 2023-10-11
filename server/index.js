const express = require('express');
const http = require('http');
const path = require('path');
const port = 5000;
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
	cors: {
	  origin: '*',
	},
	pingInterval: 2000,
	pingTimeout: 2000,
});

app.use(express.static(path.join(__dirname, '../client/dist')));

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


	io.to(roomName).emit('updatePlayers', rooms[roomName]);
	// console.log(rooms[roomName].users)
  // Handle disconnection and remove user from the room
	socket.on('disconnect', (reason) => {
		console.log(reason);
		const room = rooms[roomName];
		for (let i = 0; i < room.users.length; i++) {
			if (room.users[i] && room.users[i].id === socket.id) {
				room.users[i] = null;
			}
		}
		io.to(roomName).emit('updatePlayers', rooms[roomName]);
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
		console.log(rooms[roomName].users)
		io.to(roomName).emit('updatePlayers', rooms[roomName]);
	});
	socket.on('updateBall', (ball) => {
		rooms[roomName].ball = ball;
		io.to(roomName).emit('updateBall', rooms[roomName].ball);
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
		ball: {
			x: 0,
			y: 0,
			speedX: 0,
			speedY: 0,
		},
	};
	return newRoomName;
}

server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});