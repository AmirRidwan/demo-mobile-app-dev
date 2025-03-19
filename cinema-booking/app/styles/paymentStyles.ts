import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "./commonStyles";

export const paymentStyles = StyleSheet.create({
  // --- CONTAINER STYLES ---
  container: {
    ...commonStyles.darkContainer,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  // --- HEADER STYLES ---
  darkHeader: {
    ...commonStyles.darkHeader,
    paddingBottom: 16,
    justifyContent: "center", // Center the title
  },
  darkHeaderTitle: {
    ...commonStyles.darkHeaderTitle,
    textAlign: "center", // Ensure title is centered
  },
  backButtonOverlay: {
    position: "absolute",
    top: 50,
    left: 15,
    zIndex: 1000,
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 16,
  },

  // --- SUMMARY CONTAINER ---
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

  // --- MOVIE INFO SECTION ---
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
    backgroundColor: "#333",
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
  movieDetailItem: commonStyles.movieDetailItem,
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

  // --- TICKET CONTAINER ---
  ticketContainer: {
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#121212",
    overflow: "hidden",
    marginBottom: 0,
  },

  // --- DASHED LINE ---
  dashedLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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

  // --- SCREENING INFO ---
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
    width: "33%",
    backgroundColor: "transparent",
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

  // --- PAYMENT SECTIONS ---
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

  // --- FOOD & BEVERAGE SECTION ---
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

  // --- CHARGES SECTION ---
  chargesContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  // --- PROMO CODE SECTION ---
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

  // --- TOTAL SECTION ---
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

  // --- BUTTONS ---
  proceedButton: {
    ...commonStyles.buttonBase,
    ...commonStyles.secondaryButton,
    margin: 16,
  },
  proceedButtonText: {
    ...commonStyles.buttonText,
    ...commonStyles.secondaryButtonText,
  },
  activeButton: {
    backgroundColor: "#666", // Changed from Colors.light.tint to match other buttons
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 10,
  },
  disabledButton: commonStyles.disabledButton,

  // --- PAYMENT METHODS ---
  paymentMethodsContainer: {
    padding: 16,
    flex: 1,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedPayment: {
    borderColor: Colors.light.tint,
    borderWidth: 2,
  },
  paymentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#333",
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
    color: "#fff",
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: "#aaa",
  },

  // --- TRANSACTION FORM ---
  transactionContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  transactionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#000",
  },
  backButtonTransaction: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
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
    color: "#fff",
  },
  formContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#fff",
  },
  inputGroup: commonStyles.inputGroup,
  inputLabel: commonStyles.inputLabel,
  input: commonStyles.input,
  inputRow: {
    flexDirection: "row",
  },

  // --- CRYPTO OPTIONS ---
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
    backgroundColor: "#1a1a1a",
  },
  noteText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
    marginLeft: 8,
  },

  // --- ACTION BUTTONS ---
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

  // --- SUCCESS PAGE ---
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
    color: "#fff",
  },
  successMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#ccc",
  },
  ticketDetails: {
    width: "100%",
    alignItems: "center",
  },
  seatsText: {
    marginTop: 5,
    color: "#fff",
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
    borderTopColor: "#333",
  },
  totalText: {
    fontWeight: "600",
    color: "#fff",
  },
  totalAmount: {
    fontWeight: "600",
    color: "#fff",
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
    ...commonStyles.buttonBase,
  },
  homeButton: {
    backgroundColor: "#666",
    flex: 1,
    ...commonStyles.buttonBase,
  },
  instructionText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 28,
    marginTop: 12,
  },

  // CARD PAYMENT SCREEN
  cardPaymentScreen: {
    flex: 1,
    backgroundColor: "#000",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
  },

  cardPaymentContainer: {
    padding: 16,
    flex: 1,
  },

  cardInstructionText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
    marginTop: 10,
  },

  cardInputGroup: {
    marginBottom: 20,
  },

  cardInputLabel: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
  },

  cardInput: {
    backgroundColor: "#333",
    borderRadius: 4,
    padding: 12,
    color: "#fff",
    fontSize: 16,
  },

  cardInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  cardPayButton: {
    backgroundColor: "#666",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 20,
  },

  cardPayButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  saveCardContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxChecked: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },

  saveCardText: {
    color: "#fff",
    fontSize: 14,
  },
});
