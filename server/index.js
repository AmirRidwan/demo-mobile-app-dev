// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc';

import movie from './routes/movie.js';
import seatsManager from './routes/seatsManager.js';


const app = express();
app.use(express.json()); 
app.use(cors());


const swaggerConfig = swaggerJSDoc({
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'API Documentation',
			version: '1.0.0',
		},
		tags: [
			{
				name: "/movie",
				description: "Route consisting of APIs to get detailed list of movies and movie schedules"
			},
			{
				name: "/seatsManager",
				description: "Route managing the cinema seats of scheduled movies"
			},
			{
				name: "/seatsManager/socket.io",
				description: "A WebSocket located under /seatsManager managing live seats booking statuses by receiving and sending seat booking updates (NOT AN API ENDPOINT)"
			}
		],
	},
	apis: ['./routes/*.js', './docs/*.js'],
})
app.use("/apiDocs", swaggerUi.serve, swaggerUi.setup(swaggerConfig))

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});



// REST API TO GET MOVIE DATA / SHOW TIMES
app.use("/movie", movie)

// LIVE SEATS DATA WS
app.use("/seatsManager", seatsManager(io))


const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
