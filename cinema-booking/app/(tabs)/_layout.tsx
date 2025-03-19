import { Tabs } from "expo-router";
import React from "react";
import { Platform, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  TabBarVisibilityProvider,
  useTabBarVisibility,
} from "@/components/TabBarVisibility";

// Define TAB_BAR_HEIGHT
const TAB_BAR_HEIGHT = Dimensions.get("window").height * 0.08;

function TabNavigator() {
  const colorScheme = useColorScheme();
  const { translateY, opacity, visible } = useTabBarVisibility();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          ...Platform.select({
            ios: {
              position: "absolute",
              overflow: "hidden",
            },
            default: {
              overflow: "hidden",
            },
          }),
          transform: [{ translateY: translateY }],
          opacity: opacity, // Add opacity animation
          bottom: 0,
          left: 0,
          right: 0,
          height: TAB_BAR_HEIGHT,
          pointerEvents: visible ? 'auto' : 'none', // Set directly based on visible state
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Movies",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="videocam-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="screenings"
        options={{
          title: "Screenings",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="scan-circle-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "My Bookings",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="calendar-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <TabBarVisibilityProvider>
      <TabNavigator />
    </TabBarVisibilityProvider>
  );
}