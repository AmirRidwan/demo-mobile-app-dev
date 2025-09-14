import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:http/http.dart' as http;
import '../models/movie.dart';

class MoviesService {
  final String apiUrl =
      "https://raw.githubusercontent.com/AmirRidwan/cinema-mock-api/main/data/movies.json";

  Future<List<Movie>> fetchMovies() async {
    try {
      final res = await http.get(Uri.parse(apiUrl));
      if (res.statusCode == 200) {
        final List data = json.decode(res.body);
        return data.map((e) => Movie.fromJson(e)).toList();
      } else {
        throw Exception("MoviesService failed: status ${res.statusCode}");
      }
    } catch (e) {
      // fallback to bundled JSON in assets
      final jsonStr = await rootBundle.loadString("assets/data/movies.json");
      final List data = json.decode(jsonStr);
      return data.map((e) => Movie.fromJson(e)).toList();
    }
  }
}
