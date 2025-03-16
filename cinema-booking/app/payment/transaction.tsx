import React, { useState, useEffect } from "react";
import {
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
import { paymentStyles } from "@/app/styles/paymentStyles";
import {
  formatPaymentData,
  isPaymentDataValid,
  isValidCardNumber,
  isValidCVV,
  isValidExpirationDate,
} from "@/utils/paymentHelpers";

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
      </ThemedView>
    );
  }

  const grandTotal = booking?.grandTotal ?? 0;

  // Get payment form based on selected method
  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "debit":
        return (
          <ThemedView style={paymentStyles.formContainer}>
            <ThemedText style={paymentStyles.formTitle}>
              Debit Card Payment
            </ThemedText>

            <View style={paymentStyles.inputGroup}>
              <ThemedText style={paymentStyles.inputLabel}>
                Card Number
              </ThemedText>
              <TextInput
                style={paymentStyles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#666"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={paymentStyles.inputGroup}>
              <ThemedText style={paymentStyles.inputLabel}>
                Name on Card
              </ThemedText>
              <TextInput
                style={paymentStyles.input}
                placeholder="John Doe"
                placeholderTextColor="#666"
                value={cardName}
                onChangeText={setCardName}
              />
            </View>

            <View style={paymentStyles.inputRow}>
              <View
                style={[paymentStyles.inputGroup, { flex: 1, marginRight: 10 }]}
              >
                <ThemedText style={paymentStyles.inputLabel}>
                  Expiry Date
                </ThemedText>
                <TextInput
                  style={paymentStyles.input}
                  placeholder="MM/YY"
                  placeholderTextColor="#666"
                  value={expiry}
                  onChangeText={setExpiry}
                  maxLength={5}
                />
              </View>

              <View style={[paymentStyles.inputGroup, { flex: 1 }]}>
                <ThemedText style={paymentStyles.inputLabel}>CVV</ThemedText>
                <TextInput
                  style={paymentStyles.input}
                  placeholder="123"
                  placeholderTextColor="#666"
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
          <ThemedView style={paymentStyles.formContainer}>
            <ThemedText style={paymentStyles.formTitle}>
              Bank Transfer
            </ThemedText>

            <View style={paymentStyles.inputGroup}>
              <ThemedText style={paymentStyles.inputLabel}>
                Account Holder Name
              </ThemedText>
              <TextInput
                style={paymentStyles.input}
                placeholder="John Doe"
                placeholderTextColor="#666"
                value={accountName}
                onChangeText={setAccountName}
              />
            </View>

            <View style={paymentStyles.inputGroup}>
              <ThemedText style={paymentStyles.inputLabel}>IBAN</ThemedText>
              <TextInput
                style={paymentStyles.input}
                placeholder="DE12 3456 7890 1234 5678 90"
                placeholderTextColor="#666"
                value={iban}
                onChangeText={setIban}
              />
            </View>

            <View style={paymentStyles.inputGroup}>
              <ThemedText style={paymentStyles.inputLabel}>
                Bank Name
              </ThemedText>
              <TextInput
                style={paymentStyles.input}
                placeholder="Bank Name"
                placeholderTextColor="#666"
                value={bankName}
                onChangeText={setBankName}
              />
            </View>
          </ThemedView>
        );

      case "crypto":
        return (
          <ThemedView style={paymentStyles.formContainer}>
            <ThemedText style={paymentStyles.formTitle}>
              Crypto Payment
            </ThemedText>

            <View style={paymentStyles.inputGroup}>
              <ThemedText style={paymentStyles.inputLabel}>Network</ThemedText>
              <View style={paymentStyles.cryptoOptions}>
                {["ETH", "BTC", "SOL"].map((network) => (
                  <TouchableOpacity
                    key={network}
                    style={[
                      paymentStyles.cryptoOption,
                      networkType === network &&
                        paymentStyles.selectedCryptoOption,
                    ]}
                    onPress={() => setNetworkType(network)}
                  >
                    <ThemedText
                      style={
                        networkType === network
                          ? paymentStyles.selectedCryptoText
                          : {}
                      }
                    >
                      {network}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={paymentStyles.inputGroup}>
              <ThemedText style={paymentStyles.inputLabel}>
                Wallet Address
              </ThemedText>
              <TextInput
                style={paymentStyles.input}
                placeholder="0x1234..."
                placeholderTextColor="#666"
                value={cryptoAddress}
                onChangeText={setCryptoAddress}
              />
            </View>

            <ThemedView style={paymentStyles.noteContainer}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#666"
              />
              <ThemedText style={paymentStyles.noteText}>
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
    <ScrollView style={paymentStyles.transactionContainer}>
      <ThemedView style={paymentStyles.transactionHeader}>
        <TouchableOpacity
          style={paymentStyles.backButtonTransaction}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
        <ThemedText style={paymentStyles.headerTitle}>
          Payment Details
        </ThemedText>
        <View style={{ width: 24 }} />
      </ThemedView>

      <ThemedView style={paymentStyles.amountContainer}>
        <ThemedText style={paymentStyles.amountLabel}>
          Payment Amount
        </ThemedText>
        <ThemedText style={paymentStyles.amount}>
          RM {grandTotal.toFixed(0)}
        </ThemedText>
      </ThemedView>

      {renderPaymentForm()}

      <ThemedView style={paymentStyles.actions}>
        <TouchableOpacity
          style={paymentStyles.cancelButton}
          onPress={() => router.back()}
          disabled={processing}
        >
          <ThemedText style={paymentStyles.cancelButtonText}>Back</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            paymentStyles.payButton,
            processing && paymentStyles.disabledButton,
          ]}
          onPress={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <ThemedText style={paymentStyles.payButtonText}>
              Complete Payment
            </ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}
