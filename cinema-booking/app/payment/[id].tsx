import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Booking } from "@/types";

export default function PaymentScreen() {
  const { id } = useLocalSearchParams();
  const bookingId = typeof id === "string" ? id : "";
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

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

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    router.push({
      pathname: "/payment/transaction",
      params: { method: selectedPaymentMethod, id: bookingId },
    });

    // Simulate payment processing
    // setTimeout(() => {
    //   setProcessing(false);

    //   // Show success message
    //   Alert.alert(
    //     "Payment Successful",
    //     "Your booking has been confirmed!",
    //     [
    //       {
    //         text: "View My Bookings",
    //         onPress: () => router.push("/(tabs)/bookings"),
    //       },
    //     ]
    //   );
    // }, 2000);
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

  if (!booking) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText>Booking not found</ThemedText>
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

  // Calculate the total amount
  const ticketTotal = booking.subtotal || 0;
  const fnbTotal = booking.fnbTotal || 0;
  const total = ticketTotal + fnbTotal;

  return (
    <ScrollView style={styles.container}>
      <ThemedText style={styles.header}>Payment</ThemedText>

      {/* Booking Summary */}
      <ThemedView style={styles.summaryContainer}>
        <ThemedText type="subtitle" style={styles.summaryTitle}>
          Booking Summary
        </ThemedText>

        <ThemedView style={styles.movieInfo}>
          <ThemedText style={styles.movieTitle}>
            {booking.movie.title}
          </ThemedText>
          <ThemedText>
            {booking.screening.hall} • {booking.screening.date}
          </ThemedText>
          <ThemedText>{booking.screening.time}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.detailsRow}>
          <ThemedText>Seats</ThemedText>
          <ThemedText>{booking.seats.join(", ")}</ThemedText>
        </ThemedView>

        {booking.fnbItems && booking.fnbItems.length > 0 && (
          <ThemedView style={styles.fnbContainer}>
            <ThemedText style={styles.fnbTitle}>Food & Beverages</ThemedText>
            {booking.fnbItems.map((item, index) => (
              <ThemedView key={index} style={styles.fnbItem}>
                <ThemedText>
                  {item.name} x{item.quantity}
                </ThemedText>
                <ThemedText>
                  ${(item.price * item.quantity).toFixed(2)}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        <ThemedView style={styles.priceBreakdown}>
          <ThemedView style={styles.priceRow}>
            <ThemedText>Tickets Subtotal</ThemedText>
            <ThemedText>${ticketTotal.toFixed(2)}</ThemedText>
          </ThemedView>

          {fnbTotal > 0 && (
            <ThemedView style={styles.priceRow}>
              <ThemedText>Food & Beverages</ThemedText>
              <ThemedText>${fnbTotal.toFixed(2)}</ThemedText>
            </ThemedView>
          )}

          <ThemedView style={styles.totalRow}>
            <ThemedText type="defaultSemiBold">Total</ThemedText>
            <ThemedText type="defaultSemiBold">${total.toFixed(2)}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Payment Methods */}
      <ThemedView style={styles.paymentMethodsContainer}>
        <ThemedText type="subtitle" style={styles.paymentTitle}>
          Select Payment Method
        </ThemedText>

        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPaymentMethod === "debit" && styles.selectedPayment,
          ]}
          onPress={() => setSelectedPaymentMethod("debit")}
        >
          <View style={styles.paymentIconContainer}>
            <Ionicons name="card-outline" size={24} color={Colors.light.tint} />
          </View>
          <View style={styles.paymentTextContainer}>
            <ThemedText style={styles.paymentOptionText}>Debit Card</ThemedText>
            <ThemedText style={styles.paymentDescription}>
              Pay directly with your debit card
            </ThemedText>
          </View>
          {selectedPaymentMethod === "debit" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={Colors.light.tint}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPaymentMethod === "bank" && styles.selectedPayment,
          ]}
          onPress={() => setSelectedPaymentMethod("bank")}
        >
          <View style={styles.paymentIconContainer}>
            <Ionicons
              name="business-outline"
              size={24}
              color={Colors.light.tint}
            />
          </View>
          <View style={styles.paymentTextContainer}>
            <ThemedText style={styles.paymentOptionText}>
              Bank Transfer
            </ThemedText>
            <ThemedText style={styles.paymentDescription}>
              Pay via direct bank transfer
            </ThemedText>
          </View>
          {selectedPaymentMethod === "bank" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={Colors.light.tint}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPaymentMethod === "crypto" && styles.selectedPayment,
          ]}
          onPress={() => setSelectedPaymentMethod("crypto")}
        >
          <View style={styles.paymentIconContainer}>
            <Ionicons name="logo-bitcoin" size={24} color={Colors.light.tint} />
          </View>
          <View style={styles.paymentTextContainer}>
            <ThemedText style={styles.paymentOptionText}>
              CryptoWallet
            </ThemedText>
            <ThemedText style={styles.paymentDescription}>
              Pay with cryptocurrency
            </ThemedText>
          </View>
          {selectedPaymentMethod === "crypto" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={Colors.light.tint}
            />
          )}
        </TouchableOpacity>
      </ThemedView>

      {/* Action Buttons */}
      <ThemedView style={styles.actions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={processing}
        >
          <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.payButton,
            (!selectedPaymentMethod || processing) && styles.disabledButton,
          ]}
          onPress={handlePayment}
          disabled={!selectedPaymentMethod || processing}
        >
          {processing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.payButtonText}>
              Pay ${total.toFixed(2)}
            </ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  summaryContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  summaryTitle: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  movieInfo: {
    marginBottom: 16,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  fnbContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  fnbTitle: {
    fontWeight: "600",
    marginBottom: 8,
  },
  fnbItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  priceBreakdown: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  paymentMethodsContainer: {
    marginBottom: 24,
  },
  paymentTitle: {
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "grey",
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e6f7ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  paymentTextContainer: {
    flex: 1,
  },
  selectedPayment: {
    borderColor: Colors.light.tint,
    backgroundColor: "#e6f7ff",
  },
  paymentOptionText: {
    fontWeight: "500",
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 12,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#ddd",
    alignItems: "center",
  },
  cancelButtonText: {
    fontWeight: "600",
  },
  payButton: {
    flex: 2,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.tint,
    alignItems: "center",
  },
  payButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
  backButton: {
    backgroundColor: "#DDD",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  backButtonText: {
    color: "#333",
  },
});
