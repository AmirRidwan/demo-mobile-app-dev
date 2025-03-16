const movieSeats = {
	'1-pavilionkl-16-9:20am': {
		B4: 2,
		B5: 2,
		C6: 2,
		D7: 2,
		E3: 2,
        E8: 1,
		F4: 2

	}
};

export default (io) => {
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

		if (seats[seatId] === undefined) {
			seats[seatId] = 1;
		}
		movieSeats[movieId] = seats;
        console.log(movieSeats[movieId])
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
});}