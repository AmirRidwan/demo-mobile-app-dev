import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const paymentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  darkHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  darkHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  backButtonOverlay: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 16,
  },
  summaryContainer: {
    backgroundColor: "#121212",
    margin: 16,
    overflow: "hidden",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    paddingVertical: 12,
  },
  movieInfoContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 0,
  },
  posterContainer: {
    width: 100,
    height: 150,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: "#333", // Placeholder color for missing poster
  },
  posterImage: {
    width: "100%",
    height: "100%",
  },
  movieInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  movieDetailsGrid: {
    flexDirection: "column",
  },
  movieDetailItem: {
    marginBottom: 4,
  },
  movieGenre: {
    fontSize: 14,
    color: "#aaa",
  },
  movieDuration: {
    fontSize: 14,
    color: "#aaa",
  },
  movieLanguage: {
    fontSize: 14,
    color: "#aaa",
  },
  ticketType: {
    fontSize: 14,
    color: "#aaa",
  },
  ticketContainer: {
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#121212",
    overflow: "hidden",
    marginBottom: 0,
  },
  dashedLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 0,
    position: "relative",
    height: 1,
  },
  dashedLine: {
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#444",
    flex: 1,
    marginHorizontal: 20,
  },
  circleCut: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#000",
    position: "absolute",
    top: -10,
  },
  leftCircle: {
    left: -10,
  },
  rightCircle: {
    right: -10,
  },
  screeningInfoContainer: {
    padding: 16,
    borderBottomWidth: 0,
  },
  cinemaContainer: {
    marginBottom: 16,
  },
  cinemaLabel: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 4,
  },
  cinemaValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  screeningInfoGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "33%", // Changed to 3 items in a row as per screenshot
    backgroundColor: "transparent", // Remove background color
    padding: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  ticketsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  ticketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  ticketLabel: {
    fontSize: 14,
    color: "#aaa",
  },
  ticketPrice: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  gap: {
    padding: 10,
  },
  paymentContainer: {
    borderWidth: 1,
    borderColor: "#333",
  },
  fnbContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  fnbRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  fnbLabel: {
    fontSize: 14,
    color: "#aaa",
  },
  fnbPrice: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  chargesContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  promoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  promoLabel: {
    fontSize: 14,
    color: "#aaa",
  },
  promoInput: {
    backgroundColor: "#333",
    borderRadius: 4,
    padding: 8,
    width: 150,
    color: "#fff",
  },
  totalContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  proceedButton: {
    backgroundColor: "grey",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
  },
  proceedButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  activeButton: {
    backgroundColor: "grey", // Consistent blue color
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  paymentMethodsContainer: {
    padding: 16,
    flex: 1,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  selectedPayment: {
    borderColor: Colors.light.tint,
    borderWidth: 2,
  },
  paymentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(66, 133, 244, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  paymentTextContainer: {
    flex: 1,
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: "#aaa",
  },
  // Transaction form styles
  transactionContainer: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButtonTransaction: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  amountContainer: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
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
    borderColor: "#333",
    borderRadius: 8,
    color: "#ccc",
    padding: 12,
    fontSize: 16,
    backgroundColor: "#1a1a1a",
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
    borderColor: "#333",
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
    backgroundColor: "#333",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
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
  // Success page styles
  successContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "center",
    flex: 1,
  },
  successIconContainer: {
    marginVertical: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  ticketDetails: {
    width: "100%",
    alignItems: "center",
  },
  seatsText: {
    marginTop: 5,
  },
  bookingId: {
    marginTop: 10,
    fontSize: 12,
    color: "#666",
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
    borderTopColor: "#ddd",
  },
  totalText: {
    fontWeight: "600",
  },
  totalAmount: {
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 40,
    gap: 12,
    width: "100%",
    justifyContent: "space-between",
  },
  viewTicketsButton: {
    backgroundColor: Colors.light.tint,
    flex: 1,
  },
  homeButton: {
    backgroundColor: "#666",
    flex: 1,
  },
});
