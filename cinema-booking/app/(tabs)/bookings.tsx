import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Booking } from "@/app/types";

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const storedBookings = await AsyncStorage.getItem("bookings");
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <ThemedView style={styles.bookingCard}>
      <ThemedText type="subtitle">{item.movie.title}</ThemedText>
      <ThemedView style={styles.bookingDetails}>
        <ThemedText>
          {item.screening.date} • {item.screening.time}
        </ThemedText>
        <ThemedText>{item.screening.hall}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.seatContainer}>
        <ThemedText type="defaultSemiBold">Seats: </ThemedText>
        <ThemedText>{item.seats.join(", ")}</ThemedText>
      </ThemedView>
      <ThemedText style={styles.bookingTime}>
        Booked on: {new Date(item.bookingTime).toLocaleString()}
      </ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">My Bookings</ThemedText>
      </ThemedView>

      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item, index) => `booking-${index}`}
          contentContainerStyle={styles.bookingList}
          showsVerticalScrollIndicator={false}
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
  header: {
    marginBottom: 24,
  },
  bookingList: {
    paddingBottom: 24,
  },
  bookingCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  seatContainer: {
    flexDirection: "row",
    marginVertical: 8,
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
});
