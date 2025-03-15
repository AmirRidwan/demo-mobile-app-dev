import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Movie, Screening, Seat, Booking } from "@/types";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import API_CONFIG from "@/utils/api";

export default function BookingScreen() {
  const { id } = useLocalSearchParams();
  const movieId = typeof id === "string" ? parseInt(id, 10) : 0;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state variables
  const [availableHalls, setAvailableHalls] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hallModalVisible, setHallModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  // Add seat cache
  const [seatCache, setSeatCache] = useState<{ [key: string]: Seat[] }>({});

  const colorScheme = useColorScheme();
  const router = useRouter();
  const { isConnected } = useNetworkStatus();

  const TICKET_PRICE = 10;

  useEffect(() => {
    if (movieId) {
      fetchMovieAndHalls();
    }
  }, [movieId]);

  // Enhanced handleRetry function
  const handleRetry = useCallback(() => {
    setLoading(true);
    setLoadingSeats(false);
    setError(null);
    setSeats([]);
    setSelectedSeats([]);
    setMovie(null);
    setScreening(null);
    setSelectedHall(null);
    setSelectedDate(null);
    setSubtotal;
    setAvailableHalls([]);
    setAvailableDates([]);

    if (!isConnected) {
      setTimeout(() => {
        setLoading(false);
        setError(
          "No internet connection. Please check your network settings and try again."
        );
      }, 500);
      return;
    }

    setTimeout(() => {
      fetchMovieAndHalls();
    }, 10);
  }, [isConnected, movieId]);

  const fetchMovieAndHalls = async () => {
    try {
      const movieResponse = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MOVIES}/${movieId}`
      );

      if (!movieResponse.ok) {
        throw new Error(`Movie not found (status ${movieResponse.status})`);
      }

      const movieData = await movieResponse.json();
      setMovie(movieData);

      const hallsResponse = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MOVIES}/${movieId}/halls`
      );

      if (!hallsResponse.ok) {
        throw new Error(
          `Could not fetch halls (status ${hallsResponse.status})`
        );
      }

      const hallsData = await hallsResponse.json();
      setAvailableHalls(hallsData);

      setError(null);
    } catch (error) {
      console.error("Error fetching movie data:", error);
      setError("Could not load movie information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDates = async (hall: string) => {
    try {
      if (!isConnected) {
        Alert.alert(
          "Error",
          "No internet connection. Please check your network settings."
        );
        return;
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MOVIES}/${movieId}/halls/${hall}/dates`
      );

      if (!response.ok) {
        throw new Error(`Could not fetch dates (status ${response.status})`);
      }

      const datesData = await response.json();
      setAvailableDates(datesData);
    } catch (error) {
      console.error("Error fetching available dates:", error);
      Alert.alert("Error", "Failed to load available dates. Please try again.");
    }
  };

  const fetchScreening = async () => {
    if (!selectedHall || !selectedDate) return;

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCREENINGS}/${movieId}?hall=${selectedHall}&date=${selectedDate}`
      );

      if (!response.ok) {
        throw new Error(`Screening not found (status ${response.status})`);
      }

      const data = await response.json();
      setScreening(data);

      // Clear selected seats when changing screening
      setSelectedSeats([]);

      await fetchSeats(movieId, selectedHall, selectedDate);
    } catch (error) {
      console.error("Error fetching screening data:", error);
      Alert.alert(
        "Error",
        "Could not load screening information. Please try again."
      );
    }
  };

  const fetchSeats = async (movieId: number, hall: string, date: string) => {
    try {
      setLoadingSeats(true);

      // Check if we have cached seats for this combination
      const cacheKey = `${movieId}-${hall}-${date}`;
      if (seatCache[cacheKey]) {
        setSeats(seatCache[cacheKey]);
        setLoadingSeats(false);
        return;
      }

      // No internet connection
      if (!isConnected) {
        setLoadingSeats(false);
        setError("No internet connection. Cannot load seat information.");
        return;
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCREENINGS}/${movieId}/seats?hall=${hall}&date=${date}`
      );

      if (!response.ok) {
        throw new Error(`Could not fetch seats (status ${response.status})`);
      }

      const seatsData = await response.json();

      // Update the seat cache
      setSeatCache((prevCache) => ({
        ...prevCache,
        [cacheKey]: seatsData,
      }));

      setSeats(seatsData);
    } catch (error) {
      console.error("Error fetching seats:", error);
      Alert.alert("Error", "Failed to load seats. Please try again.");
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleHallSelect = (hall: string) => {
    // Clear selected seats when hall changes
    setSelectedSeats([]);
    setSelectedHall(hall);
    setHallModalVisible(false);
    setSeats([]);
    setSubtotal(0);
    fetchAvailableDates(hall);
  };

  const handleDateSelect = (date: string) => {
    // Clear selected seats when date changes
    setSelectedSeats([]);
    setSelectedDate(date);
    setSubtotal(0);
    setDateModalVisible(false);

    if (selectedHall && date) {
      fetchScreeningWithParams(movieId, selectedHall, date);
    }
  };

  // Add this helper function
  const fetchScreeningWithParams = async (
    movieId: number,
    hall: string,
    date: string
  ) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCREENINGS}/${movieId}?hall=${hall}&date=${date}`
      );

      if (!response.ok) {
        throw new Error(`Screening not found (status ${response.status})`);
      }

      const data = await response.json();
      setScreening(data);

      // Clear selected seats when changing screening
      setSelectedSeats([]);

      await fetchSeats(movieId, hall, date);
    } catch (error) {
      console.error("Error fetching screening data:", error);
      Alert.alert(
        "Error",
        "Could not load screening information. Please try again."
      );
    }
  };

  const toggleSeatSelection = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
      setSubtotal(Number((subtotal - TICKET_PRICE).toFixed(2)));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
      setSubtotal(Number((subtotal + TICKET_PRICE).toFixed(2)));
    }
  };

  const handleBooking = async () => {
    if (!isConnected) {
      Alert.alert(
        "No Internet Connection",
        "You need to be online to complete a booking."
      );
      return;
    }

    if (selectedSeats.length === 0) {
      Alert.alert("Error", "Please select at least one seat");
      return;
    }

    if (!movie || !screening) {
      Alert.alert("Error", "Could not complete booking");
      return;
    }

    try {
      const booking: Booking = {
        id: `booking-${Date.now()}`,
        movie,
        screening,
        seats: selectedSeats,
        bookingTime: Date.now(),
        subtotal: subtotal
      };

      const existingBookingsJson = await AsyncStorage.getItem("bookings");
      const existingBookings: Booking[] = existingBookingsJson
        ? JSON.parse(existingBookingsJson)
        : [];

      await AsyncStorage.setItem(
        "bookings",
        JSON.stringify([...existingBookings, booking])
      );

      router.push(`/others/${booking.id}`);

      // Alert.alert("Success", "Your booking has been confirmed!", [
      //   {
      //     text: "View My Bookings",
      //     onPress: () => router.push("/(tabs)/bookings"),
      //   },
      //   {
      //     text: "Back to Movies",
      //     onPress: () => router.push("/"),
      //   },
      // ]);
    } catch (error) {
      console.error("Error saving booking:", error);
      Alert.alert("Error", "Something went wrong while booking");
    }
  };

  const renderSeats = () => {
    if (loadingSeats) {
      return (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={Colors[colorScheme ?? "light"].tint}
          />
          <ThemedText style={{ marginTop: 10 }}>Loading seats...</ThemedText>
        </ThemedView>
      );
    }

    if (!seats || seats.length === 0) {
      return (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText>No seats available for this screening</ThemedText>
        </ThemedView>
      );
    }

    // Group seats by row
    const rows: { [key: string]: Seat[] } = {};
    seats.forEach((seat) => {
      if (!rows[seat.row]) {
        rows[seat.row] = [];
      }
      rows[seat.row].push(seat);
    });

    // Sort rows alphabetically
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

  if (error) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText type="defaultSemiBold" style={styles.backButtonText}>
            Go Back
          </ThemedText>
        </TouchableOpacity>
        {isConnected && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              handleRetry();
            }}
          >
            <ThemedText type="defaultSemiBold" style={styles.retryButtonText}>
              Retry
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    );
  }

  if (!movie) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText>Movie not found</ThemedText>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText type="defaultSemiBold" style={styles.backButtonText}>
            Go Back
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">{movie.title}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.pickerSection}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Select Hall and Date
        </ThemedText>

        {/* Hall Picker */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setHallModalVisible(true)}
        >
          <ThemedText>
            {selectedHall ? `Hall: ${selectedHall}` : "Select Hall"}
          </ThemedText>
        </TouchableOpacity>

        {/* Date Picker (enabled only when hall is selected) */}
        <TouchableOpacity
          style={[styles.pickerButton, !selectedHall && styles.disabledButton]}
          onPress={() => selectedHall && setDateModalVisible(true)}
          disabled={!selectedHall}
        >
          <ThemedText>
            {selectedDate ? `Date: ${selectedDate}` : "Select Date"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Hall Modal */}
      <Modal
        visible={hallModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setHallModalVisible(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
              Select Hall
            </ThemedText>
            <FlatList
              data={availableHalls}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleHallSelect(item)}
                >
                  <ThemedText>{item}</ThemedText>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setHallModalVisible(false)}
            >
              <ThemedText style={styles.closeButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>

      {/* Date Modal */}
      <Modal
        visible={dateModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDateModalVisible(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
              Select Date
            </ThemedText>
            {availableDates.length > 0 ? (
              <FlatList
                data={availableDates}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleDateSelect(item)}
                  >
                    <ThemedText>{item}</ThemedText>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <ThemedText style={styles.noDataText}>
                No dates available for this hall
              </ThemedText>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDateModalVisible(false)}
            >
              <ThemedText style={styles.closeButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>

      {selectedHall && selectedDate && screening && (
        <>
          <ThemedView style={styles.screeningInfo}>
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
              {selectedSeats.length > 0 && (
                <ThemedView style={styles.subtotalContainer}>
                  <ThemedText type="defaultSemiBold">
                    Subtotal: ${subtotal.toFixed(2)}
                  </ThemedText>
                  <ThemedText>
                    ${TICKET_PRICE.toFixed(2)} × {selectedSeats.length} tickets
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>

            <TouchableOpacity
              style={[
                styles.bookButton,
                (selectedSeats.length === 0 || !isConnected) &&
                  styles.disabledButton,
              ]}
              onPress={handleBooking}
              disabled={selectedSeats.length === 0 || !isConnected}
            >
              <ThemedText type="defaultSemiBold" style={styles.bookButtonText}>
                {isConnected
                  ? selectedSeats.length > 0
                    ? `Book Tickets ($${subtotal.toFixed(2)})`
                    : "Book Tickets"
                  : "Offline (Cannot Book)"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/")}
      >
        <ThemedText type="defaultSemiBold" style={styles.backButtonText}>
          Go Back
        </ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  subtotalContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  pickerSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  pickerButton: {
    padding: 16,
    backgroundColor: "#808080",
    borderRadius: 8,
    marginBottom: 12,
  },
  screeningInfo: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#808080",
    borderRadius: 12,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#EEE",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#333",
  },
  noDataText: {
    textAlign: "center",
    marginVertical: 20,
  },
  disabledButton: {
    opacity: 0.5,
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
    backgroundColor: "grey",
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
    marginBottom: 16,
  },
  bookButtonText: {
    color: "#FFF",
  },
  backButton: {
    backgroundColor: "#DDD",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#333",
  },
  errorText: {
    textAlign: "center",
    marginBottom: 16,
    padding: 16,
  },
  retryButton: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  retryButtonText: {
    color: "#FFF",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
