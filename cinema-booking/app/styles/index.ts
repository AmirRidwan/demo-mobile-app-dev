import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "./commonStyles";

export const styles = StyleSheet.create({
  // Container styles
  container: {
    ...commonStyles.container,
    padding: 16,
  },
  screenContainer: commonStyles.screenContainer,
  centerContainer: commonStyles.centerContainer,

  // Section styles
  section: commonStyles.section,
  sectionTitle: {
    marginBottom: 16,
  },

  // Header styles
  header: {
    marginBottom: 24,
  },

  // List styles
  horizontalList: {
    paddingLeft: 4,
    paddingRight: 16,
  },

  // Card styles
  card: commonStyles.card,

  // Item styles
  itemContainer: {
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Loading and error states
  loader: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: commonStyles.errorContainer,
  errorText: commonStyles.errorText,
  loadingText: commonStyles.loadingText,

  // Movie screen specific styles
  movieItem: {
    marginLeft: 8,
  },
  posterContainer: {
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  movieTitle: {
    marginTop: 8,
    textAlign: "center",
  },

  actionButton: {
    backgroundColor: "#ff5252",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

// Dynamic style generator functions
export const getMovieItemStyles = (width: number) => {
  const getItemWidth = () => {
    if (width >= 1200) return width / 6; // Desktop/large tablet landscape
    if (width >= 900) return width / 5; // Tablet landscape
    if (width >= 700) return width / 4; // Large phones/small tablets
    if (width >= 500) return width / 3; // Medium phones
    return width / 2.2; // Small phones
  };

  const itemWidth = getItemWidth();
  const posterHeight = itemWidth * 1.5;

  return {
    movieItem: {
      width: itemWidth,
      marginRight: 12,
    },
    moviePoster: {
      width: "100%" as any,
      height: posterHeight,
      resizeMode: "cover" as "cover",
    },
  };
};

// Export common styles
export { commonStyles };

// Re-export other style modules for convenience
export { bookingStyles } from "@/app/styles/bookingStyles";
export { movieStyles } from "@/app/styles/movieStyles";
export { othersStyles } from "@/app/styles/othersStyles";
export { paymentStyles } from "@/app/styles/paymentStyles";
export default styles;
