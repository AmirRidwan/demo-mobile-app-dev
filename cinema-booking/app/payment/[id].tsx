import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  View,
  Image,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Booking } from "@/types";
import { paymentStyles } from "@/app/styles/paymentStyles";

export default function PaymentScreen() {
  const { id } = useLocalSearchParams();
  const bookingId = typeof id === "string" ? id : "";
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");

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
        } else {
          Alert.alert("Error", "Booking not found");
          router.back();
        }
      }
    } catch (error) {
      console.error("Error loading booking:", error);
      Alert.alert("Error", "Failed to load booking information");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    try {
      setProcessing(true);
      // Save booking data with updated totals
      if (booking) {
        const updatedBooking = {
          ...booking,
          serviceCharge: serviceCharge,
          grandTotal: total,
        };

        // Save updated booking to AsyncStorage
        const bookingsJson = await AsyncStorage.getItem("bookings");
        if (bookingsJson) {
          const bookings: Booking[] = JSON.parse(bookingsJson);
          const updatedBookings = bookings.map((b) =>
            b.id === bookingId ? updatedBooking : b
          );
          await AsyncStorage.setItem(
            "bookings",
            JSON.stringify(updatedBookings)
          );
          setBooking(updatedBooking); // Update local state
        }
      }

      // Navigate to payment method selection screen
      router.push({
        pathname: "/payment/methodSelection",
        params: { id: bookingId },
      });
    } catch (error) {
      console.error("Error proceeding to payment:", error);
      Alert.alert("Error", "Failed to proceed to payment");
    } finally {
      setProcessing(false);
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
          style={paymentStyles.proceedButton}
          onPress={() => router.back()}
        >
          <ThemedText style={paymentStyles.proceedButtonText}>
            Go Back
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const ticketTotal = booking.subtotal || 0;
  const fnbTotal =
    booking.fnbItems?.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ) || 0;
  const serviceCharge = 50;
  const total = ticketTotal + fnbTotal + serviceCharge;

  return (
    <ThemedView style={paymentStyles.container}>
      <ThemedView style={paymentStyles.darkHeader}>
        <TouchableOpacity
          style={paymentStyles.backButtonOverlay}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={paymentStyles.darkHeaderTitle}>
          Booking Summary
        </ThemedText>
      </ThemedView>

      <ScrollView>
        <ThemedView style={paymentStyles.summaryContainer}>
          <ThemedView style={paymentStyles.ticketContainer}>
            {/* Movie Info Section */}
            <ThemedView style={paymentStyles.movieInfoContainer}>
              <ThemedView style={paymentStyles.posterContainer}>
                {booking.movie.posterUrl && (
                  <Image
                    source={{ uri: booking.movie.posterUrl }}
                    style={paymentStyles.posterImage}
                    resizeMode="cover"
                  />
                )}
              </ThemedView>
              <ThemedView style={paymentStyles.movieInfo}>
                <ThemedText style={paymentStyles.movieTitle}>
                  {booking.movie.title}
                </ThemedText>
                <ThemedView style={paymentStyles.movieDetailsGrid}>
                  <ThemedView style={paymentStyles.movieDetailItem}>
                    <ThemedText style={paymentStyles.movieGenre}>
                      {booking.movie.genre}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={paymentStyles.movieDetailItem}>
                    <ThemedText style={paymentStyles.movieDuration}>
                      {booking.movie.duration}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={paymentStyles.movieDetailItem}>
                    <ThemedText style={paymentStyles.movieLanguage}>
                      English, IMDb 3D
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={paymentStyles.movieDetailItem}>
                    <ThemedText style={paymentStyles.ticketType}>
                      Classic Tickets
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {/* Dashed Line */}
            <ThemedView style={paymentStyles.dashedLineContainer}>
              <ThemedView
                style={[paymentStyles.circleCut, paymentStyles.leftCircle]}
              />
              <ThemedView style={paymentStyles.dashedLine} />
              <ThemedView
                style={[paymentStyles.circleCut, paymentStyles.rightCircle]}
              />
            </ThemedView>

            {/* Screening Info Section */}
            <ThemedView style={paymentStyles.screeningInfoContainer}>
              <ThemedView style={paymentStyles.cinemaContainer}>
                <ThemedText style={paymentStyles.cinemaLabel}>
                  Cinema
                </ThemedText>
                <ThemedText style={paymentStyles.cinemaValue}>
                  {booking.location} : {booking.screening.hall}
                </ThemedText>
              </ThemedView>
              <ThemedView style={paymentStyles.screeningInfoGrid}>
                <ThemedView style={paymentStyles.gridItem}>
                  <ThemedText style={paymentStyles.infoLabel}>Date</ThemedText>
                  <ThemedText style={paymentStyles.infoValue}>
                    {booking.screening.date}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={paymentStyles.gridItem}>
                  <ThemedText style={paymentStyles.infoLabel}>Seat</ThemedText>
                  <ThemedText style={paymentStyles.infoValue}>
                    {booking.seats.join(", ")}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={paymentStyles.gridItem}>
                  <ThemedText style={paymentStyles.infoLabel}>Start</ThemedText>
                  <ThemedText style={paymentStyles.infoValue}>
                    {booking.screening.time}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={paymentStyles.gridItem}>
                  <ThemedText style={paymentStyles.infoLabel}>End</ThemedText>
                  <ThemedText style={paymentStyles.infoValue}>
                    {booking.movie.duration
                      ? calculateEndTime(
                          booking.screening.time,
                          booking.movie.duration
                        )
                      : "0"}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={paymentStyles.gap}></ThemedView>

          {/* Tickets Section */}
          <ThemedView style={paymentStyles.paymentContainer}>
            <ThemedView style={paymentStyles.ticketsContainer}>
              <ThemedText style={paymentStyles.sectionTitle}>
                Tickets
              </ThemedText>
              <ThemedView style={paymentStyles.ticketRow}>
                <ThemedText style={paymentStyles.ticketLabel}>
                  Classic tickets ({booking.seats.length || 2})
                </ThemedText>
                <ThemedText style={paymentStyles.ticketPrice}>
                  RM {ticketTotal.toFixed(0)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView style={paymentStyles.fnbContainer}>
              <ThemedText style={paymentStyles.sectionTitle}>
                Food & Beverage
              </ThemedText>
              <ThemedView style={paymentStyles.fnbRow}>
                <ThemedText style={paymentStyles.fnbLabel}>
                  Fresh XL Combo [x2]
                </ThemedText>
                <ThemedText style={paymentStyles.fnbPrice}>
                  RM {fnbTotal.toFixed(0)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView style={paymentStyles.chargesContainer}>
              <ThemedText style={paymentStyles.sectionTitle}>
                Charges
              </ThemedText>
              <ThemedView style={paymentStyles.ticketRow}>
                <ThemedText style={paymentStyles.ticketLabel}>
                  Service charge
                </ThemedText>
                <ThemedText style={paymentStyles.ticketPrice}>
                  RM {serviceCharge.toFixed(0)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView style={paymentStyles.promoContainer}>
              <ThemedText style={paymentStyles.promoLabel}>
                Promo Code
              </ThemedText>
              <TextInput
                style={paymentStyles.promoInput}
                value={promoCode}
                onChangeText={setPromoCode}
                placeholder="Enter code"
                placeholderTextColor="#666"
              />
            </ThemedView>
            <ThemedView style={paymentStyles.totalContainer}>
              <ThemedText style={paymentStyles.totalLabel}>
                Total Amount Payable
              </ThemedText>
              <ThemedText style={paymentStyles.totalPrice}>
                RM {total.toFixed(0)}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Proceed to Payment Button */}
        <TouchableOpacity
          style={[
            paymentStyles.proceedButton,
            paymentStyles.activeButton,
            processing && paymentStyles.disabledButton,
          ]}
          onPress={handleProceedToPayment}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <ThemedText style={paymentStyles.proceedButtonText}>
              Proceed to payment
            </ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

// Helper function to calculate end time in 24-hour format
function calculateEndTime(startTime: string, duration: string): string {
  try {
    const durationMatch = duration.match(/(\d+)h\s*(\d+)m/);
    if (!durationMatch) return "Unknown";

    const hours = parseInt(durationMatch[1]);
    const minutes = parseInt(durationMatch[2]);

    const timeMatch12Hour = startTime.match(/(\d+):(\d+)([AP]M)/);
    const timeMatch24Hour = startTime.match(/(\d+):(\d+)/);

    let startHour, startMinute;

    if (timeMatch12Hour) {
      startHour = parseInt(timeMatch12Hour[1]);
      startMinute = parseInt(timeMatch12Hour[2]);
      const period = timeMatch12Hour[3];

      if (period === "PM" && startHour < 12) {
        startHour += 12;
      } else if (period === "AM" && startHour === 12) {
        startHour = 0;
      }
    } else if (timeMatch24Hour) {
      startHour = parseInt(timeMatch24Hour[1]);
      startMinute = parseInt(timeMatch24Hour[2]);
    } else {
      return "Unknown";
    }

    // Calculate end time
    let endHour = startHour + hours;
    let endMinute = startMinute + minutes;

    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute %= 60;
    }

    // Format output as 24-hour time
    endHour = endHour % 24; // Handle day wrap-around
    return `${endHour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")}`;
  } catch (error) {
    console.error("Error calculating end time:", error);
    return "Unknown";
  }
}
