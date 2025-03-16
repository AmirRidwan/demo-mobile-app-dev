/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTheme } from "react-native-paper";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useTheme();
  const colorScheme = useColorScheme() ?? "light";

  // Use Paper theme colors where possible, fall back to your custom colors
  if (colorName === "text") {
    return theme.colors.onBackground;
  } else if (colorName === "background") {
    return theme.colors.background;
  }

  // For other colors, use your existing logic
  const colorFromProps = props[colorScheme];
  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[colorScheme][colorName];
}
