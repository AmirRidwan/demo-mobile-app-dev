import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import API_CONFIG from "@/utils/api";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Movie } from "@/types";
import { styles, getMovieItemStyles } from "@/app/styles/index";
import { useTabBarVisibility } from "@/components/TabBarVisibility";

// Constants for scroll behavior
const SCROLL_THRESHOLD = 10; // Minimum scroll distance to trigger tab bar visibility change
const MIN_SCROLL_TO_HIDE = 50; // Only hide tab bar after scrolling below this position

export default function MoviesScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useNetworkStatus();
  const { setVisible } = useTabBarVisibility();

  // For scroll detection
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const dynamicStyles = getMovieItemStyles(width);

  useEffect(() => {
    if (isConnected === false) {
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

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      setIsScrolling(true);

      if (currentScrollY < MIN_SCROLL_TO_HIDE) {
        setVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (Math.abs(currentScrollY - lastScrollY.current) < SCROLL_THRESHOLD) {
        return;
      }

      const isScrollingDown = currentScrollY > lastScrollY.current;

      if (isScrollingDown) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;

      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
    },
    [setVisible]
  );

  const handleMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}`);
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
    <ThemedView style={{ flex: 1 }}>
      <ScrollView
        style={styles.screenContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16} // Important for smooth detection
      >
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
    </ThemedView>
  );
}
