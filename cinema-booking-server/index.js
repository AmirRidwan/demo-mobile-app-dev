const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// In-memory data store
const movies = [
  {
    id: 1,
    title: "Avengers: Endgame",
    genre: "Action, Adventure",
    duration: "3h 2m",
    posterUrl: "https://picsum.photos/500/750",
    description:
      "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Joker",
    genre: "Crime, Drama",
    duration: "2h 2m",
    posterUrl: "https://picsum.photos/500/751",
    description:
      "In Gotham City, mentally troubled comedian Arthur Fleck embarks on a downward spiral of revolution and bloody crime.",
    rating: 4.5,
  },
  {
    id: 3,
    title: "Parasite",
    genre: "Comedy, Drama, Thriller",
    duration: "2h 12m",
    posterUrl: "https://picsum.photos/500/752",
    description:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    rating: 4.6,
  },
  {
    id: 4,
    title: "Dune",
    genre: "Sci-Fi, Adventure",
    duration: "2h 35m",
    posterUrl: "https://picsum.photos/500/753",
    description:
      "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
    rating: 4.3,
  },
];

const screenings = [
  {
    id: 1,
    movieId: 1,
    date: "2023-06-15",
    time: "18:00",
    hall: "Hall A",
    availableSeats: generateSeats(),
  },
  {
    id: 2,
    movieId: 1,
    date: "2023-06-15",
    time: "21:30",
    hall: "Hall B",
    availableSeats: generateSeats(),
  },
  {
    id: 3,
    movieId: 2,
    date: "2023-06-15",
    time: "17:00",
    hall: "Hall C",
    availableSeats: generateSeats(),
  },
  {
    id: 4,
    movieId: 3,
    date: "2023-06-16",
    time: "19:00",
    hall: "Hall A",
    availableSeats: generateSeats(),
  },
  {
    id: 5,
    movieId: 4,
    date: "2023-06-16",
    time: "20:00",
    hall: "Hall D",
    availableSeats: generateSeats(),
  },
];

const bookings = [];

// Generate a 10x8 seating layout
function generateSeats() {
  const seats = [];
  const rows = "ABCDEFGH";

  for (let i = 0; i < rows.length; i++) {
    for (let j = 1; j <= 10; j++) {
      seats.push({
        id: `${rows[i]}${j}`,
        row: rows[i],
        number: j,
        isBooked: Math.random() < 0.2, // Randomly mark some seats as booked
      });
    }
  }

  return seats;
}

// API endpoints
app.get("/api/movies", (req, res) => {
  res.json(movies);
});

app.get("/api/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
});

app.get("/api/screenings", (req, res) => {
  const { movieId, date } = req.query;
  let filteredScreenings = [...screenings];

  if (movieId) {
    filteredScreenings = filteredScreenings.filter(
      (s) => s.movieId === parseInt(movieId)
    );
  }

  if (date) {
    filteredScreenings = filteredScreenings.filter((s) => s.date === date);
  }

  res.json(filteredScreenings);
});

app.get("/api/screenings/:id", (req, res) => {
  const screening = screenings.find((s) => s.id === parseInt(req.params.id));
  if (!screening)
    return res.status(404).json({ message: "Screening not found" });
  res.json(screening);
});

app.post("/api/bookings", (req, res) => {
  const { screeningId, seats, userInfo } = req.body;

  if (!screeningId || !seats || !seats.length || !userInfo) {
    return res
      .status(400)
      .json({ message: "Missing required booking information" });
  }

  const screening = screenings.find((s) => s.id === screeningId);
  if (!screening)
    return res.status(404).json({ message: "Screening not found" });

  // Check if seats are available
  for (const seatId of seats) {
    const seat = screening.availableSeats.find((s) => s.id === seatId);
    if (!seat || seat.isBooked) {
      return res
        .status(400)
        .json({ message: `Seat ${seatId} is not available` });
    }
  }

  // Book the seats
  seats.forEach((seatId) => {
    const seat = screening.availableSeats.find((s) => s.id === seatId);
    seat.isBooked = true;
  });

  // Create booking record
  const booking = {
    id: bookings.length + 1,
    screeningId,
    movie: movies.find((m) => m.id === screening.movieId),
    screening: {
      date: screening.date,
      time: screening.time,
      hall: screening.hall,
    },
    seats: seats,
    userInfo,
    bookingTime: new Date().toISOString(),
  };

  bookings.push(booking);

  // Emit socket event for real-time updates
  io.emit("seatBooked", { screeningId, seats });

  res.status(201).json(booking);
});

// Socket.io connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinScreening", (screeningId) => {
    socket.join(`screening-${screeningId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
