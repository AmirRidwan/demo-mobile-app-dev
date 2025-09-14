import 'package:flutter/material.dart';
import '../models/movie.dart';
import '../services/movie_service.dart';

class MoviesProvider extends ChangeNotifier {
  final _service = MoviesService();
  List<Movie> _movies = [];
  bool _loading = false;
  String? _error;
  String _query = "";

  List<Movie> get movies => _movies;
  List<Movie> get favorites => _movies.where((m) => m.isFavorite).toList();
  bool get loading => _loading;
  String? get error => _error;

  void setQuery(String query) {
    _query = query;
    notifyListeners();
  }

  String get query => _query;

  List<Movie> get filteredMovies {
    if (_query.isEmpty) return _movies;

    final queryLower = _query.toLowerCase();

    return _movies.where((m) {
      final titleMatch = m.title.toLowerCase().contains(queryLower);
      final locationMatch = m.showtimes.any(
            (s) => s.location.toLowerCase().contains(queryLower),
      );
      return titleMatch || locationMatch;
    }).toList();
  }

  Future<void> loadMovies() async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      _movies = await _service.fetchMovies();
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  void toggleFavorite(Movie movie) {
    final index = _movies.indexWhere((m) => m.id == movie.id);
    if (index != -1) {
      _movies[index].isFavorite = !_movies[index].isFavorite;
      notifyListeners();
    }
  }

}