import 'package:flutter/material.dart';
import 'package:dotted_line/dotted_line.dart';

class CutoutDivider extends StatelessWidget {
  const CutoutDivider({super.key});

  @override
  Widget build(BuildContext context) {
    final bg = Theme.of(context).scaffoldBackgroundColor;

    return SizedBox(
      height: 24,
      child: Stack(
        alignment: Alignment.center,
        children: [
          const DottedLine(dashLength: 6, dashGapLength: 4, lineThickness: 1),
          Align(
            alignment: Alignment.centerLeft,
            child: Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
            ),
          ),
          Align(
            alignment: Alignment.centerRight,
            child: Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
            ),
          ),
        ],
      ),
    );
  }
}
