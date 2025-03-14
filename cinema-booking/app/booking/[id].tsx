import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Movie, Screening, Seat, Booking } from "@/app/types";

export default function BookingScreen() {
  const { id } = useLocalSearchParams();
  const screeningId = typeof id === "string" ? parseInt(id, 10) : 0;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    if (screeningId) {
      fetchScreening();
    }
  }, [screeningId]);

  const fetchScreening = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/screenings/${screeningId}`
      );
      const data = await response.json();
      setScreening(data);

      const movieResponse = await fetch(
        `http://localhost:3000/api/movies/${data.movieId}`
      );
      const movieData = await movieResponse.json();
      setMovie(movieData);
    } catch (error) {
      console.error("Error fetching screening data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeatSelection = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert("Error", "Please select at least one seat");
      return;
    }

    if (!movie || !screening) {
      Alert.alert("Error", "Could not complete booking");
      return;
    }

    try {
      // In a real app, we would make an API call to book the seats
      // Here we just save it to AsyncStorage
      const booking: Booking = {
        id: `booking-${Date.now()}`,
        movie,
        screening,
        seats: selectedSeats,
        bookingTime: Date.now(),
      };

      const existingBookingsJson = await AsyncStorage.getItem("bookings");
      const existingBookings: Booking[] = existingBookingsJson
        ? JSON.parse(existingBookingsJson)
        : [];

      await AsyncStorage.setItem(
        "bookings",
        JSON.stringify([...existingBookings, booking])
      );

      Alert.alert("Success", "Your booking has been confirmed!", [
        {
          text: "View My Bookings",
          onPress: () => router.push("/(tabs)/bookings"),
        },
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/"),
        },
      ]);
    } catch (error) {
      console.error("Error saving booking:", error);
      Alert.alert("Error", "Something went wrong while booking");
    }
  };

  const renderSeats = () => {
    if (!screening) return null;

    // Group seats by row
    const rows: { [key: string]: Seat[] } = {};
    screening.availableSeats.forEach((seat) => {
      if (!rows[seat.row]) {
        rows[seat.row] = [];
      }
      rows[seat.row].push(seat);
    });

    // Sort rows
    const sortedRowKeys = Object.keys(rows).sort();

    return sortedRowKeys.map((row) => (
      <ThemedView key={row} style={styles.row}>
        <ThemedText style={styles.rowLabel}>{row}</ThemedText>
        <ThemedView style={styles.seatsRow}>
          {rows[row]
            .sort((a, b) => a.number - b.number)
            .map((seat) => {
              const isSelected = selectedSeats.includes(seat.id);
              const isBooked = seat.isBooked;

              return (
                <TouchableOpacity
                  key={seat.id}
                  style={[
                    styles.seat,
                    isBooked && styles.bookedSeat,
                    isSelected && styles.selectedSeat,
                  ]}
                  disabled={isBooked}
                  onPress={() => toggleSeatSelection(seat.id)}
                >
                  <ThemedText
                    style={[
                      styles.seatNumber,
                      isBooked && styles.bookedSeatText,
                      isSelected && styles.selectedSeatText,
                    ]}
                  >
                    {seat.number}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
        </ThemedView>
      </ThemedView>
    ));
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].tint}
        />
      </ThemedView>
    );
  }

  if (!screening || !movie) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText>Screening not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">{movie.title}</ThemedText>
        <ThemedText>
          {screening.date} • {screening.time} • {screening.hall}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.legendContainer}>
        <ThemedView style={styles.legendItem}>
          <ThemedView style={[styles.legendSeat]} />
          <ThemedText>Available</ThemedText>
        </ThemedView>
        <ThemedView style={styles.legendItem}>
          <ThemedView style={[styles.legendSeat, styles.selectedSeat]} />
          <ThemedText>Selected</ThemedText>
        </ThemedView>
        <ThemedView style={styles.legendItem}>
          <ThemedView style={[styles.legendSeat, styles.bookedSeat]} />
          <ThemedText>Booked</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.screenContainer}>
        <ThemedView style={styles.screen}>
          <ThemedText style={styles.screenText}>SCREEN</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.seatsContainer}>{renderSeats()}</ThemedView>

      <ThemedView style={styles.footer}>
        <ThemedView style={styles.summaryContainer}>
          <ThemedText type="defaultSemiBold">
            Selected Seats: {selectedSeats.length}
          </ThemedText>
          <ThemedText>
            {selectedSeats.length > 0
              ? selectedSeats.join(", ")
              : "No seats selected"}
          </ThemedText>
        </ThemedView>

        <TouchableOpacity
          style={[
            styles.bookButton,
            selectedSeats.length === 0 && styles.disabledButton,
          ]}
          onPress={handleBooking}
          disabled={selectedSeats.length === 0}
        >
          <ThemedText type="defaultSemiBold" style={styles.bookButtonText}>
            Book Tickets
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#DDD",
    marginRight: 8,
  },
  screenContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  screen: {
    width: "80%",
    height: 30,
    backgroundColor: "#999",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  screenText: {
    color: "#FFF",
    fontSize: 12,
  },
  seatsContainer: {
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  rowLabel: {
    width: 20,
    marginRight: 8,
    textAlign: "center",
  },
  seatsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  seat: {
    width: 30,
    height: 30,
    margin: 4,
    borderRadius: 6,
    backgroundColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
  },
  bookedSeat: {
    backgroundColor: "#999",
  },
  selectedSeat: {
    backgroundColor: Colors.light.tint,
  },
  seatNumber: {
    fontSize: 12,
  },
  bookedSeatText: {
    color: "#777",
  },
  selectedSeatText: {
    color: "#FFF",
  },
  footer: {
    marginVertical: 24,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  bookButtonText: {
    color: "#FFF",
  },
});
