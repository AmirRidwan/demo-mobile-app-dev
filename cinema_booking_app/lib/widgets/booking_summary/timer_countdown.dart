import 'package:flutter/material.dart';

class TimerCountdown extends StatelessWidget {
  final String timeText;

  const TimerCountdown({super.key, required this.timeText});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Center(
      child: Text(
        "Time left: $timeText",
        style: textTheme.titleMedium?.copyWith(
          color: scheme.error,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
