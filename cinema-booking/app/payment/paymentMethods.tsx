import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { paymentStyles } from "@/app/styles/paymentStyles";

interface PaymentMethodsProps {
  selectedPaymentMethod: string | null;
  onSelectPaymentMethod: (method: string) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedPaymentMethod,
  onSelectPaymentMethod,
}) => {
  const paymentOptions = [
    {
      id: "debit",
      name: "Debit Card",
      description: "Pay directly with your debit card",
      icon: "card-outline",
    },
    {
      id: "bank",
      name: "Bank Transfer",
      description: "Pay via direct bank transfer",
      icon: "business-outline",
    },
    {
      id: "crypto",
      name: "CryptoWallet",
      description: "Pay with cryptocurrency",
      icon: "logo-bitcoin",
    },
  ];

  return (
    <View style={paymentStyles.paymentMethodsContainer}>
      <ThemedText type="subtitle" style={paymentStyles.paymentTitle}>
        Select Payment Method
      </ThemedText>

      {paymentOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            paymentStyles.paymentOption,
            selectedPaymentMethod === option.id &&
              paymentStyles.selectedPayment,
          ]}
          onPress={() => onSelectPaymentMethod(option.id)}
        >
          <View style={paymentStyles.paymentIconContainer}>
            <Ionicons
              name={option.icon as any}
              size={24}
              color={Colors.light.tint}
            />
          </View>
          <View style={paymentStyles.paymentTextContainer}>
            <ThemedText style={paymentStyles.paymentOptionText}>
              {option.name}
            </ThemedText>
            <ThemedText style={paymentStyles.paymentDescription}>
              {option.description}
            </ThemedText>
          </View>
          {selectedPaymentMethod === option.id && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={Colors.light.tint}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};
