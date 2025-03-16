import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const bookingStyles = StyleSheet.create({
  // Booking screen specific styles
  bookingList: {
    paddingBottom: 24,
  },
  bookingCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
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
  seatContainer: {
    flexDirection: "row",
    marginVertical: 8,
  },
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
  bookingTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  noBookings: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

  // Styles moved from [id].tsx
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  subtotalContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  pickerSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  pickerButton: {
    padding: 16,
    backgroundColor: "#808080",
    borderRadius: 8,
    marginBottom: 12,
  },
  screeningInfo: {
    alignItems: "center",
    marginBottom: 16,
  },
  dropdownContainer: {
    position: "relative",
    zIndex: 1000,
    marginBottom: 15,
  },
  dropdownOptions: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#222",
    borderRadius: 8,
    overflow: "hidden",
    zIndex: 1001,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  dropdownItemText: {
    color: "#fff",
    fontSize: 14,
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
  noDataText: {
    textAlign: "center",
    marginVertical: 20,
  },
  disabledButton: {
    opacity: 0.5,
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
  seatsContainer: {
    marginBottom: 24,
    width: "100%",
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
  // New styles for seat and subtotal display
  seatSubtotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 10,
  },
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
  subtotalDisplay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  subtotalText: {
    color: "white",
    fontSize: 12,
    marginBottom: 4,
  },
  subtotalAmount: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginVertical: 24,
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
  errorText: {
    textAlign: "center",
    marginBottom: 16,
    padding: 16,
  },
  retryButton: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  retryButtonText: {
    color: "#FFF",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonOverlay: {
    position: "absolute",
    top: 55,
    left: 20,
    zIndex: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  // New dark-themed styles
  darkContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  darkHeader: {
    paddingTop: 57,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  darkHeaderTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  darkInstructions: {
    color: "white",
    marginVertical: 16,
  },
  darkSectionTitle: {
    color: "white",
    marginTop: 20,
    marginBottom: 10,
  },
  darkDropdown: {
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  darkDropdownText: {
    color: "white",
  },
  // Light dropdowns like in the image
  lightDropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  lightDropdownText: {
    color: "#000000",
  },
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
    borderColor: "#007AFF",
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
    backgroundColor: "#007AFF",
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
    backgroundColor: "#007AFF",
  },
  timeText: {
    color: "white",
  },
  selectedTimeText: {
    fontWeight: "bold",
  },
  seatSelectionContainer: {
    marginBottom: 20,
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
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    paddingBottom: 30,
  },
  proceedButton: {
    backgroundColor: "#666666",
    borderRadius: 8,
    padding: 16,
    width: "48%",
    alignItems: "center",
  },
  disabledProceedButton: {
    backgroundColor: "#1E1E1E",
    opacity: 0.5,
  },
  proceedButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  // Light cancel button like in the image
  lightCancelButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    width: "48%",
    alignItems: "center",
  },
  lightCancelButtonText: {
    color: "#000000",
    fontWeight: "bold",
  },
  selectedDropdownItem: {
    backgroundColor: Colors.dark.tint + "33", // Add some transparency to the color
  },
  selectedDropdownItemText: {
    color: Colors.dark.tint,
    fontWeight: "bold",
  },
});

export default bookingStyles;
