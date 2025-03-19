import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";

interface BackButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  color?: string;
  defaultPath?: string;
}

export function BackButton({
  onPress,
  style,
  color,
  defaultPath = "/(tabs)",
}: BackButtonProps) {
  const colorScheme = useColorScheme();
  const buttonColor = color || (colorScheme === "dark" ? "white" : "black");

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate back or to specified default path
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push(defaultPath);
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <AntDesign name="arrowleft" size={24} color={buttonColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 50, // Consistent top position
    left: 15,
    zIndex: 1000,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
