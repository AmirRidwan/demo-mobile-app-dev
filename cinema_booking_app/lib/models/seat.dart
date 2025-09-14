enum SeatStatus { available, locked, selected, booked }

class Seat {
  final String id; // e.g. A1
  final int row;
  final int col;
  SeatStatus status;


  Seat({required this.id, required this.row, required this.col, this.status = SeatStatus.available});
}