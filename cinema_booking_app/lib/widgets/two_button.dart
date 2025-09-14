import 'package:flutter/material.dart';
import '../core/app_button_styles.dart';

class TwoButton extends StatelessWidget {
  final String leftText;
  final String rightText;
  final VoidCallback? onLeftPressed;
  final VoidCallback? onRightPressed;

  const TwoButton({
    super.key,
    required this.leftText,
    required this.rightText,
    this.onLeftPressed,
    this.onRightPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: OutlinedButton(
              style: AppButtonStyles.outlined(context),
              onPressed: onLeftPressed,
              child: Text(leftText),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ElevatedButton(
              style: AppButtonStyles.elevated(context),
              onPressed: onRightPressed,
              child: Text(rightText),
            ),
          ),
        ],
      ),
    );
  }
}
