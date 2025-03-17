import { StyleSheet, Platform, StatusBar } from "react-native";
import { Colors } from "@/constants/Colors";

// Calculate safe top margin for various devices
const statusBarHeight =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;
const safeTopMargin = statusBarHeight + 10;

export const commonStyles = StyleSheet.create({
  // --- CONTAINERS ---
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  darkContainer: {
    flex: 1,
    backgroundColor: "#000",
  },

  // --- HEADERS ---
  darkHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center content
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    position: "relative", // For absolute positioning of back button
  },
  darkHeaderTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  backButtonOverlay: {
    position: "absolute",
    top: safeTopMargin,
    left: 15,
    zIndex: 1000,
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

  // --- LOADING & ERROR STATES ---
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 16,
    padding: 16,
  },
  loadingText: {
    marginTop: 10,
  },

  // --- BUTTONS ---
  buttonBase: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: Colors.light.tint,
  },
  secondaryButton: {
    backgroundColor: "#666",
  },
  whiteButton: {
    backgroundColor: "#fff",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  primaryButtonText: {
    color: "#fff",
  },
  secondaryButtonText: {
    color: "#fff",
  },
  whiteButtonText: {
    color: "#000",
  },

  // --- TABS ---
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

  // --- CARDS ---
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  darkCard: {
    backgroundColor: "#222",
    borderRadius: 8,
  },

  // --- FORM ELEMENTS ---
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#ccc",
    backgroundColor: "#1a1a1a",
  },
  inputLabel: {
    marginBottom: 8,
    fontWeight: "500",
    color: "#fff",
  },
  inputGroup: {
    marginBottom: 16,
  },
  dropdown: {
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  darkDropdown: {
    backgroundColor: "#1E1E1E",
  },
  lightDropdown: {
    backgroundColor: "#FFFFFF",
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

  // --- SECTIONS ---
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
  },

  // --- SUMMARY DISPLAYS ---
  subtotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 10,
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

  // --- ACTION CONTAINERS ---
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    paddingBottom: 30,
  },

  // --- MOVIE DETAILS ---
  movieDetailItem: {
    marginBottom: 4,
  },
  movieDetailText: {
    fontSize: 14,
    color: "#aaa",
  },

  // --- PAYMENT ELEMENTS ---
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
});

export default commonStyles;
