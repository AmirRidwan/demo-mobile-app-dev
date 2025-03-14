import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Movie, Screening } from "@/app/types";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const movieId = typeof id === "string" ? parseInt(id, 10) : 0;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    if (movieId) {
      fetchMovie();
      fetchScreenings();
    }
  }, [movieId]);

  const fetchMovie = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/movies/${movieId}`
      );
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error("Error fetching movie:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScreenings = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/screenings?movieId=${movieId}`
      );
      const data = await response.json();
      setScreenings(data);
    } catch (error) {
      console.error("Error fetching screenings:", error);
    }
  };

  const handleScreeningPress = (screeningId: number) => {
    router.push(`/booking/${screeningId}`);
  };

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

  if (!movie) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText>Movie not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: movie.posterUrl }} style={styles.poster} />

      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          {movie.title}
        </ThemedText>

        <ThemedView style={styles.detailsRow}>
          <ThemedText style={styles.genre}>{movie.genre}</ThemedText>
          <ThemedText>⭐ {movie.rating}</ThemedText>
          <ThemedText>{movie.duration}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.descriptionContainer}>
          <ThemedText type="subtitle">Synopsis</ThemedText>
          <ThemedText style={styles.description}>
            {movie.description}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.screeningsContainer}>
          <ThemedText type="subtitle">Screenings</ThemedText>

          {screenings.length > 0 ? (
            screenings.map((screening) => (
              <TouchableOpacity
                key={screening.id}
                style={styles.screeningCard}
                onPress={() => handleScreeningPress(screening.id)}
                activeOpacity={0.8}
              >
                <ThemedView style={styles.screeningInfo}>
                  <ThemedText type="defaultSemiBold">
                    {screening.date}
                  </ThemedText>
                  <ThemedText>
                    {screening.time} • {screening.hall}
                  </ThemedText>
                </ThemedView>
                <ThemedText style={styles.availableSeats}>
                  {
                    screening.availableSeats.filter((seat) => !seat.isBooked)
                      .length
                  }{" "}
                  seats available
                </ThemedText>
              </TouchableOpacity>
            ))
          ) : (
            <ThemedText>No screenings available</ThemedText>
          )}
        </ThemedView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  poster: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    marginVertical: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  genre: {
    flex: 1,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    marginTop: 8,
    lineHeight: 22,
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
    backgroundColor: "#f5f5f5",
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
});
