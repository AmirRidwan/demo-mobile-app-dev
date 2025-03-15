import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Booking } from "@/types";

const BookingCard = ({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: (id: string) => void;
}) => (
  <ThemedView style={styles.bookingCard}>
    <ThemedText type="subtitle">{booking.movie.title}</ThemedText>

    <ThemedView style={styles.bookingDetails}>
      <ThemedText>
        {booking.screening.date} • {booking.screening.time}
      </ThemedText>
      <ThemedText>{booking.screening.hall}</ThemedText>
    </ThemedView>

    <ThemedView style={styles.seatContainer}>
      <ThemedText type="defaultSemiBold">Seats: </ThemedText>
      <ThemedText>{booking.seats.join(", ")}</ThemedText>
    </ThemedView>

    {/* FnB Items Section */}
    {booking.fnbItems && booking.fnbItems.length > 0 && (
      <ThemedView style={styles.fnbContainer}>
        <ThemedText type="defaultSemiBold" style={styles.fnbTitle}>
          Food & Beverages:
        </ThemedText>

        {booking.fnbItems.map((item, index) => (
          <ThemedView key={`fnb-${index}`} style={styles.fnbItem}>
            <ThemedText>
              {item.quantity}x {item.name}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    )}

    <ThemedView style={styles.summaryContainer}>
      <ThemedText type="defaultSemiBold" style={{ marginTop: 10 }}>
        Total: ${booking.grandTotal?.toFixed(2) || booking.subtotal.toFixed(2)}
      </ThemedText>
    </ThemedView>

    <ThemedText style={styles.bookingTime}>
      Booked on: {new Date(booking.bookingTime).toLocaleString()}
    </ThemedText>

    <TouchableOpacity
      style={styles.cancelButton}
      onPress={() => onCancel(booking.id)}
    >
      <ThemedText style={styles.cancelButtonText}>Cancel Booking</ThemedText>
    </TouchableOpacity>
  </ThemedView>
);

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadBookings = useCallback(async () => {
    try {
      const storedBookings = await AsyncStorage.getItem("bookings");
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
      Alert.alert("Error", "Failed to load your bookings. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadBookings();
  };

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              // Remove the booking from the list
              const updatedBookings = bookings.filter(
                (booking) => booking.id !== bookingId
              );
              setBookings(updatedBookings);

              // Save to AsyncStorage
              await AsyncStorage.setItem(
                "bookings",
                JSON.stringify(updatedBookings)
              );
              Alert.alert("Success", "Your booking has been cancelled.");
            } catch (error) {
              console.error("Error cancelling booking:", error);
              Alert.alert(
                "Error",
                "Failed to cancel your booking. Please try again."
              );
              // Reload bookings to ensure UI is in sync with storage
              loadBookings();
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>
          Loading your bookings...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">My Bookings</ThemedText>
      </ThemedView>

      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={({ item }) => (
            <BookingCard booking={item} onCancel={handleCancelBooking} />
          )}
          keyExtractor={(item) => item.id || `booking-${item.bookingTime}`}
          contentContainerStyle={styles.bookingList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      ) : (
        <ThemedView style={styles.noBookings}>
          <ThemedText type="subtitle">No bookings found</ThemedText>
          <ThemedText>Your booked tickets will appear here</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  loadingText: {
    marginTop: 16,
  },
  bookingList: {
    paddingBottom: 24,
  },
  bookingCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  summaryContainer: {
    marginTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
  },
  seatContainer: {
    flexDirection: "row",
    marginVertical: 8,
  },
  fnbContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
  },
  fnbTitle: {
    marginBottom: 8,
  },
  fnbItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bookingTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  noBookings: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#ff4d4f",
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
