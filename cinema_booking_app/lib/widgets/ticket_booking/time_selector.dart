import 'package:flutter/material.dart';

class TimeSelector extends StatelessWidget {
  final List<dynamic> filteredShowtimes;
  final String? selectedTime;
  final void Function(String label, dynamic showtime) onSelected;

  const TimeSelector({
    super.key,
    required this.filteredShowtimes,
    required this.selectedTime,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Available Time", style: textTheme.titleMedium),
        const SizedBox(height: 8),
        if (filteredShowtimes.isEmpty)
          const Text("No available time")
        else
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: filteredShowtimes.map((s) {
              final label = "${s.time} • ${s.hallType}";
              final isSelected = selectedTime == label;
              return ChoiceChip(
                label: Text(label),
                selected: isSelected,
                onSelected: (_) => onSelected(label, s),
              );
            }).toList(),
          ),
      ],
    );
  }
}
