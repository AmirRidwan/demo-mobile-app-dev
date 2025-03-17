import express from 'express'
import movieSeats from "../json/movieSeats.json" assert { type: "json" };

const seatsManager = (io) => {
	
	io.on('connection', (socket) => {
		console.log('Client connected');

		socket.on('join_movie', (movieId) => {
			console.log(`WS JOIN: ${movieId}`);
			socket.join(movieId);

			if (!movieSeats[movieId]) {
				movieSeats[movieId] = {};
			}

			socket.emit('seat_status', movieSeats[movieId]);
		});

		socket.on('select_seat', ({ movieId, seatId }) => {
			const seats = movieSeats[movieId] || {};
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

	const router = express.Router();

	router.post("/payForSeat", (req, res) => {
		try {
			const movieId = req.body.movieId
			const selectedSeats = req.body.seats
			const paymentDeatils = req.body.payment
			const subtotal = req.body.seats

			// BANK API HERE
			// const makePayment = await fetch("bank_api", {
			//     method: "POST",
			//     body: {}
	
			// })
	
			// if (makePayment.json().response_code !== 200) {
			//     res.status(401).json({
			//         code: 401,
			//         msg: `Payment Failed: ${e}`,
			//     })
			// }

			if (!movieSeats[movieId]) {
				movieSeats[movieId] = {};
			}
			selectedSeats.forEach((seatId) => movieSeats[movieId][seatId] = 2 )
			io.to(movieId).emit('seat_status', movieSeats[movieId]);

			res.status(200).json({
				code: 200,
				msg: "Payment successful"
			});
		} catch (e) {
			res.status(401).json({
				code: 401,
				msg: `Payment failed: ${e}`,
			});
		}
	});

	return router;
};

export default seatsManager;