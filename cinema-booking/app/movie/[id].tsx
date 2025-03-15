import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Dimensions,
  Alert,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { AntDesign } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import API_CONFIG from "@/utils/api";

import { Movie, Review } from "@/types";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const movieId = typeof id === "string" ? parseInt(id, 10) : 0;
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");

  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trailerPlaying, setTrailerPlaying] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { isConnected } = useNetworkStatus();

  const fetchData = useCallback(
    async (endpoint: string) => {
      console.log(isConnected);
      if (!isConnected) {
        setError("No internet connection. Please check your network settings.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
        return await response.json();
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    },
    [isConnected]
  );

  const fetchMovie = useCallback(async () => {
    try {
      const data = await fetchData(`/movies/${movieId}`);
      setMovie(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load movie details. Please try again.";
      setError(errorMessage);
      console.error("Error fetching movie:", err);
    }
  }, [fetchData, movieId]);

  const fetchReviews = useCallback(async () => {
    try {
      const data = await fetchData(`/reviews?movieId=${movieId}`);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [fetchData, movieId]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchMovie();
        await Promise.allSettled([fetchReviews()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      loadData();
    }
  }, [movieId, fetchMovie, fetchReviews]);

  const handleScreeningPress = (movieId: number) => {
    if (!isConnected) {
      Alert.alert(
        "No Internet Connection",
        "You need to be online to book tickets."
      );
      return;
    }
    router.push(`/booking/${movieId}`);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    Promise.all([fetchMovie(), fetchReviews()]).finally(() =>
      setLoading(false)
    );
  };

  // Tab rendering functions
  const renderDetailsTab = () => (
    <>
      <ThemedView style={styles.descriptionContainer}>
        <ThemedText type="title">Synopsis</ThemedText>
        <ThemedText style={styles.description}>{movie?.description}</ThemedText>
      </ThemedView>

      <TouchableOpacity
        style={[styles.bookTicketButton, !isConnected && styles.disabledButton]}
        onPress={() => {
          if (!isConnected) {
            Alert.alert(
              "No Internet Connection",
              "You need to be online to book tickets."
            );
            return;
          }

          try {
            router.push(`/booking/${movieId}`);
          } catch (error) {
            console.error("Navigation error:", error);
            Alert.alert("Error", "Failed to navigate to booking page.", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Retry",
                onPress: () => {
                  try {
                    router.push(`/booking/${movieId}`);
                  } catch (retryError) {
                    console.error("Retry navigation error:", retryError);
                    Alert.alert(
                      "Error",
                      "Could not navigate to booking page. Please try again later."
                    );
                  }
                },
              },
            ]);
          }
        }}
        disabled={!isConnected}
      >
        <ThemedText type="defaultSemiBold" style={styles.bookTicketText}>
          Book a Ticket
        </ThemedText>
      </TouchableOpacity>

      <ThemedView style={styles.castsContainer}>
        <ThemedText type="title">Cast</ThemedText>
        <ThemedView style={styles.castGrid}>
          {movie?.casts.map((cast, index) => (
            <ThemedView key={index} style={styles.castGridItem}>
              <ThemedText type="defaultSemiBold" numberOfLines={1}>
                {cast.name}
              </ThemedText>
              <ThemedText numberOfLines={1}>as {cast.character}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>
    </>
  );

  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const renderReviewsTab = () => (
    <ThemedView style={styles.reviewsContainer}>
      <ThemedText type="subtitle" style={styles.reviewsTitle}>
        All Reviews
      </ThemedText>

      {reviews && reviews.length > 0 ? (
        reviews.map((review, index) => (
          <ThemedView key={index} style={styles.reviewCard}>
            <ThemedView style={styles.reviewHeader}>
              <ThemedText type="defaultSemiBold">{review.username}</ThemedText>
              <ThemedText>{"⭐".repeat(review.rating)}</ThemedText>
            </ThemedView>
            <ThemedText style={styles.reviewText}>{review.comment}</ThemedText>
          </ThemedView>
        ))
      ) : (
        <ThemedView style={styles.emptyReviewsContainer}>
          <ThemedText>
            {!isConnected
              ? "Cannot load reviews while offline"
              : "No reviews yet"}
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].tint}
        />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <ThemedText type="defaultSemiBold" style={styles.retryButtonText}>
            Retry
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!movie) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText>Movie not found</ThemedText>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText type="defaultSemiBold" style={styles.backButtonText}>
            Back to Movies
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {trailerPlaying ? (
        <View style={styles.trailerContainer}>
          {movie.trailerUrl ? (
            <YoutubePlayer
              height={Dimensions.get("window").width * 0.5625}
              width={Dimensions.get("window").width}
              videoId={extractYouTubeId(movie.trailerUrl) || ""}
              play={true}
              onChangeState={(state) => {
                if (state === "ended") setTrailerPlaying(false);
              }}
            />
          ) : (
            <ThemedText style={styles.errorText}>
              Trailer not available
            </ThemedText>
          )}
          <TouchableOpacity
            style={styles.closeTrailer}
            onPress={() => setTrailerPlaying(false)}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.posterContainer}>
          <Image source={{ uri: movie.posterUrl }} style={styles.poster} />
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              if (!isConnected) {
                Alert.alert(
                  "No Internet Connection",
                  "Cannot play trailer while offline."
                );
                return;
              }
              setTrailerPlaying(true);
            }}
          >
            <AntDesign name="playcircleo" size={60} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          {movie.title}
        </ThemedText>

        <ThemedView style={styles.detailsContainer}>
          <ThemedView style={styles.detailsTopRow}>
            <ThemedText style={styles.genre}>{movie.genre}</ThemedText>
            <ThemedText style={styles.rating}>
              ⭐ {movie.rating} / 10
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.detailsBottomRow}>
            <ThemedText style={styles.duration}>
              Duration: {movie.duration}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Tab Navigation */}
        <ThemedView style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "details" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("details")}
          >
            <ThemedText
              type={activeTab === "details" ? "defaultSemiBold" : "default"}
              style={[
                styles.tabText,
                activeTab === "details" && styles.activeTabText,
              ]}
            >
              Movie Details
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "reviews" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("reviews")}
          >
            <ThemedText
              type={activeTab === "reviews" ? "defaultSemiBold" : "default"}
              style={[
                styles.tabText,
                activeTab === "reviews" && styles.activeTabText,
              ]}
            >
              Ratings & Reviews
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Tab Content */}
        {activeTab === "details" ? renderDetailsTab() : renderReviewsTab()}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText type="defaultSemiBold" style={styles.backButtonText}>
            Back to Movies
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
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
    top: 50,
    right: 30,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  content: {
    padding: 16,
  },
  castsContainer: {
    marginBottom: 24,
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
  title: {
    marginVertical: 8,
  },
  detailsContainer: {
    marginBottom: 16,
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
  bookNowButton: {
    backgroundColor: "#E63946",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 16,
  },
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
  disabledCard: {
    opacity: 0.6,
  },
  bookNowText: {
    color: "white",
  },
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
  // Content styles
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    marginTop: 8,
    lineHeight: 22,
  },
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
  },
  retryButtonText: {
    color: "#FFF",
  },
});
