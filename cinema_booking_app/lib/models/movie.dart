import 'review.dart';
import 'showtime.dart';

class Movie {
  final int id;
  final String title;
  final String posterUrl;
  final String? trailerUrl;
  final int durationMin;
  final String rating;
  final double ratingValue;
  final int reviewCount;
  final String releaseDate;
  final List<String> genres;
  final String synopsis;
  final List<String> casts;
  final String director;
  final List<String> writers;
  final List<Showtime> showtimes;
  final List<Review> reviews;
  bool isFavorite;

  Movie({
    required this.id,
    required this.title,
    required this.posterUrl,
    this.trailerUrl,
    required this.durationMin,
    required this.rating,
    required this.ratingValue,
    required this.reviewCount,
    required this.releaseDate,
    required this.genres,
    required this.synopsis,
    required this.casts,
    required this.director,
    required this.writers,
    required this.showtimes,
    required this.reviews,
    this.isFavorite = false,
  });

  factory Movie.fromJson(Map<String, dynamic> json) => Movie(
    id: json['id'],
    title: json['title'],
    posterUrl: json['posterUrl'],
    trailerUrl: json['trailerUrl'],
    durationMin: json['durationMin'],
    rating: json['rating'],
    ratingValue: (json['ratingValue'] as num).toDouble(),
    reviewCount: json['reviewCount'],
    releaseDate: json['releaseDate'],
    genres: List<String>.from(json['genres'] ?? []),
    synopsis: json['synopsis'],
    casts: List<String>.from(json['casts'] ?? []),
    director: json['director'],
    writers: List<String>.from(json['writers'] ?? []),
    showtimes: (json['showtimes'] as List)
        .map((e) => Showtime.fromJson(e))
        .toList(),
    reviews: (json['reviews'] as List)
        .map((e) => Review.fromJson(e))
        .toList(),
  );
}

