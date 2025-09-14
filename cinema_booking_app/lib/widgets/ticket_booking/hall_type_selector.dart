import 'package:flutter/material.dart';

class HallTypeSelector extends StatelessWidget {
  final List<String> hallTypes;
  final Set<String> selectedHallTypes;
  final void Function(String hallType, bool selected) onChanged;

  const HallTypeSelector({
    super.key,
    required this.hallTypes,
    required this.selectedHallTypes,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Select Hall Type", style: textTheme.titleMedium),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          children: hallTypes.map((ht) {
            final isSelected = selectedHallTypes.contains(ht);
            return FilterChip(
              label: Text(ht),
              selected: isSelected,
              onSelected: (selected) => onChanged(ht, selected),
            );
          }).toList(),
        ),
      ],
    );
  }
}
