import 'seat.dart';

class Showtime {
  final String id;
  final String date;
  final String time;
  final String hall;
  final String hallType;
  final String location;
  final List<Seat> seats;

  Showtime({
    required this.id,
    required this.date,
    required this.time,
    required this.hall,
    required this.hallType,
    required this.location,
    required this.seats,
  });

  factory Showtime.fromJson(Map<String, dynamic> json) {
    if (json['seats'] != null) {
      return Showtime(
        id: json['id'],
        date: json['date'],
        time: json['time'],
        hall: json['hall'],
        hallType: json['hallType'],
        location: json['location'],
        seats: (json['seats'] as List<dynamic>)
            .map((s) => Seat(
          id: s['id'],
          row: s['row'],
          col: s['col'],
          status: SeatStatus.values[s['status'] ?? 0],
        ))
            .toList(),
      );
    }

    // Otherwise → auto-generate 8 rows × 10 cols
    List<Seat> generatedSeats = [];
    for (int row = 0; row < 8; row++) {
      for (int col = 0; col < 10; col++) {
        generatedSeats.add(
          Seat(
            id: "${String.fromCharCode(65 + row)}${col + 1}", // A1, A2...
            row: row,
            col: col,
            status: SeatStatus.available,
          ),
        );
      }
    }

    return Showtime(
      id: json['id'],
      date: json['date'],
      time: json['time'],
      hall: json['hall'],
      hallType: json['hallType'],
      location: json['location'],
      seats: generatedSeats,
    );
  }
}