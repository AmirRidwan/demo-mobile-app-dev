const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

const seats = new Map();

wss.on("connection", (ws) => {
  console.log("✅ Client connected");

  ws.on("message", (msg) => {
    const message = msg.toString();
    console.log("📥 Received:", message);

    if (message.startsWith("LOCK::")) {
      // Format: LOCK::showtimeId::seatId
      const [, showtimeId, seatId] = message.split("::");
      if (!seats.has(showtimeId)) seats.set(showtimeId, new Set());
      seats.get(showtimeId).add(seatId);

      broadcast(message);
    } else if (message.startsWith("UNLOCK::")) {
      // Format: UNLOCK::showtimeId::seatId
      const [, showtimeId, seatId] = message.split("::");
      if (seats.has(showtimeId)) {
        seats.get(showtimeId).delete(seatId);
      }

      broadcast(message);
    } else if (message.startsWith("STATE_REQUEST::")) {
      // Format: STATE_REQUEST::showtimeId
      const [, showtimeId] = message.split("::");
      const lockedSeats = seats.has(showtimeId)
        ? Array.from(seats.get(showtimeId))
        : [];
      const response = `STATE_RESPONSE::${showtimeId}::${lockedSeats.join(",")}`;

      console.log("📤 Sending:", response);
      ws.send(response);
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
