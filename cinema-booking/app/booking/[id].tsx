import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  View,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, MaterialIcons, Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Movie, Screening, Seat, Booking } from "@/types";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import API_CONFIG from "@/utils/api";
import { bookingStyles } from "@/app/styles/bookingStyles";

// Define a type for formatted date
interface FormattedDate {
  dayName: string;
  dayNumber: number;
  month: string;
  fullDate: string;
}

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
  const [availableDates, setAvailableDates] = useState<FormattedDate[]>([]);
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [seatCache, setSeatCache] = useState<{ [key: string]: Seat[] }>({});
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Time slots state
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([
    "9:20AM",
    "11:40AM",
    "1:20PM",
    "3:30PM",
    "5:40PM",
    "7:30PM",
    "9:20PM",
  ]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Price range state
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null
  );
  const priceRanges = ["INR 1000 - INR 2000", "INR 1000 - INR 4500"];

  const colorScheme = useColorScheme();
  const router = useRouter();
  const { isConnected } = useNetworkStatus();

  const TICKET_PRICE = 10;

  const [locationDropdownVisible, setLocationDropdownVisible] = useState(false);
  const [cinemaDropdownVisible, setCinemaDropdownVisible] = useState(false);
  const [locationDropdownHeight] = useState(new Animated.Value(0));
  const [cinemaDropdownHeight] = useState(new Animated.Value(0));

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
    setSubtotal(0);
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

      // Mock dates for calendar view
      const currentDate = new Date();
      const mockDates: FormattedDate[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);
        mockDates.push(formatDate(date));
      }
      setAvailableDates(mockDates);

      setError(null);
    } catch (error) {
      console.error("Error fetching movie data:", error);
      setError("Could not load movie information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date): FormattedDate => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return {
      dayName: days[date.getDay()],
      dayNumber: date.getDate(),
      month: months[date.getMonth()],
      fullDate: `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`,
    };
  };

  const fetchSeats = async (movieId: number, hall: string, date: string) => {
    try {
      setLoadingSeats(true);

      const cacheKey = `${movieId}-${hall}-${date}`;
      if (seatCache[cacheKey]) {
        setSeats(seatCache[cacheKey]);
        setLoadingSeats(false);
        return;
      }

      if (!isConnected) {
        setLoadingSeats(false);
        setError("No internet connection. Cannot load seat information.");
        return;
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCREENINGS}/${movieId}/seats?hall=${selectedHall}&date=${selectedDate}`
      );

      if (!response.ok) {
        throw new Error(`Could not fetch seats (status ${response.status})`);
      }

      const seatsData = await response.json();

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

  const handleLocationSelect = (location: string) => {
    setSelectedSeats([]);
    setSelectedLocation(location);
    setSeats([]);
    setSubtotal(0);

    if (selectedHall && selectedDate && location && selectedTimeSlot) {
      fetchScreeningWithParams(movieId, selectedHall, location, selectedDate);
    }
  };

  const handleHallSelect = (hall: string) => {
    setSelectedSeats([]);
    setSelectedHall(hall);
    setSeats([]);
    setSubtotal(0);

    if (hall && selectedDate && selectedLocation && selectedTimeSlot) {
      fetchScreeningWithParams(movieId, hall, selectedLocation, selectedDate);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedSeats([]);
    setSelectedDate(date);
    setSubtotal(0);

    if (selectedHall && date && selectedLocation && selectedTimeSlot) {
      fetchScreeningWithParams(movieId, selectedHall, selectedLocation, date);
    }
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedSeats([]);
    setSubtotal(0);

    if (selectedHall && selectedDate && selectedLocation && timeSlot) {
      fetchScreeningWithParams(movieId, selectedHall, selectedLocation, selectedDate);
    }
  };

  const fetchScreeningWithParams = async (
    movieId: number,
    hall: string,
    location: string,
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
        location: selectedLocation ? selectedLocation : "",
        seats: selectedSeats,
        bookingTime: Date.now(),
        subtotal: subtotal,
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
    } catch (error) {
      console.error("Error saving booking:", error);
      Alert.alert("Error", "Something went wrong while booking");
    }
  };

  const updatedSeatsContainerStyle = {
    ...bookingStyles.seatsContainer,
    flexDirection: "column",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "",
    paddingVertical: 10,
  };

  const renderScreen = () => {
    return (
      <ThemedView style={bookingStyles.screenContainer}>
        <ThemedView style={bookingStyles.screen}>
          <ThemedText style={bookingStyles.screenText}>Screen</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  };

  const renderSeats = () => {
    if (loadingSeats) {
      return (
        <ThemedView style={bookingStyles.loadingContainer}>
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
        <ThemedView style={bookingStyles.emptyContainer}>
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
      <ThemedView key={row} style={bookingStyles.row}>
        <ThemedText style={bookingStyles.rowLabel}>{row}</ThemedText>
        <ThemedView style={bookingStyles.seatsRow}>
          {rows[row]
            .sort((a, b) => a.number - b.number)
            .map((seat) => {
              const isSelected = selectedSeats.includes(seat.id);
              const isBooked = seat.isBooked;

              return (
                <TouchableOpacity
                  key={seat.id}
                  style={[
                    bookingStyles.seat,
                    isBooked && bookingStyles.bookedSeat,
                    isSelected && bookingStyles.selectedSeat,
                  ]}
                  disabled={isBooked}
                  onPress={() => toggleSeatSelection(seat.id)}
                >
                  {isBooked ? (
                    <Feather name="x" size={12} color="#999" />
                  ) : (
                    <ThemedText
                      style={[
                        bookingStyles.seatNumber,
                        isSelected && bookingStyles.selectedSeatText,
                      ]}
                    >
                      {seat.number}
                    </ThemedText>
                  )}
                </TouchableOpacity>
              );
            })}
        </ThemedView>
        <ThemedText style={bookingStyles.rowLabel}>{row}</ThemedText>
      </ThemedView>
    ));
  };

  const toggleLocationDropdown = () => {
    setLocationDropdownVisible(!locationDropdownVisible);
    Animated.timing(locationDropdownHeight, {
      toValue: locationDropdownVisible ? 0 : 150,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Close the other dropdown if open
    if (!locationDropdownVisible && cinemaDropdownVisible) {
      setCinemaDropdownVisible(false);
      Animated.timing(cinemaDropdownHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const toggleCinemaDropdown = () => {
    setCinemaDropdownVisible(!cinemaDropdownVisible);
    Animated.timing(cinemaDropdownHeight, {
      toValue: cinemaDropdownVisible ? 0 : 150,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Close the other dropdown if open
    if (!cinemaDropdownVisible && locationDropdownVisible) {
      setLocationDropdownVisible(false);
      Animated.timing(locationDropdownHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  if (loading) {
    return (
      <ThemedView style={[bookingStyles.container, bookingStyles.centered]}>
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].tint}
        />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={[bookingStyles.container, bookingStyles.centered]}>
        <ThemedText style={bookingStyles.errorText}>{error}</ThemedText>
        <TouchableOpacity
          style={bookingStyles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText
            type="defaultSemiBold"
            style={bookingStyles.backButtonText}
          >
            Go Back
          </ThemedText>
        </TouchableOpacity>
        {isConnected && (
          <TouchableOpacity
            style={bookingStyles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              handleRetry();
            }}
          >
            <ThemedText
              type="defaultSemiBold"
              style={bookingStyles.retryButtonText}
            >
              Retry
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    );
  }

  if (!movie) {
    return (
      <ThemedView style={[bookingStyles.container, bookingStyles.centered]}>
        <ThemedText>Movie not found</ThemedText>
        <TouchableOpacity
          style={bookingStyles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText
            type="defaultSemiBold"
            style={bookingStyles.backButtonText}
          >
            Go Back
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Header with back button */}
      <ThemedView style={bookingStyles.darkHeader}>
        <TouchableOpacity
          style={bookingStyles.backButtonOverlay}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <AntDesign
            name="arrowleft"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
        <ThemedText type="title" style={bookingStyles.darkHeaderTitle}>
          Ticket Booking
        </ThemedText>
      </ThemedView>

      <ScrollView style={bookingStyles.darkContainer}>
        <ThemedText style={bookingStyles.darkInstructions}>
          Where would you like to see the movie? Kindly select as appropriate
        </ThemedText>

        {/* Price Range Selection */}
        <ThemedView style={bookingStyles.priceRangeContainer}>
          {priceRanges.map((range, index) => (
            <TouchableOpacity
              key={index}
              style={[
                bookingStyles.priceRangeCard,
                selectedPriceRange === range &&
                  bookingStyles.selectedPriceRange,
              ]}
              onPress={() => setSelectedPriceRange(range)}
            >
              <ThemedText style={bookingStyles.priceRangeTitle}>
                Tickets from
              </ThemedText>
              <ThemedText style={bookingStyles.priceRangeValue}>
                {range}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Location Selection */}
        <ThemedText style={bookingStyles.darkSectionTitle}>Location</ThemedText>
        <ThemedView style={[bookingStyles.dropdownContainer, { zIndex: 1002 }]}>
          <TouchableOpacity
            style={bookingStyles.lightDropdown}
            onPress={toggleLocationDropdown}
          >
            <ThemedText style={bookingStyles.lightDropdownText}>
              {selectedLocation && selectedLocation.length > 0
                ? selectedLocation
                : "Select Location"}
            </ThemedText>
            <MaterialIcons
              name={
                locationDropdownVisible
                  ? "keyboard-arrow-up"
                  : "keyboard-arrow-down"
              }
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>

          {locationDropdownVisible && (
            <Animated.View
              style={[
                bookingStyles.dropdownOptions,
                { height: locationDropdownHeight },
              ]}
            >
              <ScrollView nestedScrollEnabled={true}>
                {["Bandar Utama", "Kuala Lumpur", "CyberJaya"].map(
                  (location, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        bookingStyles.dropdownItem,
                        selectedLocation === location &&
                          bookingStyles.selectedDropdownItem,
                      ]}
                      onPress={() => {
                        handleLocationSelect(location);
                        toggleLocationDropdown();
                      }}
                    >
                      <ThemedText
                        style={[
                          bookingStyles.dropdownItemText,
                          selectedLocation === location &&
                            bookingStyles.selectedDropdownItemText,
                        ]}
                      >
                        {location}
                      </ThemedText>
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
            </Animated.View>
          )}
        </ThemedView>

        {/* Cinema Hall Selection */}
        <ThemedText style={bookingStyles.darkSectionTitle}>
          Cinema Location
        </ThemedText>
        <ThemedView style={[bookingStyles.dropdownContainer, { zIndex: 1001 }]}>
          <TouchableOpacity
            style={bookingStyles.lightDropdown}
            onPress={toggleCinemaDropdown}
          >
            <ThemedText style={bookingStyles.lightDropdownText}>
              {selectedHall ? `${selectedHall}` : "Select Cinema Hall"}
            </ThemedText>
            <MaterialIcons
              name={
                cinemaDropdownVisible
                  ? "keyboard-arrow-up"
                  : "keyboard-arrow-down"
              }
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>

          {cinemaDropdownVisible && (
            <Animated.View
              style={[
                bookingStyles.dropdownOptions,
                { height: cinemaDropdownHeight },
              ]}
            >
              <ScrollView nestedScrollEnabled={true}>
                {availableHalls.map((hall, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      bookingStyles.dropdownItem,
                      selectedHall === hall &&
                        bookingStyles.selectedDropdownItem,
                    ]}
                    onPress={() => {
                      handleHallSelect(hall);
                      toggleCinemaDropdown();
                    }}
                  >
                    <ThemedText
                      style={[
                        bookingStyles.dropdownItemText,
                        selectedHall === hall &&
                          bookingStyles.selectedDropdownItemText,
                      ]}
                    >
                      {hall}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          )}
        </ThemedView>

        {/* Date Selection */}
        <ThemedText style={bookingStyles.darkSectionTitle}>
          Select a date
        </ThemedText>
        <ThemedView style={bookingStyles.calendarHeader}>
          <ThemedText style={bookingStyles.monthIndicator}>
            •{" "}
            {availableDates.length > 0
              ? typeof availableDates[0] === "string"
                ? formatDate(new Date(availableDates[0])).month
                : availableDates[0].month
              : new Date().toLocaleString("default", { month: "long" })}{" "}
            •
          </ThemedText>
        </ThemedView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={bookingStyles.dateScrollView}
          contentContainerStyle={bookingStyles.dateScrollViewContent}
        >
          {availableDates.map((date, index) => {
            const formattedDate =
              typeof date === "string" ? formatDate(new Date(date)) : date;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  bookingStyles.dateCard,
                  selectedDate === formattedDate.fullDate &&
                    bookingStyles.selectedDateCard,
                ]}
                onPress={() => handleDateSelect(formattedDate.fullDate)}
              >
                <ThemedText style={bookingStyles.dayName}>
                  {formattedDate.dayName}
                </ThemedText>
                <ThemedText style={bookingStyles.dayNumber}>
                  {formattedDate.dayNumber}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Time Selection */}
        <ThemedView style={bookingStyles.timeContainer}>
          <ThemedText style={bookingStyles.darkSectionTitle}>
            Available Time
          </ThemedText>
          <ThemedView style={bookingStyles.timeGrid}>
            {availableTimeSlots.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  bookingStyles.timeCard,
                  selectedTimeSlot === time && bookingStyles.selectedTimeCard,
                ]}
                onPress={() => handleTimeSlotSelect(time)}
              >
                <ThemedText
                  style={[
                    bookingStyles.timeText,
                    selectedTimeSlot === time && bookingStyles.selectedTimeText,
                  ]}
                >
                  {time}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Seat Selection */}
        <ThemedView style={bookingStyles.seatSelectionContainer}>
          <ThemedText style={bookingStyles.darkSectionTitle}>
            Select Seat
          </ThemedText>

          <ThemedView style={bookingStyles.seatLegend}>
            <ThemedView style={bookingStyles.legendItemDark}>
              <ThemedView style={bookingStyles.availableSeatIndicator} />
              <ThemedText style={bookingStyles.legendTextDark}>
                Available
              </ThemedText>
            </ThemedView>
            <ThemedView style={bookingStyles.legendItemDark}>
              <ThemedView style={bookingStyles.unavailableSeatIndicator}>
                <Feather name="x" size={10} color="#999" />
              </ThemedView>
              <ThemedText style={bookingStyles.legendTextDark}>
                Unavailable
              </ThemedText>
            </ThemedView>
            <ThemedView style={bookingStyles.legendItemDark}>
              <ThemedView style={bookingStyles.selectedSeatIndicator} />
              <ThemedText style={bookingStyles.legendTextDark}>
                Selected
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Seat map with screen */}
          {loadingSeats ? (
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginVertical: 20 }}
            />
          ) : (
            <ThemedView style={bookingStyles.seatMapContainer}>
              {renderScreen()}
              <ScrollView
                horizontal={false}
                style={{ maxHeight: 300 }}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <ThemedView style={updatedSeatsContainerStyle}>
                  {renderSeats()}
                </ThemedView>
              </ScrollView>
            </ThemedView>
          )}

          {/* Seat and Subtotal display */}
          <ThemedView style={bookingStyles.seatSubtotalContainer}>
            <ThemedView style={bookingStyles.selectedSeatsDisplay}>
              {selectedSeats.length > 0 ? (
                selectedSeats.map((seatId, index) => {
                  // Extract row and number from seatId
                  const seatParts = seatId.split("-");
                  const rowLetter = seatParts[0]; // Row is the first part
                  const seatNumber = seatParts[1]; // Seat number is the second part

                  return (
                    <ThemedView
                      key={index}
                      style={bookingStyles.selectedSeatTag}
                    >
                      <ThemedText style={bookingStyles.selectedSeatTagText}>
                        {`${rowLetter}${seatNumber}`}
                      </ThemedText>
                    </ThemedView>
                  );
                })
              ) : (
                <ThemedText style={bookingStyles.noSeatsText}>SEAT</ThemedText>
              )}
            </ThemedView>
            <ThemedView style={bookingStyles.subtotalDisplay}>
              <ThemedText style={bookingStyles.subtotalText}>
                SUB-TOTAL
              </ThemedText>
              <ThemedText style={bookingStyles.subtotalAmount}>
                RM {subtotal.toLocaleString()}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Action Buttons */}
        <ThemedView style={bookingStyles.actionButtonsContainer}>
          <TouchableOpacity
            style={bookingStyles.lightCancelButton}
            onPress={() => router.back()}
          >
            <ThemedText style={bookingStyles.lightCancelButtonText}>
              Cancel
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              bookingStyles.proceedButton,
              (!selectedTimeSlot || selectedSeats.length === 0) &&
                bookingStyles.disabledProceedButton,
            ]}
            onPress={handleBooking}
            disabled={!selectedTimeSlot || selectedSeats.length === 0}
          >
            <ThemedText style={bookingStyles.proceedButtonText}>
              Proceed
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
