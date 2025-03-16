// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { movie } from './routes/movie.js';
import liveSeatsWebsocket from './routes/liveSeatsWebsocket.js';


const app = express();
app.use(express.json()); 
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

// LIVE SEATS DATA WS
liveSeatsWebsocket(io)

// REST API TO GET MOVIE DATA / SHOW TIMES
app.use("/movie", movie)

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
