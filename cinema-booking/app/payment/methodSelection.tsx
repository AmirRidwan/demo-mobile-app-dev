import React, { useState } from "react";
import { View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { PaymentMethods } from "./paymentMethods";
import { paymentStyles } from "@/app/styles/paymentStyles";

export default function PaymentMethodSelectionScreen() {
  const { id } = useLocalSearchParams();
  const bookingId = typeof id === "string" ? id : "";
  const router = useRouter();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [processing, setProcessing] = useState(false);

  const handleSelectPaymentMethod = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleProceedToTransaction = async () => {
    try {
      if (!selectedPaymentMethod) {
        Alert.alert("Error", "Please select a payment method");
        return;
      }

      setProcessing(true);

      // In a real app, you might save the selected payment method to the booking
      // For demo purposes, we'll just navigate to a transaction screen
      router.push({
        pathname: "/payment/transaction",
        params: {
          id: bookingId,
          method: selectedPaymentMethod,
        },
      });
    } catch (error) {
      console.error("Error proceeding to transaction:", error);
      Alert.alert("Error", "Failed to proceed with payment");
    } finally {
      setProcessing(false);
    }
  };

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
          Select Payment Method
        </ThemedText>
      </ThemedView>

      <PaymentMethods
        selectedPaymentMethod={selectedPaymentMethod}
        onSelectPaymentMethod={handleSelectPaymentMethod}
      />

      <TouchableOpacity
        style={[
          paymentStyles.proceedButton,
          selectedPaymentMethod ? paymentStyles.activeButton : {},
          processing && paymentStyles.disabledButton,
        ]}
        onPress={handleProceedToTransaction}
        disabled={!selectedPaymentMethod || processing}
      >
        {processing ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <ThemedText style={paymentStyles.proceedButtonText}>
            Proceed with{" "}
            {selectedPaymentMethod
              ? selectedPaymentMethod.charAt(0).toUpperCase() +
                selectedPaymentMethod.slice(1)
              : "Payment"}
          </ThemedText>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
}
