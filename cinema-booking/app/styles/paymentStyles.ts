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
});
