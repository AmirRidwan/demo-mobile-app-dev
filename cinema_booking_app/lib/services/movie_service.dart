import 'dart:convert';

import 'package:http/http.dart' as http;

import '../core/app_config.dart';
import '../models/movie.dart';

class MoviesService {
  Future<List<Movie>> fetchMovies() async {
    final baseUrl = await AppConfig.getBaseUrl();
    final apiUrl = "$baseUrl/movies";

    final res = await http
        .get(Uri.parse(apiUrl))
        .timeout(const Duration(seconds: 5));

    if (res.statusCode == 200) {
      final List data = json.decode(res.body);
      print("✅ MoviesService: Loaded ${data.length} movies from API");
      return data.map((e) => Movie.fromJson(e)).toList();
    } else {
      throw Exception("MoviesService failed: status ${res.statusCode}");
    }
  }
}
