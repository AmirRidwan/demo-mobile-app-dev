import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "./commonStyles";

const { width } = Dimensions.get("window");
const statusBarHeight =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;
const safeTopMargin = statusBarHeight + 10;

export const movieStyles = StyleSheet.create({
  // --- BUTTON AND NAVIGATION STYLES ---
  backButtonOverlay: commonStyles.backButtonOverlay,

  // --- CONTAINER STYLES ---
  container: commonStyles.container,
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
    borderRadius: 20,
    marginTop: -18,
  },

  // --- POSTER AND TRAILER STYLES ---
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
    height: width * 0.5625 + 30, // Height of video plus extra room for controls
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
    top: safeTopMargin,
    right: 15,
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

  // --- TITLE AND DETAILS STYLES ---
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

  // --- TAB NAVIGATION STYLES ---
  tabContainer: commonStyles.tabContainer,
  tabButton: commonStyles.tabButton,
  activeTab: commonStyles.activeTab,
  tabText: commonStyles.tabText,
  activeTabText: commonStyles.activeTabText,

  // --- DESCRIPTION STYLES ---
  descriptionContainer: {
    marginBottom: 10,
  },
  description: {
    marginTop: 12,
    lineHeight: 22,
  },

  // --- CAST STYLES ---
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

  // --- REVIEW STYLES ---
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

  // --- BUTTON STYLES ---
  bookTicketButton: {
    ...commonStyles.buttonBase,
    backgroundColor: "#E63946",
    marginVertical: 16,
    borderRadius: 12,
  },
  bookTicketText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: commonStyles.disabledButton,
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
    ...commonStyles.buttonBase,
    ...commonStyles.primaryButton,
  },
  retryButtonText: commonStyles.primaryButtonText,

  // --- SCREENING STYLES ---
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

  // --- ERROR STATES ---
  errorText: commonStyles.errorText,
});

export default movieStyles;
