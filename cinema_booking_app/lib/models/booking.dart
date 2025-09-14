import 'movie.dart';
import 'showtime.dart';

class Booking {
  final String id;
  final Movie movie;
  final Showtime showtime;
  final DateTime date;
  final List<String> seats;
  final List<Map<String, dynamic>> food;
  final double totalAmount;
  final DateTime bookedAt;

  Booking({
    required this.id,
    required this.movie,
    required this.showtime,
    required this.date,
    required this.seats,
    required this.food,
    required this.totalAmount,
    required this.bookedAt,
  });
}
