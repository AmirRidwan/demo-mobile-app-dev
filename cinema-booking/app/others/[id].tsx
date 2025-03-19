import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  Animated,
  View,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Booking, FnBItem } from "@/types";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import API_CONFIG from "@/utils/api";
import { othersStyles } from "@/app/styles";
import { commonStyles } from "@/app/styles/commonStyles";
import { BackButton } from "@/components/BackButton";

type TabType = "Combo" | "Food/Snacks" | "Beverages";

export default function othersScreen() {
  const { id } = useLocalSearchParams();
  const bookingId = typeof id === "string" ? id : 0;
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>(
    {}
  );
  const [fnbItems, setFnbItems] = useState<FnBItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("Combo");

  const networkStatus = useNetworkStatus();

  useEffect(() => {
    fetchFnBItems();
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

  const fetchFnBItems = async () => {
    try {
      const response = await fetch(
        API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.FNB_ITEMS
      );
      const data = await response.json();

      // Transform the data to match our UI needs
      const transformedData = data.map((item: any) => {
        // Map categories to match our tab types
        let category: TabType = "Food/Snacks";
        if (item.category === "combos") category = "Combo";
        else if (item.category === "drinks") category = "Beverages";

        return {
          ...item,
          category,
        };
      });

      setFnbItems(transformedData);
    } catch (error) {
      console.error("Error fetching fnb items:", error);
      setFnbItems([]);
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

  // Calculate total number of items
  const getTotalItemCount = () => {
    return Object.values(selectedItems).reduce(
      (sum, quantity) => sum + quantity,
      0
    );
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

  const handleSkip = async () => {
    setSelectedItems({});

    if (booking) {
      try {
        // Make sure to set fnbItems to empty array and fnbTotal to 0
        const updatedBooking = {
          ...booking,
          fnbItems: [],
          fnbTotal: 0,
          grandTotal: booking.subtotal || 0,
        };

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
        }

        router.push(`/payment/${bookingId}`);
      } catch (error) {
        console.error("Error updating booking when skipping:", error);
        Alert.alert("Error", "Failed to update booking information");
        router.push(`/payment/${bookingId}`);
      }
    } else {
      router.push(`/payment/${bookingId}`);
    }
  };

  const renderFnBItems = (category: TabType) => {
    const filteredItems = fnbItems.filter((item) => item.category === category);

    const pairs = [];
    for (let i = 0; i < filteredItems.length; i += 2) {
      pairs.push(filteredItems.slice(i, i + 2));
    }

    return (
      <ThemedView style={othersStyles.fnbGridContainer}>
        {pairs.map((pair, index) => (
          <ThemedView key={index} style={othersStyles.fnbRow}>
            {pair.map((item) => (
              <ThemedView key={item.id} style={othersStyles.fnbCardNew}>
                <ThemedView style={othersStyles.fnbImageContainer}>
                  {/* Placeholder for image */}
                  <ThemedView style={othersStyles.fnbImagePlaceholder} />
                </ThemedView>
                <ThemedText style={othersStyles.fnbItemName}>
                  {item.name}
                </ThemedText>
                <ThemedText style={othersStyles.fnbItemDescription}>
                  {item.description}
                </ThemedText>
                <ThemedView style={othersStyles.fnbPriceRow}>
                  <ThemedText style={othersStyles.fnbItemPrice}>
                    RM
                    {typeof item.price === "number"
                      ? item.price.toLocaleString()
                      : parseFloat(item.price).toLocaleString()}
                  </ThemedText>
                  <ThemedView style={othersStyles.quantityControlsNew}>
                    {selectedItems[item.id] ? (
                      <>
                        <TouchableOpacity
                          style={othersStyles.quantityButtonNew}
                          onPress={() => handleRemoveItem(item.id)}
                        >
                          <ThemedText style={othersStyles.quantityBtnTextNew}>
                            -
                          </ThemedText>
                        </TouchableOpacity>
                        <ThemedText style={othersStyles.quantityTextNew}>
                          {selectedItems[item.id]}
                        </ThemedText>
                        <TouchableOpacity
                          style={othersStyles.quantityButtonNew}
                          onPress={() => handleAddItem(item.id)}
                        >
                          <ThemedText style={othersStyles.quantityBtnTextNew}>
                            +
                          </ThemedText>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity
                        style={othersStyles.quantityButtonNew}
                        onPress={() => handleAddItem(item.id)}
                      >
                        <ThemedText style={othersStyles.quantityBtnTextNew}>
                          +
                        </ThemedText>
                      </TouchableOpacity>
                    )}
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            ))}
            {pair.length === 1 && <View style={othersStyles.emptyCard} />}
          </ThemedView>
        ))}
      </ThemedView>
    );
  };

  if (loading) {
    return (
      <ThemedView style={othersStyles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].tint}
        />
        <ThemedText style={{ marginTop: 10 }}>
          Loading booking information...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={othersStyles.containerNew}>
      {/* Fix for missing header */}
      <View
        style={{
          backgroundColor: "#000",
          width: "100%",
          paddingTop: 50, // Safe area for notch phones
          paddingBottom: 10,
          zIndex: 10, // Ensure it's above other elements
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
        >
          {/* Back button */}
          <TouchableOpacity
            style={{ padding: 8 }}
            onPress={() => {
              if (booking && booking.movie.id) {
                router.push(`/booking/${booking.movie.id}`);
              } else {
                router.back();
              }
            }}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>

          {/* Title */}
          <ThemedText
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Food & Beverage
          </ThemedText>

          {/* Skip button */}
          <TouchableOpacity style={{ padding: 8 }} onPress={handleSkip}>
            <ThemedText style={{ color: "white", fontSize: 15 }}>
              Skip
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation - Updated to match movie details screen */}
      <View style={othersStyles.tabContainerNew}>
        <TouchableOpacity
          style={[
            othersStyles.tabButtonNew,
            activeTab === "Combo" && othersStyles.activeTabNew,
          ]}
          onPress={() => setActiveTab("Combo")}
        >
          <ThemedText
            style={[
              othersStyles.tabTextNew,
              activeTab === "Combo" && othersStyles.activeTabTextNew,
            ]}
          >
            Combo
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            othersStyles.tabButtonNew,
            activeTab === "Food/Snacks" && othersStyles.activeTabNew,
          ]}
          onPress={() => setActiveTab("Food/Snacks")}
        >
          <ThemedText
            style={[
              othersStyles.tabTextNew,
              activeTab === "Food/Snacks" && othersStyles.activeTabTextNew,
            ]}
          >
            Food/Snacks
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            othersStyles.tabButtonNew,
            activeTab === "Beverages" && othersStyles.activeTabNew,
          ]}
          onPress={() => setActiveTab("Beverages")}
        >
          <ThemedText
            style={[
              othersStyles.tabTextNew,
              activeTab === "Beverages" && othersStyles.activeTabTextNew,
            ]}
          >
            Beverages
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={othersStyles.scrollViewNew}>
        {/* FnB Items */}
        {renderFnBItems(activeTab)}

        {/* Subtotal Section - Updated to show total item count */}
        <ThemedView style={othersStyles.seatSubtotalContainer}>
          <ThemedView style={othersStyles.itemsDisplayNew}>
            <ThemedText style={othersStyles.noItemsText}>ITEMS</ThemedText>
            <ThemedText style={othersStyles.subtotalAmountNew}>
              {getTotalItemCount()}
            </ThemedText>
          </ThemedView>

          <ThemedView style={othersStyles.subtotalDisplayNew}>
            <ThemedText style={othersStyles.subtotalTextNew}>
              SUB-TOTAL
            </ThemedText>
            <ThemedText style={othersStyles.subtotalAmountNew}>
              RM {calculateFnBTotal().toLocaleString()}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      {/* Confirm Button */}
      <ThemedView style={othersStyles.confirmButtonContainer}>
        <TouchableOpacity
          style={[
            othersStyles.confirmButton,
            Object.keys(selectedItems).length === 0 &&
              othersStyles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={Object.keys(selectedItems).length === 0}
        >
          <ThemedText style={othersStyles.confirmButtonText}>
            Confirm
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
