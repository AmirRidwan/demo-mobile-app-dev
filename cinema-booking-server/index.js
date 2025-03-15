const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const screeningsCache = new Map();
const seatsCache = new Map();
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

let movieCache = [];

const demoFnB = [
  {
    id: "combo-1",
    name: "Movie Lovers Combo",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1576028907930-ca659803d0ab?w=500",
    category: "combos",
    description: "Large popcorn, 2 medium drinks, and nachos",
  },
  {
    id: "combo-2",
    name: "Family Combo",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=500",
    category: "combos",
    description: "Jumbo popcorn, 4 medium drinks, and 2 hotdogs",
  },
  {
    id: "popcorn-large",
    name: "Large Popcorn",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?w=500",
    category: "snacks",
    description: "Freshly popped buttery popcorn",
  },
  {
    id: "popcorn-medium",
    name: "Medium Popcorn",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?w=500",
    category: "snacks",
    description: "Freshly popped buttery popcorn",
  },
  {
    id: "nachos",
    name: "Nachos with Cheese",
    price: 7.49,
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500",
    category: "snacks",
    description: "Crispy nachos with warm cheese dip",
  },
  {
    id: "hotdog",
    name: "Hotdog",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=500",
    category: "snacks",
    description: "Classic hotdog with ketchup and mustard",
  },
  {
    id: "soda-large",
    name: "Large Soda",
    price: 5.49,
    image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=500",
    category: "drinks",
    description: "Your choice of fountain drink",
  },
  {
    id: "soda-medium",
    name: "Medium Soda",
    price: 4.49,
    image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=500",
    category: "drinks",
    description: "Your choice of fountain drink",
  },
  {
    id: "water",
    name: "Bottled Water",
    price: 3.49,
    image: "https://images.unsplash.com/photo-1564419320461-6870880221ad?w=500",
    category: "drinks",
    description: "Refreshing bottled water",
  },
];

const formatTMDBMovie = (tmdbMovie, trailer) => {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    description: tmdbMovie.overview,
    posterUrl: `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`,
    trailerUrl: `https://www.youtube.com/watch?v=${trailer}`,
    genre: tmdbMovie.genre_ids
      ? "Various"
      : tmdbMovie.genres?.map((g) => g.name).join(", ") || "Various",
    rating: tmdbMovie.vote_average,
    duration: tmdbMovie.runtime
      ? `${Math.floor(tmdbMovie.runtime / 60)}h ${tmdbMovie.runtime % 60}m`
      : "Unknown",
    casts:
      tmdbMovie.credits?.cast?.slice(0, 5).map((actor) => ({
        name: actor.name,
        character: actor.character,
      })) || [],
  };
};

async function getMovieDetails(movieId) {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`
    );

    const videosResponse = await axios.get(
      `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
    );

    const trailer = videosResponse.data.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    return formatTMDBMovie(response.data, trailer.key);
  } catch (error) {
    console.error(`Error fetching movie details: ${error}`);
    return null;
  }
}

async function getMovieReviews(movieId) {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${movieId}/reviews?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );

    return response.data.results.map((review) => ({
      id: review.id,
      movieId: parseInt(movieId),
      username: review.author_username || review.author,
      rating: review.author_details?.rating || 0,
      comment: review.content,
      createdAt: review.created_at,
    }));
  } catch (error) {
    console.error(`Error fetching reviews: ${error}`);
    return [];
  }
}

async function generateScreenings(movieId) {
  try {
    const movieDetails = await getMovieDetails(movieId);
    if (!movieDetails) return [];

    // Get runtime in minutes
    const runtimeStr = movieDetails.duration;
    const runtimeHours = parseInt(runtimeStr.split("h")[0]) || 0;
    const runtimeMinutes =
      parseInt(runtimeStr.split("h ")[1]?.split("m")[0]) || 0;
    const totalRuntime = runtimeHours * 60 + runtimeMinutes;

    // Generate dates for the next 7 days
    const screenings = [];
    const halls = ["Hall A", "Hall B", "Hall C"];
    const startTimes = ["13:30", "16:00", "18:30", "21:00"];

    // Get today's date
    const today = new Date();
    let screeningId = 1;

    // Generate screenings for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      // 2-3 screenings per day
      const screeningsPerDay = 2 + Math.floor(Math.random() * 2);
      const dayTimes = [...startTimes]
        .sort(() => 0.5 - Math.random())
        .slice(0, screeningsPerDay);

      // Assign each hall once before repeating
      const shuffledHalls = [...halls].sort(() => 0.5 - Math.random());

      dayTimes.forEach((time, index) => {
        // Use halls in sequence for better distribution
        const hall = shuffledHalls[index % halls.length];

        screenings.push({
          id: screeningId++,
          movieId: parseInt(movieId),
          date: dateStr,
          time: time,
          hall: hall,
        });
      });
    }

    return screenings;
  } catch (error) {
    console.error(`Error generating screenings: ${error}`);
    return [];
  }
}

function generateSeats(hall, movieId, date) {
  const cacheKey = `${movieId}-${hall}-${date}`;

  if (seatsCache.has(cacheKey)) {
    return seatsCache.get(cacheKey);
  }

  const rows =
    hall === "Hall A"
      ? ["A", "B", "C", "D", "E"]
      : hall === "Hall B"
      ? ["A", "B", "C", "D"]
      : ["A", "B", "C"];

  const seatsPerRow = hall === "Hall A" ? 12 : hall === "Hall B" ? 10 : 8;

  const seats = [];

  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        id: `${row}-${i}`,
        row: row,
        number: i,
        isBooked: Math.random() > 0.7, // ~30% of seats are booked
      });
    }
  });

  seatsCache.set(cacheKey, seats);
  return seats;
}

// Routes
app.get("/movies", async (req, res) => {
  try {
    if (movieCache.length > 0) {
      return res.json(movieCache);
    }

    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );

    const tmdbMovies = response.data.results.slice(0, 10); // Limit to 10 movies

    const detailedMovies = await Promise.all(
      tmdbMovies.map((movie) => getMovieDetails(movie.id))
    );

    movieCache = detailedMovies.filter(Boolean); // Remove any null results

    res.json(movieCache);
  } catch (error) {
    console.error(`Error fetching movies from TMDB: ${error}`);
    res.status(500).json({ message: "Error fetching movies" });
  }
});

app.get("/movies/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const cachedMovie = movieCache.find((m) => m.id === id);
  if (cachedMovie) {
    return res.json(cachedMovie);
  }

  try {
    const movieDetails = await getMovieDetails(id);
    if (!movieDetails) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movieDetails);
  } catch (error) {
    console.error(`Error fetching movie: ${error}`);
    res.status(500).json({ message: "Error fetching movie details" });
  }
});

app.get("/screenings/:id", async (req, res) => {
  const movieId = req.params.id;
  const { hall, date } = req.query;

  if (!movieId) {
    return res.status(400).json({ message: "Movie ID is required" });
  }

  try {
    const cacheKey = `screenings-${movieId}`;
    const cachedData = screeningsCache.get(cacheKey);
    let screenings;

    if (cachedData && cachedData.timestamp > Date.now() - CACHE_EXPIRY) {
      screenings = cachedData.data;
    } else {
      screenings = await generateScreenings(movieId);
      screeningsCache.set(cacheKey, {
        timestamp: Date.now(),
        data: screenings,
      });
    }

    // If hall and date are provided, filter screenings
    if (hall && date) {
      const filtered = screenings.filter(
        (s) => s.hall === hall && s.date === date
      );

      if (filtered.length > 0) {
        return res.json(filtered[0]); // Return the first matching screening
      } else {
        return res.status(404).json({
          message: "No screening found for the specified hall and date",
        });
      }
    }

    return res.json(screenings);
  } catch (error) {
    console.error(`Error fetching screenings: ${error}`);
    return res.status(500).json({ message: "Error generating screenings" });
  }
});

const bookings = [];
app.post("/bookings", (req, res) => {
  const booking = {
    id: Date.now().toString(),
    ...req.body,
    bookingTime: Date.now(),
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

app.get("/reviews", async (req, res) => {
  const { movieId } = req.query;

  if (!movieId) {
    return res.status(400).json({ message: "Movie ID is required" });
  }

  try {
    const movieReviews = await getMovieReviews(movieId);
    res.json(movieReviews);
  } catch (error) {
    console.error(`Error fetching reviews: ${error}`);
    res.status(500).json({ message: "Error fetching movie reviews" });
  }
});

// Endpoint to get available halls for a movie
app.get("/movies/:id/halls", async (req, res) => {
  const movieId = req.params.id;

  try {
    // Check if the movie exists
    const movie = movieCache.find((m) => m.id === parseInt(movieId));
    if (!movie) {
      // Try to fetch the movie if not in cache
      try {
        const movieDetails = await getMovieDetails(movieId);
        if (!movieDetails) {
          return res.status(404).json({ message: "Movie not found" });
        }
      } catch (error) {
        return res.status(404).json({ message: "Movie not found" });
      }
    }

    // Return available halls (hardcoded for demo)
    const halls = ["Hall A", "Hall B", "Hall C"];
    res.json(halls);
  } catch (error) {
    console.error(`Error fetching halls: ${error}`);
    res.status(500).json({ message: "Error fetching available halls" });
  }
});

// Endpoint to get available dates for a movie in a specific hall
app.get("/movies/:id/halls/:hall/dates", async (req, res) => {
  const movieId = req.params.id;
  const hallName = req.params.hall;

  try {
    // Check if the movie exists
    const movie = movieCache.find((m) => m.id === parseInt(movieId));
    if (!movie) {
      // Try to fetch the movie if not in cache
      try {
        const movieDetails = await getMovieDetails(movieId);
        if (!movieDetails) {
          return res.status(404).json({ message: "Movie not found" });
        }
      } catch (error) {
        return res.status(404).json({ message: "Movie not found" });
      }
    }

    // Get screenings for this movie
    const cacheKey = `screenings-${movieId}`;
    let screenings = [];

    const cachedData = screeningsCache.get(cacheKey);
    if (cachedData && cachedData.timestamp > Date.now() - CACHE_EXPIRY) {
      screenings = cachedData.data;
    } else {
      screenings = await generateScreenings(movieId);
      screeningsCache.set(cacheKey, {
        timestamp: Date.now(),
        data: screenings,
      });
    }

    // Filter screenings by hall and extract unique dates
    const dates = [
      ...new Set(
        screenings
          .filter((screening) => screening.hall === hallName)
          .map((screening) => screening.date)
      ),
    ].sort();

    res.json(dates);
  } catch (error) {
    console.error(`Error fetching dates: ${error}`);
    res.status(500).json({ message: "Error fetching available dates" });
  }
});

// Update the seats endpoint to handle hall and date parameters
app.get("/screenings/:id/seats", async (req, res) => {
  const movieId = req.params.id;
  const { hall, date } = req.query;

  if (!movieId || !hall || !date) {
    return res.status(400).json({
      message: "Movie ID, hall, and date are required",
    });
  }

  try {
    // Generate seats based on the hall, movie ID, and date
    const seats = generateSeats(hall, movieId, date);
    res.json(seats);
  } catch (error) {
    console.error(`Error generating seats: ${error}`);
    res.status(500).json({ message: "Error generating seats" });
  }
});

app.get("/fnbItems", (req, res) => {
  return res.json(demoFnB);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
