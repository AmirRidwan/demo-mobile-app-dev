const express = require("express");
const http = require("http");
const cors = require("cors");
const initWebSocket = require("./src/ws/seatSocket");

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const moviesRoute = require("./src/routes/movies");
const fnbRoute = require("./src/routes/fnb");

app.use("/movies", moviesRoute);
app.use("/fnb", fnbRoute);

// Init WebSocket
initWebSocket(server);

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 REST API running at http://localhost:${PORT}`);
  console.log(`🔌 WebSocket running at ws://localhost:${PORT}`);
});
