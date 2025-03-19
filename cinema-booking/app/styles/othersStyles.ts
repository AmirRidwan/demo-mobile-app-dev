import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "./commonStyles";

export const othersStyles = StyleSheet.create({
  // --- HEADER STYLES ---
  darkHeader: commonStyles.darkHeader,
  darkHeaderTitle: commonStyles.darkHeaderTitle,
  backButtonOverlay: commonStyles.backButtonOverlay,

  // --- CONTAINER STYLES ---
  darkContainer: {
    ...commonStyles.darkContainer,
    padding: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: commonStyles.loadingContainer,

  // --- TEXT STYLES ---
  darkInstructions: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  darkSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginVertical: 16,
  },

  // --- BOOKING SUMMARY STYLES ---
  bookingSummary: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 20,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
  },
  bookingDetails: {
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  subtotalText: {
    fontWeight: "600",
    color: "white",
  },
  subtotalAmount: {
    fontWeight: "bold",
    color: Colors.light.tint,
  },

  // --- FOOD & BEVERAGE STYLES ---
  fnbGrid: {
    marginBottom: 20,
  },
  fnbCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    color: "white",
  },
  itemPrice: {
    fontSize: 14,
    color: Colors.light.tint,
  },
  itemDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
  },

  // --- QUANTITY CONTROLS ---
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  addButton: {
    backgroundColor: Colors.light.tint,
  },
  quantityBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "white",
    minWidth: 20,
    textAlign: "center",
  },

  // --- ORDER SUMMARY STYLES ---
  orderSummary: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "white",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.8)",
  },
  summaryValue: {
    color: "white",
    fontWeight: "600",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.tint,
  },

  // --- ACTION BUTTONS ---
  actionButtonsContainer: commonStyles.actionButtonsContainer,
  lightCancelButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  lightCancelButtonText: {
    color: "white",
    fontWeight: "600",
  },
  proceedButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: Colors.light.tint,
    alignItems: "center",
    justifyContent: "center",
  },
  proceedButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  disabledButton: commonStyles.disabledButton,

  // --- TAB STYLES ---
  tabContainer: {
    flexDirection: "row",
    marginVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.tint,
  },
  tabText: {
    color: "#666",
  },
  activeTabText: {
    color: Colors.light.tint,
  },

  // --- NEW SCREEN STYLES ---
  containerNew: commonStyles.darkContainer,
  headerNew: {
    ...commonStyles.darkHeader,
    borderBottomWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    height: 60,
  },
  headerGridColumn: {
    justifyContent: "center",
  },
  headerLeftColumn: {
    width: 60,
    alignItems: "flex-start",
  },
  headerCenterColumn: {
    flex: 1,
    alignItems: "center",
  },
  headerRightColumn: {
    width: 60,
    alignItems: "flex-end",
  },
  headerTitleNew: {
    ...commonStyles.darkHeaderTitle,
    fontSize: 18,
    textAlign: "center",
  },
  backButtonNew: {
    padding: 8,
  },
  skipButtonNew: {
    padding: 8,
  },
  skipTextNew: {
    color: "white",
    fontSize: 15,
  },

  // --- UPDATED TAB STYLES ---
  tabContainerNew: {
    ...commonStyles.tabContainer,
    marginVertical: 0,
  },
  tabButtonNew: {
    ...commonStyles.tabButton,
    paddingHorizontal: 16,
  },
  activeTabNew: {
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  tabTextNew: {
    color: "#888",
    fontSize: 16,
  },
  activeTabTextNew: {
    color: "white",
    fontWeight: "500",
  },

  // --- SCROLL VIEW STYLES ---
  scrollViewNew: {
    flex: 1,
    backgroundColor: "#000",
  },

  // --- F&B GRID STYLES ---
  fnbGridContainer: {
    padding: 16,
  },
  fnbRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  fnbCardNew: {
    width: "48%",
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 8,
  },
  emptyCard: {
    width: "48%",
  },
  fnbImageContainer: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 8,
  },
  fnbImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#333",
    borderRadius: 4,
  },
  fnbItemName: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  fnbItemDescription: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },
  fnbPriceRow: {
    backgroundColor: "#222",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  fnbItemPrice: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },

  // --- UPDATED QUANTITY CONTROLS ---
  quantityControlsNew: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxContainer: {
    marginRight: 4,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#666",
    backgroundColor: "transparent",
  },
  checkboxSelected: {
    backgroundColor: "#666",
  },
  quantityTextNew: {
    color: "white",
    fontSize: 14,
    marginHorizontal: 4,
    width: 16,
    textAlign: "center",
  },
  quantityButtonNew: {
    width: 20,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityBtnTextNew: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },

  // --- BUTTON CONTAINERS ---
  confirmButtonContainer: {
    padding: 16,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  confirmButton: {
    ...commonStyles.buttonBase,
    backgroundColor: "#fff",
  },
  confirmButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },

  // --- SUBTOTAL SECTION STYLES ---
  seatSubtotalContainer: commonStyles.subtotalContainer,
  selectedItemsDisplay: {
    flex: 1,
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#333",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedItemTag: {
    backgroundColor: "#444",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
  },
  selectedItemTagText: {
    color: "white",
    fontSize: 12,
  },
  noItemsText: {
    color: "white",
    fontSize: 12,
    marginBottom: 4,
  },
  itemCountText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  subtotalDisplayNew: commonStyles.subtotalDisplay,
  itemsDisplayNew: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#333",
  },
  subtotalTextNew: commonStyles.subtotalText,
  subtotalAmountNew: commonStyles.subtotalAmount,
  subtotalDisplay: commonStyles.subtotalDisplay,
});

export default othersStyles;
