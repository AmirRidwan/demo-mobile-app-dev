import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Booking } from '@/types';

export default function SuccessPage() {
  const { id } = useLocalSearchParams();
  const bookingId = typeof id === 'string' ? id : '';
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, []);

  const loadBooking = async () => {
    try {
      const bookingsJson = await AsyncStorage.getItem('bookings');
      if (bookingsJson) {
        const bookings: Booking[] = JSON.parse(bookingsJson);
        const currentBooking = bookings.find(b => b.id === bookingId);
        if (currentBooking) {
          setBooking(currentBooking);
          
          // Mark booking as paid in AsyncStorage
          const updatedBookings = bookings.map(b => 
            b.id === bookingId ? {...b, paid: true, paymentDate: new Date().toISOString()} : b
          );
          await AsyncStorage.setItem('bookings', JSON.stringify(updatedBookings));
        }
      }
    } catch (error) {
      console.error('Error loading booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      </ThemedView>
    );
  }

  if (!booking) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText>Booking not found</ThemedText>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)')}>
          <ThemedText style={styles.buttonText}>Return to Home</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.successContainer}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>
        
        <ThemedText style={styles.successTitle}>Payment Successful!</ThemedText>
        <ThemedText style={styles.successMessage}>
          Your tickets have been confirmed and are ready.
        </ThemedText>
        
        <ThemedView style={styles.ticketContainer}>
          <ThemedView style={styles.ticketDetails}>
            <ThemedText style={styles.movieTitle}>{booking.movie.title}</ThemedText>
            <ThemedText>{booking.screening.date}</ThemedText>
            <ThemedText>{booking.screening.time} • {booking.screening.hall}</ThemedText>
            <ThemedText style={styles.seatsText}>Seats: {booking.seats.join(", ")}</ThemedText>
            <ThemedText style={styles.bookingId}>Booking ID: {booking.id.substring(8)}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.summaryContainer}>
          <ThemedText style={styles.summaryTitle}>Payment Summary</ThemedText>
          
          <View style={styles.summaryRow}>
            <ThemedText>Tickets ({booking.seats.length})</ThemedText>
            <ThemedText>${booking.subtotal?.toFixed(2)}</ThemedText>
          </View>
          
          {booking.fnbTotal && booking.fnbTotal > 0 && (
            <View style={styles.summaryRow}>
              <ThemedText>Food & Beverages</ThemedText>
              <ThemedText>${booking.fnbTotal?.toFixed(2)}</ThemedText>
            </View>
          )}
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <ThemedText style={styles.totalText}>Total Paid</ThemedText>
            <ThemedText style={styles.totalAmount}>
              ${((booking.subtotal || 0) + (booking.fnbTotal || 0)).toFixed(2)}
            </ThemedText>
          </View>
        </ThemedView>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.viewTicketsButton]} 
          onPress={() => router.push('/(tabs)/bookings')}
        >
          <ThemedText style={styles.buttonText}>View My Tickets</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.homeButton]} 
          onPress={() => router.push('/(tabs)')}
        >
          <ThemedText style={styles.buttonText}>Return to Home</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  successIconContainer: {
    marginVertical: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  ticketContainer: {
    width: '100%',
    borderRadius: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  ticketDetails: {
    width: '100%',
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  seatsText: {
    marginTop: 5,
  },
  bookingId: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
  },
  summaryContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontWeight: '600',
  },
  totalAmount: {
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 40,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: Colors.light.tint,
  },
  viewTicketsButton: {
    backgroundColor: Colors.light.tint,
  },
  homeButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});