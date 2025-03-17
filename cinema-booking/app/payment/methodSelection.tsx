import React, { useState } from "react";
import { View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { Colors } from "@/constants/Colors";
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

    // Navigate to the appropriate transaction screen based on payment method
    router.push({
      pathname: "/payment/transaction",
      params: {
        id: bookingId,
        method: method,
      },
    });
  };

  return (
    <ThemedView style={paymentStyles.container}>
      <ThemedView style={paymentStyles.darkHeader}>
        <BackButton color="#fff" style={paymentStyles.backButtonOverlay} />
        <ThemedText style={paymentStyles.darkHeaderTitle}>Payment</ThemedText>
      </ThemedView>

      <ThemedView style={paymentStyles.paymentMethodsContainer}>
        <ThemedText style={paymentStyles.instructionText}>
          How would you like to make the payment? Kindly select your preferred
          option
        </ThemedText>

        {/* Payment options */}
        <TouchableOpacity
          style={paymentStyles.paymentOption}
          onPress={() => handleSelectPaymentMethod("debit")}
        >
          <View style={paymentStyles.paymentIconContainer}>
            <AntDesign name="creditcard" size={24} color="#fff" />
          </View>
          <View style={paymentStyles.paymentTextContainer}>
            <ThemedText style={paymentStyles.paymentOptionText}>
              Debit card
            </ThemedText>
            <ThemedText style={paymentStyles.paymentDescription}>
              Pay with <FontAwesome name="cc-visa" size={16} color="#fff" />
            </ThemedText>
          </View>
          <AntDesign name="right" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={paymentStyles.paymentOption}
          onPress={() => handleSelectPaymentMethod("bank")}
        >
          <View style={paymentStyles.paymentIconContainer}>
            <FontAwesome name="bank" size={20} color="#fff" />
          </View>
          <View style={paymentStyles.paymentTextContainer}>
            <ThemedText style={paymentStyles.paymentOptionText}>
              Bank Transfer
            </ThemedText>
            <ThemedText style={paymentStyles.paymentDescription}>
              Make a transfer from your bank account
            </ThemedText>
          </View>
          <AntDesign name="right" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={paymentStyles.paymentOption}
          onPress={() => handleSelectPaymentMethod("crypto")}
        >
          <View style={paymentStyles.paymentIconContainer}>
            <MaterialIcons
              name="account-balance-wallet"
              size={24}
              color="#fff"
            />
          </View>
          <View style={paymentStyles.paymentTextContainer}>
            <ThemedText style={paymentStyles.paymentOptionText}>
              Crypto wallets
            </ThemedText>
            <ThemedText style={paymentStyles.paymentDescription}>
              Pay from your cryptocurrency wallet
            </ThemedText>
          </View>
          <AntDesign name="right" size={20} color="#666" />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
