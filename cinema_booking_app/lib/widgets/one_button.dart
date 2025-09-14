import 'package:flutter/material.dart';
import '../core/app_button_styles.dart';

class OneButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;

  const OneButton({super.key, required this.label, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        style: AppButtonStyles.elevated(context),
        onPressed: onPressed,
        child: Text(label),
      ),
    );
  }
}
