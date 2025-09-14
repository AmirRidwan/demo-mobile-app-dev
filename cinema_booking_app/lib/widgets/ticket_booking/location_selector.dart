import 'package:flutter/material.dart';

class LocationSelector extends StatelessWidget {
  final List<String> locations;
  final String? selectedLocation;
  final ValueChanged<String?> onChanged;

  const LocationSelector({
    super.key,
    required this.locations,
    required this.selectedLocation,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        labelText: selectedLocation == null ? "Location" : null,
      ),
      initialValue: selectedLocation,
      items: locations
          .map((loc) => DropdownMenuItem(value: loc, child: Text(loc)))
          .toList(),
      onChanged: onChanged,
    );
  }
}
