import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Dimensions,
  Alert,
  StatusBar,
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
import { movieStyles } from "@/app/styles/movieStyles";
import { BackButton } from "@/components/BackButton";

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
      <ThemedView style={movieStyles.descriptionContainer}>
        <ThemedText type="title">Synopsis</ThemedText>
        <ThemedText style={movieStyles.description}>
          {movie?.description}
        </ThemedText>
      </ThemedView>

      <ThemedView style={movieStyles.castsContainer}>
        <ThemedText type="title">Cast</ThemedText>
        <ThemedView style={movieStyles.castGrid}>
          {movie?.casts.map((cast, index) => (
            <ThemedView key={index} style={movieStyles.castGridItem}>
              <ThemedText type="defaultSemiBold" numberOfLines={1}>
                {cast.name}
              </ThemedText>
              <ThemedText numberOfLines={1}>as {cast.character}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      <TouchableOpacity
        style={[
          movieStyles.bookTicketButton,
          !isConnected && movieStyles.disabledButton,
        ]}
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
        <ThemedText type="defaultSemiBold" style={movieStyles.bookTicketText}>
          Book a Ticket
        </ThemedText>
      </TouchableOpacity>
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
    <ThemedView style={movieStyles.reviewsContainer}>
      <ThemedText type="subtitle" style={movieStyles.reviewsTitle}>
        All Reviews
      </ThemedText>

      {reviews && reviews.length > 0 ? (
        reviews.map((review, index) => (
          <ThemedView key={index} style={movieStyles.reviewCard}>
            <ThemedView style={movieStyles.reviewHeader}>
              <ThemedText type="defaultSemiBold">{review.username}</ThemedText>
              <ThemedText>{"⭐".repeat(review.rating)}</ThemedText>
            </ThemedView>
            <ThemedText style={movieStyles.reviewText}>
              {review.comment}
            </ThemedText>
          </ThemedView>
        ))
      ) : (
        <ThemedView style={movieStyles.emptyReviewsContainer}>
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
      <ThemedView style={[movieStyles.container, movieStyles.centered]}>
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].tint}
        />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={[movieStyles.container, movieStyles.centered]}>
        <ThemedText style={movieStyles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={movieStyles.retryButton} onPress={handleRetry}>
          <ThemedText
            type="defaultSemiBold"
            style={movieStyles.retryButtonText}
          >
            Retry
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!movie) {
    return (
      <ThemedView style={[movieStyles.container, movieStyles.centered]}>
        <ThemedText>Movie not found</ThemedText>
        <TouchableOpacity
          style={movieStyles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText type="defaultSemiBold" style={movieStyles.backButtonText}>
            Back to Movies
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Back button overlay */}
      <BackButton
        defaultPath={`/`}
        onPress={() => router.push(`/`)}
      />

      <ScrollView style={movieStyles.container}>
        {trailerPlaying ? (
          <View style={movieStyles.trailerContainer}>
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
              <ThemedText style={movieStyles.errorText}>
                Trailer not available
              </ThemedText>
            )}
            <TouchableOpacity
              style={movieStyles.closeTrailer}
              onPress={() => setTrailerPlaying(false)}
            >
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={movieStyles.posterContainer}>
            <Image
              source={{ uri: movie.posterUrl }}
              style={movieStyles.poster}
            />
            <TouchableOpacity
              style={movieStyles.playButton}
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

        <ThemedView style={movieStyles.content}>
          <ThemedText type="title" style={movieStyles.title}>
            {movie.title}
          </ThemedText>

          <ThemedView style={movieStyles.detailsContainer}>
            <ThemedView style={movieStyles.detailsTopRow}>
              <ThemedText style={movieStyles.genre}>{movie.genre}</ThemedText>
              <ThemedText style={movieStyles.rating}>
                ⭐ {movie.rating} / 10
              </ThemedText>
            </ThemedView>
            <ThemedView style={movieStyles.detailsBottomRow}>
              <ThemedText style={movieStyles.duration}>
                Duration: {movie.duration}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Tab Navigation */}
          <ThemedView style={movieStyles.tabContainer}>
            <TouchableOpacity
              style={[
                movieStyles.tabButton,
                activeTab === "details" && movieStyles.activeTab,
              ]}
              onPress={() => setActiveTab("details")}
            >
              <ThemedText
                type={activeTab === "details" ? "defaultSemiBold" : "default"}
                style={[
                  movieStyles.tabText,
                  activeTab === "details" && movieStyles.activeTabText,
                ]}
              >
                Movie Details
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                movieStyles.tabButton,
                activeTab === "reviews" && movieStyles.activeTab,
              ]}
              onPress={() => setActiveTab("reviews")}
            >
              <ThemedText
                type={activeTab === "reviews" ? "defaultSemiBold" : "default"}
                style={[
                  movieStyles.tabText,
                  activeTab === "reviews" && movieStyles.activeTabText,
                ]}
              >
                Ratings & Reviews
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Tab Content */}
          {activeTab === "details" ? renderDetailsTab() : renderReviewsTab()}
        </ThemedView>
      </ScrollView>
    </View>
  );
}
