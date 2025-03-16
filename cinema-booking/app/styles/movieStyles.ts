import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");
const statusBarHeight =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;
const safeTopMargin = statusBarHeight + 10;

export const movieStyles = StyleSheet.create({
  // Back button overlay - left side
  backButtonOverlay: {
    position: "absolute",
    top: safeTopMargin, // Dynamically calculate based on status bar height
    left: 15,
    zIndex: 1000, // Ensure it's above other elements
    borderRadius: 20,
    padding: 8,
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

  // Container styles
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
    borderRadius: 20,
    marginTop: -18
  },

  // Poster and trailer styles
  posterContainer: {
    position: "relative",
    width: "100%",
    height: 400,
  },
  poster: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -30 }],
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    padding: 10,
  },
  trailerContainer: {
    width: "100%",
    height: width * 0.5625 + 30, // Height of video plus some extra room for controls
    position: "relative",
    backgroundColor: "#000",
  },
  youtubeContainer: {
    width: width,
    height: width * 0.5625, // 16:9 aspect ratio
    overflow: "hidden",
  },
  trailer: {
    width: "100%",
    height: "100%",
  },
  closeTrailer: {
    position: "absolute",
    top: safeTopMargin, // Use the same safe top margin as back button
    right: 15, // Match the left margin of back button
    borderRadius: 20,
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Title and details styles
  title: {
    marginVertical: 8,
  },
  detailsContainer: {
    marginBottom: 0,
  },
  detailsTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailsBottomRow: {
    alignItems: "flex-end",
  },
  genre: {
    flex: 1,
  },
  rating: {
    textAlign: "right",
  },
  duration: {
    textAlign: "right",
  },

  // Tab navigation styles
  tabContainer: {
    flexDirection: "row",
    marginVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
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

  // Description and synopsis styles
  descriptionContainer: {
    marginBottom: 10,
  },
  description: {
    marginTop: 12,
    lineHeight: 22,
  },

  // Cast styles
  castsContainer: {
    marginTop: 12,
    marginBottom: 0,
  },
  castGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  castGridItem: {
    width: "75%",
    paddingVertical: 8,
    paddingRight: 12,
  },

  // Review styles
  reviewsContainer: {
    marginBottom: 24,
  },
  reviewsTitle: {
    marginBottom: 12,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reviewText: {
    lineHeight: 20,
  },
  emptyReviewsContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },

  // Button styles
  bookTicketButton: {
    backgroundColor: "#E63946",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 16,
  },
  bookTicketText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
  backButton: {
    backgroundColor: "#DDD",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  backButtonText: {
    color: "#333",
  },
  retryButton: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#FFF",
  },

  // Screening styles
  screeningsContainer: {
    marginBottom: 24,
  },
  screeningCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  screeningInfo: {
    flex: 1,
  },
  availableSeats: {
    fontWeight: "600",
  },
  disabledCard: {
    opacity: 0.6,
  },

  // Error states
  errorText: {
    textAlign: "center",
    marginBottom: 16,
    padding: 16,
  },
});

export default movieStyles;
