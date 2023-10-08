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
	rooms[roomName].users.push(socket.id);
	console.log(`User ${socket.id} joined room: ${roomName}`);


	io.to(roomName).emit('updatePlayers', rooms[roomName].users);
  // Handle disconnection and remove user from the room
	socket.on('disconnect', (reason) => {
		console.log(reason);
		const room = rooms[roomName];
		const userIndex = room.users.indexOf(socket.id);
		if (userIndex !== -1) {
			room.users.splice(userIndex, 1);
			socket.leave(roomName);
			console.log(`User ${socket.id} left room: ${roomName}`);
			io.to(roomName).emit('updatePlayers', room.users);
		}
		if (room.users.length === 0) {
			delete rooms[roomName];
			console.log(`Room ${roomName} deleted`);
			io.emit('updateRooms', rooms);
		}
		console.log('A user disconnected');
	});
});

// Function to find an available room or create a new one
function findAvailableRoom() {
	for (const roomName in rooms) {
		const room = rooms[roomName];
		if (room.users.length < 2) {
		return roomName; // Found an available room
		}
	}

	// If no available rooms, create a new one
	const newRoomName = `Room_${Object.keys(rooms).length + 1}`;
	rooms[newRoomName] = {
		users: [],
		userLimit: 2,
	};
	return newRoomName;
}

server.listen(port, () => {
  console.log(`listening on port ${port}`)
})
