const movies = require("../../data/movies.json");

exports.getMovies = (req, res) => {
  res.json(movies);
};
