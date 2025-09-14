import 'package:flutter/material.dart';

class Legend extends StatelessWidget {
  const Legend({super.key});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    Widget item(Color c, String label, {Color borderColor = Colors.black26}) =>
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 14,
              height: 14,
              decoration: BoxDecoration(
                color: c,
                borderRadius: BorderRadius.circular(3),
                border: Border.all(color: borderColor),
              ),
            ),
            const SizedBox(width: 6),
            Text(label, style: textTheme.bodySmall),
          ],
        );

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        item(Colors.grey.shade300, 'Available', borderColor: Colors.black26),
        item(Colors.red.shade300, 'Unavailable'),
        item(Colors.green, 'Selected'),
      ],
    );
  }
}
