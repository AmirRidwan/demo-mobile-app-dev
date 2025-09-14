import 'package:flutter/material.dart';
import '../../../providers/booking_provider.dart';

class TicketList extends StatelessWidget {
  final BookingProvider booking;

  const TicketList({super.key, required this.booking});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    if (booking.confirmedSeats.isEmpty) {
      return Text("No seats selected", style: textTheme.bodyMedium);
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          "${booking.selectedShowtime?.hallType} tickets [x${booking.confirmedSeats.length}]",
          style: textTheme.bodyMedium,
        ),
        Text(
          "RM${booking.seatSubtotal.toStringAsFixed(2)}",
          style: textTheme.bodyMedium,
        ),
      ],
    );
  }
}
