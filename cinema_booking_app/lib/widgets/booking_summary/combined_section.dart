import 'package:flutter/material.dart';
import '../../../providers/booking_provider.dart';
import 'ticket_list.dart';
import 'food_beverage_list.dart';
import 'total_amount_row.dart';

class CombinedSection extends StatelessWidget {
  final BookingProvider booking;

  const CombinedSection({super.key, required this.booking});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: scheme.secondary.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: scheme.onSurface.withValues(alpha: 0.05),
            blurRadius: 6,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Tickets",
            style: textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          TicketList(booking: booking),
          const SizedBox(height: 20),

          Text(
            "Food & Beverages",
            style: textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          FoodBeverageList(booking: booking),
          const SizedBox(height: 20),

          const Divider(),
          const SizedBox(height: 12),

          TotalAmountRow(booking: booking),
        ],
      ),
    );
  }
}
