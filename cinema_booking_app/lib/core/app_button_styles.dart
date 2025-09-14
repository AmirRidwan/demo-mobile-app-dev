import 'package:flutter/material.dart';

class AppButtonStyles {
  static const _defaultTextStyle =
  TextStyle(fontSize: 16, fontWeight: FontWeight.w600);

  static ButtonStyle elevated(BuildContext context) {
    final theme = Theme.of(context);

    return ButtonStyle(
      padding: WidgetStateProperty.all(
        const EdgeInsets.symmetric(vertical: 24),
      ),
      shape: WidgetStateProperty.all(
        RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      textStyle: WidgetStateProperty.all(_defaultTextStyle),
      backgroundColor: WidgetStateProperty.resolveWith<Color?>(
            (states) {
          if (states.contains(WidgetState.disabled)) {
            return theme.disabledColor.withValues(alpha: 0.3);
          }
          return theme.colorScheme.primary;
        },
      ),
      foregroundColor: WidgetStateProperty.resolveWith<Color?>(
            (states) {
          if (states.contains(WidgetState.disabled)) {
            return theme.disabledColor;
          }
          return Colors.black;
        },
      ),
    );
  }

  static ButtonStyle outlined(BuildContext context) {
    final theme = Theme.of(context);

    return ButtonStyle(
      padding: WidgetStateProperty.all(
        const EdgeInsets.symmetric(vertical: 24),
      ),
      shape: WidgetStateProperty.all(
        RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      textStyle: WidgetStateProperty.all(_defaultTextStyle),
      foregroundColor: WidgetStateProperty.resolveWith<Color?>(
            (states) {
          if (states.contains(WidgetState.disabled)) {
            return theme.disabledColor;
          }
          return theme.colorScheme.primary;
        },
      ),
      side: WidgetStateProperty.resolveWith<BorderSide?>(
            (states) {
          if (states.contains(WidgetState.disabled)) {
            return BorderSide(color: theme.disabledColor);
          }
          return BorderSide(color: theme.colorScheme.primary);
        },
      ),
    );
  }
}