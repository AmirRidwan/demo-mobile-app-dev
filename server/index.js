// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { movie } from './routes/movie.js';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

// In-memory seat status per movieId
// Format: { [movieId]: { [seatId]: status (1 or 2) } }
const movieSeats = {
	'movie123': {
		B4: 2,
		B5: 2,
		C6: 2,
		D7: 2,
		E3: 2,
		F4: 2
	}
};

io.on('connection', (socket) => {
	console.log('Client connected');

	socket.on('join_movie', (movieId) => {
		console.log(`User joined movie room: ${movieId}`);
		socket.join(movieId);

		// Initialize if not exists
		if (!movieSeats[movieId]) {
			movieSeats[movieId] = {};
		}

		console.log( movieSeats[movieId])
		socket.emit('seat_status', movieSeats[movieId]);
	});

	socket.on('select_seat', ({ movieId, seatId }) => {
		const seats = movieSeats[movieId];
		console.log(movieSeats, movieId, seatId)

		if (seats[seatId] === undefined) {
			seats[seatId] = 1;
		}
		movieSeats[movieId] = seats;
		io.to(movieId).emit('seat_status', seats);
	});

	socket.on('deselect_seat', ({ movieId, seatId }) => {
		const seats = movieSeats[movieId] || {};
		if (seats[seatId] === 1) {
			delete seats[seatId];
		}
		movieSeats[movieId] = seats;
		io.to(movieId).emit('seat_status', seats);
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});
});

app.use("/movie", movie)

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
