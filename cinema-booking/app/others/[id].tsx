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
import { Booking, FnBItem } from "@/types";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import API_CONFIG from "@/utils/api";

export default function othersScreen() {
  const { id } = useLocalSearchParams();
  const bookingId = typeof id === "string" ? id : 0;
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({});
  const [fnbItems, setFnbItems] = useState<FnBItem[]>([]);
  const [loading, setLoading] = useState(true);

  const networkStatus = useNetworkStatus();

  useEffect(() => {
    fetchFnBItems();
    loadBooking();
  }, []);

  const loadBooking = async () => {
    try {
      const bookingsJson = await AsyncStorage.getItem('bookings');
      if (bookingsJson) {
        const bookings: Booking[] = JSON.parse(bookingsJson);
        const currentBooking = bookings.find(b => b.id === bookingId);
        if (currentBooking) {
          setBooking(currentBooking);
        } else {
          Alert.alert("Error", "Booking not found");
          router.back();
        }
      }
    } catch (error) {
      console.error('Error loading booking:', error);
      Alert.alert("Error", "Failed to load booking information");
    } finally {
      setLoading(false);
    }
  };

  const fetchFnBItems = async () => {
    try {
      const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.FNB_ITEMS);
      const data = await response.json();
      setFnbItems(data);
    } catch (error) {
      console.error("Error fetching fnb items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const currentCount = prev[itemId] || 0;
      return { ...prev, [itemId]: currentCount + 1 };
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const currentCount = prev[itemId] || 0;
      if (currentCount <= 1) {
        const newItems = { ...prev };
        delete newItems[itemId];
        return newItems;
      } else {
        return { ...prev, [itemId]: currentCount - 1 };
      }
    });
  };

  const calculateFnBTotal = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = fnbItems.find((i) => i.id === itemId);
      return total + (item?.price || 0) * quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const ticketTotal = booking?.subtotal || 0;
    const fnbTotal = calculateFnBTotal();
    return ticketTotal + fnbTotal;
  };

  const handleConfirm = async () => {
    if (!booking) {
      Alert.alert("Error", "Booking information not available");
      return;
    }

    try {
      // Add FnB items to the booking
      const selectedFnBItems = Object.entries(selectedItems).map(
        ([itemId, quantity]) => {
          const item = fnbItems.find((i) => i.id === itemId);
          return {
            id: itemId,
            name: item?.name || "",
            price: item?.price || 0,
            quantity,
          };
        }
      );

      // Update the booking with FnB items
      const updatedBooking = {
        ...booking,
        fnbItems: selectedFnBItems,
        fnbTotal: calculateFnBTotal(),
        grandTotal: calculateTotal(),
      };

      // Update in AsyncStorage
      const bookingsJson = await AsyncStorage.getItem("bookings");
      if (bookingsJson) {
        const bookings: Booking[] = JSON.parse(bookingsJson);
        const updatedBookings = bookings.map((b) =>
          b.id === bookingId ? updatedBooking : b
        );
        await AsyncStorage.setItem("bookings", JSON.stringify(updatedBookings));
      }

      // Navigate to confirmation/payment screen
      router.push(`/payment/${bookingId}`);
    } catch (error) {
      console.error("Error updating booking with FnB:", error);
      Alert.alert("Error", "Failed to update booking information");
    }
  };

  const handleSkip = () => {
    router.push(`/payment/${bookingId}`);
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading booking information...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedText style={styles.header}>Food & Beverages</ThemedText>

      {/* Booking Summary */}
      {booking && (
        <ThemedView style={styles.bookingSummary}>
          <ThemedText style={styles.movieTitle}>
            {booking.movie.title}
          </ThemedText>
          <ThemedText>
            {booking.screening.hall} •{" "}
            {new Date(booking.screening.date).toLocaleDateString()}
          </ThemedText>
          <ThemedText>
            {booking.seats.length}{" "}
            {booking.seats.length === 1 ? "Seat" : "Seats"}:{" "}
            {booking.seats.join(", ")}
          </ThemedText>
          <ThemedText style={styles.subtotalText}>
            Ticket Subtotal: ${booking.subtotal.toFixed(2) || "0.00"}
          </ThemedText>
        </ThemedView>
      )}

      {/* FnB Categories */}
      <ThemedText style={styles.sectionTitle}>Snacks</ThemedText>
      <ThemedView style={styles.fnbList}>
        {fnbItems
          .filter((item) => item.category === "snacks")
          .map((item) => (
            <ThemedView key={item.id} style={styles.fnbItem}>
              <ThemedView style={styles.itemDetails}>
                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                <ThemedText>${item.price.toFixed(2)}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.quantityControls}>
                {selectedItems[item.id] ? (
                  <>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleRemoveItem(item.id)}
                    >
                      <ThemedText style={styles.quantityBtnText}>-</ThemedText>
                    </TouchableOpacity>
                    <ThemedText style={styles.quantityText}>
                      {selectedItems[item.id]}
                    </ThemedText>
                  </>
                ) : null}
                <TouchableOpacity
                  style={[styles.quantityButton, styles.addButton]}
                  onPress={() => handleAddItem(item.id)}
                >
                  <ThemedText style={styles.quantityBtnText}>+</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          ))}
      </ThemedView>

      <ThemedText style={styles.sectionTitle}>Drinks</ThemedText>
      <ThemedView style={styles.fnbList}>
        {fnbItems
          .filter((item) => item.category === "drinks")
          .map((item) => (
            <ThemedView key={item.id} style={styles.fnbItem}>
              <ThemedView style={styles.itemDetails}>
                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                <ThemedText>${item.price.toFixed(2)}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.quantityControls}>
                {selectedItems[item.id] ? (
                  <>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleRemoveItem(item.id)}
                    >
                      <ThemedText style={styles.quantityBtnText}>-</ThemedText>
                    </TouchableOpacity>
                    <ThemedText style={styles.quantityText}>
                      {selectedItems[item.id]}
                    </ThemedText>
                  </>
                ) : null}
                <TouchableOpacity
                  style={[styles.quantityButton, styles.addButton]}
                  onPress={() => handleAddItem(item.id)}
                >
                  <ThemedText style={styles.quantityBtnText}>+</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          ))}
      </ThemedView>

      {/* Order Summary */}
      <ThemedView style={styles.orderSummary}>
        <ThemedText style={styles.summaryTitle}>Order Summary</ThemedText>
        <ThemedView style={styles.summaryRow}>
          <ThemedText>Tickets Subtotal</ThemedText>
          <ThemedText>
            ${booking?.subtotal.toFixed(2) || "0.00"}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.summaryRow}>
          <ThemedText>Food & Beverages</ThemedText>
          <ThemedText>${calculateFnBTotal().toFixed(2)}</ThemedText>
        </ThemedView>
        <ThemedView style={[styles.summaryRow, styles.totalRow]}>
          <ThemedText style={styles.totalLabel}>Total</ThemedText>
          <ThemedText style={styles.totalAmount}>
            ${calculateTotal().toFixed(2)}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Action Buttons */}
      <ThemedView style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.skipButton]}
          onPress={handleSkip}
        >
          <ThemedText style={styles.skipButtonText}>Skip</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={handleConfirm}
        >
          <ThemedText style={styles.confirmButtonText}>
            Continue to Payment
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bookingSummary: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtotalText: {
    marginTop: 8,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 12,
  },
  fnbList: {
    marginBottom: 16,
  },
  fnbItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: Colors.light.tint,
  },
  quantityBtnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  orderSummary: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.tint,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  skipButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "grey",
  },
  skipButtonText: {
    fontWeight: "600",
  },
  confirmButton: {
    flex: 2,
    backgroundColor: Colors.light.tint,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
