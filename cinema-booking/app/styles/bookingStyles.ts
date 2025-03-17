import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "./commonStyles";

export const bookingStyles = StyleSheet.create({
  // --- CONTAINER STYLES ---
  container: {
    ...commonStyles.container,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  darkContainer: {
    ...commonStyles.darkContainer,
    paddingHorizontal: 16,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    ...commonStyles.loadingContainer,
    padding: 20,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // --- HEADER STYLES ---
  darkHeader: commonStyles.darkHeader,
  darkHeaderTitle: commonStyles.darkHeaderTitle,
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  backButtonOverlay: commonStyles.backButtonOverlay,

  // --- BOOKING CARD STYLES ---
  bookingList: {
    paddingBottom: 24,
  },
  bookingCard: {
    ...commonStyles.card,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  summaryContainer: {
    marginTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
  },
  bookingTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  noBookings: {
    justifyContent: "center",
    alignItems: "center",
  },

  // --- SECTION STYLES ---
  pickerSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  darkSectionTitle: {
    color: "white",
    marginTop: 20,
    marginBottom: 10,
  },
  darkInstructions: {
    color: "white",
    marginVertical: 16,
  },

  // --- SEAT STYLES ---
  seatContainer: {
    flexDirection: "row",
    marginVertical: 8,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#DDD",
    marginRight: 8,
  },
  seatLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  legendItemDark: {
    flexDirection: "row",
    alignItems: "center",
  },
  availableSeatIndicator: {
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: "#333",
    marginRight: 5,
  },
  unavailableSeatIndicator: {
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: "#666",
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedSeatIndicator: {
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: "#FFF",
    marginRight: 5,
  },
  legendTextDark: {
    color: "white",
    fontSize: 12,
  },

  // --- SCREEN VISUALIZATION ---
  screenContainer: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  screen: {
    width: "80%",
    height: 30,
    backgroundColor: "#999",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  screenText: {
    color: "#FFF",
    fontSize: 12,
  },

  // --- SEAT MAP STYLES ---
  seatsContainer: {
    marginBottom: 24,
    width: "100%",
  },
  seatSelectionContainer: {
    marginBottom: 20,
  },
  seatMapContainer: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    width: 20,
    marginHorizontal: 8,
    textAlign: "center",
    color: "white",
    fontSize: 12,
  },
  seatsRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  seat: {
    width: 24,
    height: 24,
    margin: 4,
    borderRadius: 4,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  bookedSeat: {
    backgroundColor: "#666",
  },
  selectedSeat: {
    backgroundColor: "#FFF",
  },
  seatNumber: {
    fontSize: 10,
    color: "#FFF",
  },
  bookedSeatText: {
    color: "#999",
  },
  selectedSeatText: {
    color: "#000",
  },

  // --- FOOD & BEVERAGE STYLES ---
  fnbContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
  },
  fnbTitle: {
    marginBottom: 8,
  },
  fnbItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  // --- DROPDOWN STYLES ---
  dropdownContainer: commonStyles.dropdownContainer,
  dropdownOptions: commonStyles.dropdownOptions,
  dropdownItem: commonStyles.dropdownItem,
  dropdownItemText: {
    color: "#fff",
    fontSize: 14,
  },
  selectedDropdownItem: {
    backgroundColor: Colors.dark.tint + "33", // Add some transparency
  },
  selectedDropdownItemText: {
    color: Colors.dark.tint,
    fontWeight: "bold",
  },
  darkDropdown: {
    ...commonStyles.dropdown,
    ...commonStyles.darkDropdown,
  },
  darkDropdownText: {
    color: "white",
  },
  lightDropdown: {
    ...commonStyles.dropdown,
    ...commonStyles.lightDropdown,
  },
  lightDropdownText: {
    color: "#000000",
  },

  // --- BUTTON STYLES ---
  pickerButton: {
    padding: 16,
    backgroundColor: "#808080",
    borderRadius: 8,
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#EEE",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#333",
  },
  disabledButton: commonStyles.disabledButton,
  disabledProceedButton: {
    backgroundColor: "#1E1E1E",
    opacity: 0.5,
  },
  cancelButton: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#ff4d4f",
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  bookButton: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  bookButtonText: {
    color: "#FFF",
  },
  backButton: {
    backgroundColor: "#DDD",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#333",
  },
  retryButton: {
    ...commonStyles.buttonBase,
    ...commonStyles.primaryButton,
    marginTop: 16,
  },
  retryButtonText: commonStyles.primaryButtonText,

  // --- MESSAGE STYLES ---
  noDataText: {
    textAlign: "center",
    marginVertical: 20,
  },
  errorText: commonStyles.errorText,

  // --- SUBTOTAL STYLES ---
  subtotalContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  seatSubtotalContainer: commonStyles.subtotalContainer,
  selectedSeatsDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#333",
    paddingRight: 10,
  },
  selectedSeatTag: {
    backgroundColor: "#333",
    borderRadius: 4,
    padding: 5,
    marginRight: 5,
  },
  selectedSeatTagText: {
    color: "white",
    fontSize: 12,
  },
  noSeatsText: {
    color: "white",
    fontSize: 14,
  },
  subtotalDisplay: commonStyles.subtotalDisplay,
  subtotalText: commonStyles.subtotalText,
  subtotalAmount: commonStyles.subtotalAmount,

  // --- PRICE RANGE STYLES ---
  priceRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  priceRangeCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 16,
    width: "48%",
  },
  selectedPriceRange: {
    borderColor: Colors.light.tint,
    borderWidth: 1,
  },
  priceRangeTitle: {
    color: "#999",
    fontSize: 12,
    marginBottom: 4,
  },
  priceRangeValue: {
    color: "white",
    fontSize: 14,
  },

  // --- CALENDAR STYLES ---
  calendarHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  monthIndicator: {
    color: "white",
    fontSize: 16,
  },
  dateScrollView: {
    marginBottom: 20,
  },
  dateScrollViewContent: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  dateCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginRight: 15,
    width: 50,
  },
  selectedDateCard: {
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
  },
  dayName: {
    color: "#999",
    fontSize: 12,
    marginBottom: 5,
  },
  dayNumber: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // --- TIME SELECTION STYLES ---
  timeContainer: {
    marginBottom: 20,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 12,
    width: "30%",
    alignItems: "center",
    marginBottom: 10,
  },
  selectedTimeCard: {
    backgroundColor: Colors.light.tint,
  },
  timeText: {
    color: "white",
  },
  selectedTimeText: {
    fontWeight: "bold",
  },

  // --- SCREENING STYLES ---
  screeningInfo: {
    alignItems: "center",
    marginBottom: 16,
  },

  // --- ACTION CONTAINERS ---
  footer: {
    marginVertical: 24,
  },
  actionButtonsContainer: commonStyles.actionButtonsContainer,
  proceedButton: {
    ...commonStyles.buttonBase,
    ...commonStyles.secondaryButton,
    width: "48%",
  },
  proceedButtonText: {
    ...commonStyles.buttonText,
    ...commonStyles.secondaryButtonText,
  },
  lightCancelButton: {
    ...commonStyles.buttonBase,
    ...commonStyles.whiteButton,
    width: "48%",
  },
  lightCancelButtonText: {
    ...commonStyles.buttonText,
    ...commonStyles.whiteButtonText,
  },
});

export default bookingStyles;
