import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import API_CONFIG from "@/utils/api";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Movie } from "@/types";

export default function MoviesScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useNetworkStatus();

  const getItemWidth = useCallback(() => {
    if (width >= 1200) return width / 6; // Desktop/large tablet landscape
    if (width >= 900) return width / 5; // Tablet landscape
    if (width >= 700) return width / 4; // Large phones/small tablets
    if (width >= 500) return width / 3; // Medium phones
    return width / 2.2; // Small phones
  }, [width]);

  const itemWidth = getItemWidth();
  const posterHeight = itemWidth * 1.5;

  useEffect(() => {
    if (!isConnected) {
      setError("No internet connection. Please check your network settings.");
      setLoading(false);
      return;
    }

    async function loadMovies() {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MOVIES}`
        );
        const data = await response.json();
        setMovies(data);
        setError(null);
      } catch (err) {
        setError("Failed to load movies. Please try again.");
        console.error("Error loading movies:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [isConnected]);

  const handleMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  // Dynamic styles for horizontal scrolling
  const dynamicStyles = {
    movieItem: {
      width: itemWidth,
      marginRight: 12,
    },
    moviePoster: {
      width: "100%",
      height: posterHeight,
      resizeMode: "cover" as "cover",
    },
  };

  // Render movie item for horizontal list
  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={[styles.movieItem, dynamicStyles.movieItem]}
      onPress={() => handleMoviePress(item.id)}
      activeOpacity={0.8}
    >
      <ThemedView style={styles.posterContainer}>
        <Image
          source={{ uri: item.posterUrl }}
          style={dynamicStyles.moviePoster}
        />
      </ThemedView>
      <ThemedText type="subtitle" numberOfLines={1} style={styles.movieTitle}>
        {item.title}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Hello, User</ThemedText>
        <ThemedText type="default">
          Want to go see a movie? Get your ticket today!
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          New Releases
        </ThemedText>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme ?? "light"].tint}
            style={styles.loader}
          />
        ) : error ? (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={movies}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        )}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Popular Movies
        </ThemedText>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme ?? "light"].tint}
            style={styles.loader}
          />
        ) : error ? (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={movies}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        )}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Recommended For You
        </ThemedText>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme ?? "light"].tint}
            style={styles.loader}
          />
        ) : error ? (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={movies}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  horizontalList: {
    paddingLeft: 4,
    paddingRight: 16,
  },
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
});
