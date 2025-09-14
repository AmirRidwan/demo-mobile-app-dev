import 'package:flutter/material.dart';
import '../../../providers/booking_provider.dart';

class BookingSummary extends StatelessWidget {
  final BookingProvider booking;

  const BookingSummary({super.key, required this.booking});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const Icon(Icons.event_seat_outlined),
          const SizedBox(width: 8),
          Text(
            "${booking.selectedSeats.length} ticket${booking.selectedSeats.length > 1 ? 's' : ''}",
            style: textTheme.bodyLarge,
          ),
          const Spacer(),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text("Total", style: textTheme.bodySmall),
              Text(
                "RM${booking.seatSubtotal.toStringAsFixed(2)}",
                style: textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
