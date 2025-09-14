import 'package:flutter/material.dart';
import '../../../providers/booking_provider.dart';

class TotalAmountRow extends StatelessWidget {
  final BookingProvider booking;

  const TotalAmountRow({super.key, required this.booking});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          "Total Amount Payable",
          style: textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
        ),
        Text(
          "RM${booking.totalAmount.toStringAsFixed(2)}",
          style: textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
