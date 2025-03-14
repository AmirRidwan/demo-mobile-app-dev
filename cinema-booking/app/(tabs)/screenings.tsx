import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Screening } from "@/app/types";

export default function ScreeningsScreen() {
  const [date, setDate] = useState(new Date());
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    fetchScreenings();
  }, [date]);

  const fetchScreenings = async () => {
    try {
      setLoading(true);
      const formattedDate = date.toISOString().split("T")[0];
      const response = await fetch(
        `http://localhost:3000/api/screenings?date=${formattedDate}`
      );
      const data = await response.json();
      setScreenings(data);
    } catch (error) {
      console.error("Error fetching screenings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScreeningPress = (screeningId: number) => {
    router.push(`/booking/${screeningId}`);
  };

  const renderScreeningItem = ({ item }: { item: Screening }) => (
    <TouchableOpacity
      style={styles.screeningCard}
      onPress={() => handleScreeningPress(item.id)}
      activeOpacity={0.8}
    >
      <ThemedView style={styles.timeContainer}>
        <ThemedText type="defaultSemiBold" style={styles.time}>
          {item.time}
        </ThemedText>
        <ThemedText>{item.hall}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.screeningInfo}>
        <ThemedText type="subtitle">Movie {item.movieId}</ThemedText>
        <ThemedText>
          Available seats:{" "}
          {item.availableSeats.filter((seat) => !seat.isBooked).length}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Screenings</ThemedText>
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
          style={styles.datePicker}
        />
      </ThemedView>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].tint}
          style={styles.loader}
        />
      ) : screenings.length > 0 ? (
        <FlatList
          data={screenings}
          renderItem={renderScreeningItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.screeningList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ThemedView style={styles.noScreenings}>
          <ThemedText type="subtitle">
            No screenings available for this date
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
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
  datePicker: {
    marginTop: 8,
  },
  screeningList: {
    paddingBottom: 24,
  },
  screeningCard: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeContainer: {
    width: 100,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaeaea",
  },
  time: {
    fontSize: 18,
    marginBottom: 4,
  },
  screeningInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noScreenings: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
