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

let movieCache = [];

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
    
    return response.data.results.map(review => ({
      id: review.id,
      movieId: parseInt(movieId),
      username: review.author_username || review.author,
      rating: review.author_details?.rating || 0,
      comment: review.content,
      createdAt: review.created_at
    }));
  } catch (error) {
    console.error(`Error fetching reviews: ${error}`);
    return [];
  }
}

// Mock data
const screenings = [
  {
    id: 1,
    movieId: 1,
    date: "2024-03-14",
    time: "18:30",
    hall: "Hall A",
    availableSeats: Array.from({ length: 50 }, (_, i) => ({
      id: `A-${i + 1}`,
      row: "A",
      number: i + 1,
      isBooked: Math.random() > 0.7,
    })),
  },
  {
    id: 2,
    movieId: 1,
    date: "2024-03-14",
    time: "21:00",
    hall: "Hall B",
    availableSeats: Array.from({ length: 50 }, (_, i) => ({
      id: `B-${i + 1}`,
      row: "B",
      number: i + 1,
      isBooked: Math.random() > 0.7,
    })),
  },
];

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

  // Check if movie exists in cache
  const cachedMovie = movieCache.find((m) => m.id === id);
  if (cachedMovie) {
    return res.json(cachedMovie);
  }

  // If not in cache, fetch directly from TMDB
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

app.get("/screenings", (req, res) => {
  const { movieId } = req.query;
  if (movieId) {
    const filteredScreenings = screenings.filter(
      (s) => s.movieId === parseInt(movieId)
    );
    return res.json(filteredScreenings);
  }
  res.json(screenings);
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
