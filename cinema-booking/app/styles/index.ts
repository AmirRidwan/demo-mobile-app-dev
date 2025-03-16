import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    padding: 16,
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

  // Section styles
  section: {
    marginBottom: 24,
  },
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
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },

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
  errorContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    textAlign: "center",
  },
  loadingText: {
    marginTop: 16,
  },

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

// Re-export booking styles for convenience
export { bookingStyles } from "@/app/styles/bookingStyles";
export { movieStyles } from "@/app/styles/movieStyles";
export { othersStyles } from "@/app/styles/othersStyles";
export default styles;
