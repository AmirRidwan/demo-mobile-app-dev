import 'package:flutter/material.dart';

class MovieBackButton extends StatelessWidget {
  const MovieBackButton({super.key});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Positioned(
      top: MediaQuery.of(context).padding.top + 8,
      left: 12,
      child: CircleAvatar(
        backgroundColor: scheme.surfaceContainerHighest.withValues(alpha: 0.8),
        child: IconButton(
          icon: Icon(Icons.arrow_back, color: scheme.onSurface),
          onPressed: () => Navigator.pop(context),
        ),
      ),
    );
  }
}
