import React, { useRef, useEffect } from 'react';
import Player from './Classes/player';
import Ball from './Classes/ball';
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
  
const CanvasComponent = () => {
	const canvasRef = useRef(null);
	const ballStartingPoint = window.innerWidth / 2;
	const y = window.innerHeight / 2;
	const playerStartingPointX = window.innerWidth - 20;
	const playerStartingPointY = window.innerHeight / 2;
	// const playerwidth = 20;
	const playerheight = 120;
	// const player = new Player(0, y - (playerheight / 2), 'white');
	const ball = new Ball(ballStartingPoint, y,Math.random() * 10 - 5 , 5, 10, 'red'); // Create a new ball instance
	const players = {};
	// const ball = new Ball(0, 0, 0, 0, 10, 'red');
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		socket.on('updatePlayers', (room) => {
			for (const id in players) {
					delete players[id];
			}
			for (let i = 0; i < room.users.length; i++) {
				if (room.users[i] && !players[room.users[i].id]) {
					players[room.users[i].id] = new Player(playerStartingPointX * i, (playerStartingPointY + room.users[i].y)  - (playerheight / 2), 'white');
				}
			}
			const playerIds = [];
			for (let i = 0; i < room.users.length; i++) {
				if (room.users[i]) {
					playerIds.push(room.users[i].id);
				}
			}
			for (const id in players) {
				if (!playerIds.includes(id)) {
					delete players[id];
				}
			}
			console.log(players);
			
		});

		socket.on('updateBall', (backendBall) => {
			ball.x = backendBall.x;
			ball.y = backendBall.y;
			ball.speedX = backendBall.speedX;
			ball.speedY = backendBall.speedY;
		});
		let animationId;
		
		function animate() {
			animationId = requestAnimationFrame(animate);
			ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 2;
			ctx.moveTo(canvas.width / 2, 0);
			ctx.lineTo(canvas.width / 2, canvas.height);
			ctx.stroke();

			let i = 0;
			for (const id in players) {
				players[id].draw(ctx)
				i++;
			}

			ball.draw(ctx);
			if (i === 2) {
				ball.update(canvas, players);
			} else {
				ball.x = ballStartingPoint;
				ball.y = y;
				ball.speedX = Math.random() * 10 - 5;
				ball.speedY = 5;
			}
			socket.emit('updateBall', ball);
		}
		
		animate();
		
		window.addEventListener('keydown', (e) => {
			const speed = 20;
			if (!players[socket.id]) {
				return;
			}
			switch (e.code) {
				case 'KeyS':
					if (players[socket.id].y + 120 >= canvas.height) {
						break;
					}
					players[socket.id].y += speed;
					socket.emit('keyDown', 'right');
					break;
				case 'KeyW':
					if (players[socket.id].y <= 0) {
						break;
					}
					players[socket.id].y -= speed;
					socket.emit('keyDown', 'left');
					break;
				case 'ArrowUp':
					if (players[socket.id].y <= 0) {
						break;
					}
					players[socket.id].y -= speed;
					socket.emit('keyDown', 'left');
					break;
				case 'ArrowDown':
					if (players[socket.id].y + 120 >= canvas.height) {
						break;
					}
					players[socket.id].y += speed;
					socket.emit('keyDown', 'right');
					break;
				default:
					console.log('Invalid key');

			}
		});
	
		return () => {
			cancelAnimationFrame(animationId);
		};
	});
  
	return <canvas ref={canvasRef} />;
};
  
export default CanvasComponent;