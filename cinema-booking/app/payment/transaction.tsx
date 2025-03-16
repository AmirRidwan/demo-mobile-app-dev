import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  View,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Booking } from "@/types";
import { formatPaymentData, isPaymentDataValid, isValidCardNumber, isValidCVV, isValidExpirationDate } from "@/utils/paymentHelpers";

// Simple IBAN validation (very basic)
const validateIBAN = (iban: string) => iban.length >= 15;

// Simple crypto address validation (very basic)
const validateCryptoAddress = (address: string) => address.length >= 26;

export default function PaymentDetailsScreen() {
  const { method, id } = useLocalSearchParams();
  const bookingId = typeof id === "string" ? id : "";
  const paymentMethod = typeof method === "string" ? method : "debit";
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Credit Card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Bank Transfer state
  const [accountName, setAccountName] = useState("");
  const [iban, setIban] = useState("");
  const [bankName, setBankName] = useState("");

  // Crypto state
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [networkType, setNetworkType] = useState("ETH");

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
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    let isValid = false;
    let errorMessage = "";

    if (paymentMethod === "debit") {
      const paymentDetails = {
        cardNumber: cardNumber.replace(/\s+/g, ""),
        cvv,
        expirationDate: expiry,
        cardHolderName: cardName,
      };

      // Use the helper function to validate payment data
      if (!isPaymentDataValid(paymentDetails)) {
        if (
          !paymentDetails.cardNumber ||
          !isValidCardNumber(paymentDetails.cardNumber)
        ) {
          errorMessage = "Please enter a valid 16-digit card number";
        } else if (!cardName.trim()) {
          errorMessage = "Please enter the name on the card";
        } else if (
          !paymentDetails.expirationDate ||
          !isValidExpirationDate(paymentDetails.expirationDate)
        ) {
          errorMessage = "Please enter a valid expiry date (MM/YY)";
        } else if (!paymentDetails.cvv || !isValidCVV(paymentDetails.cvv)) {
          errorMessage = "Please enter a valid CVV code";
        }
      } else {
        isValid = true;
      }
    } else if (paymentMethod === "bank") {
      if (!accountName.trim()) {
        errorMessage = "Please enter account name";
      } else if (!validateIBAN(iban)) {
        errorMessage = "Please enter a valid IBAN";
      } else if (!bankName.trim()) {
        errorMessage = "Please enter bank name";
      } else {
        isValid = true;
      }
    } else if (paymentMethod === "crypto") {
      if (!validateCryptoAddress(cryptoAddress)) {
        errorMessage = "Please enter a valid crypto wallet address";
      } else {
        isValid = true;
      }
    }

    if (!isValid) {
      Alert.alert("Validation Error", errorMessage);
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      router.push({
        pathname: "/payment/success",
        params: { id: bookingId },
      });
    }, 2000);
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
      </ThemedView>
    );
  }

  // Calculate the total amount
  const ticketTotal = booking.subtotal || 0;
  const fnbTotal = booking.fnbTotal || 0;
  const total = ticketTotal + fnbTotal;

  // Get payment form based on selected method
  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "debit":
        return (
          <ThemedView style={styles.formContainer}>
            <ThemedText style={styles.formTitle}>Debit Card Payment</ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Card Number</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Name on Card</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={cardName}
                onChangeText={setCardName}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <ThemedText style={styles.inputLabel}>Expiry Date</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={expiry}
                  onChangeText={setExpiry}
                  maxLength={5}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={styles.inputLabel}>CVV</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </ThemedView>
        );

      case "bank":
        return (
          <ThemedView style={styles.formContainer}>
            <ThemedText style={styles.formTitle}>Bank Transfer</ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                Account Holder Name
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={accountName}
                onChangeText={setAccountName}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>IBAN</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="DE12 3456 7890 1234 5678 90"
                value={iban}
                onChangeText={setIban}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Bank Name</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Bank Name"
                value={bankName}
                onChangeText={setBankName}
              />
            </View>
          </ThemedView>
        );

      case "crypto":
        return (
          <ThemedView style={styles.formContainer}>
            <ThemedText style={styles.formTitle}>Crypto Payment</ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Network</ThemedText>
              <View style={styles.cryptoOptions}>
                {["ETH", "BTC", "SOL"].map((network) => (
                  <TouchableOpacity
                    key={network}
                    style={[
                      styles.cryptoOption,
                      networkType === network && styles.selectedCryptoOption,
                    ]}
                    onPress={() => setNetworkType(network)}
                  >
                    <ThemedText
                      style={
                        networkType === network ? styles.selectedCryptoText : {}
                      }
                    >
                      {network}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Wallet Address</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="0x1234..."
                value={cryptoAddress}
                onChangeText={setCryptoAddress}
              />
            </View>

            <ThemedView style={styles.noteContainer}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#666"
              />
              <ThemedText style={styles.noteText}>
                Please make sure you enter the correct wallet address.
                Transactions cannot be reversed.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Payment Details</ThemedText>
        <View style={{ width: 24 }} />
      </ThemedView>

      <ThemedView style={styles.amountContainer}>
        <ThemedText style={styles.amountLabel}>Payment Amount</ThemedText>
        <ThemedText style={styles.amount}>${total.toFixed(2)}</ThemedText>
      </ThemedView>

      {renderPaymentForm()}

      <ThemedView style={styles.actions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={processing}
        >
          <ThemedText style={styles.cancelButtonText}>Back</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.payButton, processing && styles.disabledButton]}
          onPress={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.payButtonText}>
              Complete Payment
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
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  amountContainer: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
  },
  formContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    color: "grey",
    padding: 12,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: "row",
  },
  cryptoOptions: {
    flexDirection: "row",
    marginBottom: 16,
  },
  cryptoOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCryptoOption: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  selectedCryptoText: {
    color: "#fff",
  },
  noteContainer: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  noteText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
    marginLeft: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "grey",
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
});
