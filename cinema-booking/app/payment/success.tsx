import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Booking } from "@/types";
import { paymentStyles } from "@/app/styles/paymentStyles";

export default function SuccessPage() {
  const { id } = useLocalSearchParams();
  const bookingId = typeof id === "string" ? id : "";
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, []);

  const loadBooking = async () => {
    try {
      const bookingsJson = await AsyncStorage.getItem("bookings");
      if (bookingsJson) {
        const bookings: Booking[] = JSON.parse(bookingsJson);
        const currentBooking = bookings.find((b) => b.id === bookingId);
        if (currentBooking) {
          setBooking(currentBooking);

          // Mark booking as paid in AsyncStorage
          const updatedBookings = bookings.map((b) =>
            b.id === bookingId
              ? { ...b, paid: true, paymentDate: new Date().toISOString() }
              : b
          );
          await AsyncStorage.setItem(
            "bookings",
            JSON.stringify(updatedBookings)
          );
        }
      }
    } catch (error) {
      console.error("Error loading booking:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={[paymentStyles.container, paymentStyles.centered]}>
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].tint}
        />
      </ThemedView>
    );
  }

  if (!booking) {
    return (
      <ThemedView style={[paymentStyles.container, paymentStyles.centered]}>
        <ThemedText>Booking not found</ThemedText>
        <TouchableOpacity
          style={[paymentStyles.proceedButton, paymentStyles.activeButton]}
          onPress={() => router.push("/(tabs)")}
        >
          <ThemedText style={paymentStyles.proceedButtonText}>
            Return to Home
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={paymentStyles.container}>
      <ScrollView contentContainerStyle={paymentStyles.successContainer}>
        <View style={paymentStyles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>

        <ThemedText style={paymentStyles.successTitle}>
          Payment Successful!
        </ThemedText>
        <ThemedText style={paymentStyles.successMessage}>
          Your tickets have been confirmed and are ready.
        </ThemedText>

        <View style={paymentStyles.buttonContainer}>
          <TouchableOpacity
            style={[paymentStyles.proceedButton, paymentStyles.homeButton]}
            onPress={() => router.push("/(tabs)")}
          >
            <ThemedText style={paymentStyles.proceedButtonText}>
              Return to Home
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              paymentStyles.proceedButton,
              paymentStyles.viewTicketsButton,
            ]}
            onPress={() => router.push("/(tabs)/bookings")}
          >
            <ThemedText style={paymentStyles.proceedButtonText}>
              View My Tickets
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
