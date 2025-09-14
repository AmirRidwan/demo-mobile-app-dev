import 'package:flutter/material.dart';
import '../../../providers/booking_provider.dart';

class FoodBeverageList extends StatelessWidget {
  final BookingProvider booking;

  const FoodBeverageList({super.key, required this.booking});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    if (booking.foodSelections.isEmpty) {
      return Text("No items selected", style: textTheme.bodyMedium);
    }

    return Column(
      children: booking.foodSelections.entries.map((entry) {
        final item = booking.menu[entry.key];
        if (item == null) return const SizedBox.shrink();
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("${item['name']} [x${entry.value}]", style: textTheme.bodyMedium),
              Text("RM${(item['price'] * entry.value).toStringAsFixed(2)}", style: textTheme.bodyMedium),
            ],
          ),
        );
      }).toList(),
    );
  }
}
