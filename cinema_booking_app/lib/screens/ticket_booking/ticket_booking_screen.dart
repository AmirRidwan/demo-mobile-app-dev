import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/booking_provider.dart';
import '../../providers/movies_provider.dart';
import '../../widgets/ticket_booking/booking_summary.dart';
import '../../widgets/ticket_booking/date_selector.dart';
import '../../widgets/ticket_booking/hall_type_selector.dart';
import '../../widgets/ticket_booking/location_selector.dart';
import '../../widgets/ticket_booking/seat_grid.dart';
import '../../widgets/ticket_booking/time_selector.dart';
import '../../widgets/two_button.dart';
import '../food_beverage/food_beverage_screen.dart';

class TicketBookingScreen extends StatefulWidget {
  static const routeName = '/ticket-booking';

  const TicketBookingScreen({super.key});

  @override
  State<TicketBookingScreen> createState() => _TicketBookingScreenState();
}

class _TicketBookingScreenState extends State<TicketBookingScreen> {
  String? _selectedLocation;
  DateTime? _selectedDate;
  String? _selectedTime;
  Set<String> _selectedHallTypes = {};
  BookingProvider? _bookingProvider;

  final int rows = 8;
  final int cols = 10;

  @override
  void initState() {
    super.initState();
    _selectedDate = DateTime.now();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _bookingProvider = context.read<BookingProvider>();
  }

  @override
  void dispose() {
    _bookingProvider?.cancelBookingSilently();
    super.dispose();
  }

  String _dateKey(DateTime d) => d.toIso8601String().split('T')[0];

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final booking = context.watch<BookingProvider>();

    final movieId = ModalRoute.of(context)!.settings.arguments as int;
    final movie = context.watch<MoviesProvider>().movies.firstWhere(
      (m) => m.id == movieId,
    );

    final availableLocations = movie.showtimes
        .map((s) => s.location)
        .toSet()
        .toList();
    final availableHallTypes = movie.showtimes
        .map((s) => s.hallType)
        .toSet()
        .toList();

    final filteredShowtimes =
        (_selectedLocation == null || _selectedDate == null)
        ? <dynamic>[]
        : movie.showtimes.where((s) {
            return s.location == _selectedLocation &&
                s.date == _dateKey(_selectedDate!) &&
                (_selectedHallTypes.isEmpty ||
                    _selectedHallTypes.contains(s.hallType));
          }).toList();

    return Scaffold(
      appBar: AppBar(title: const Text("Ticket Booking")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text("Select cinema and showtime", style: textTheme.titleMedium),
          const SizedBox(height: 16),

          // Location
          LocationSelector(
            locations: availableLocations,
            selectedLocation: _selectedLocation,
            onChanged: (val) {
              setState(() {
                _selectedLocation = val;
                _selectedTime = null;
                _selectedHallTypes.clear();
                booking.cancelBooking();
              });
            },
          ),
          const SizedBox(height: 24),

          // Date Selector
          DateSelector(
            selectedDate: _selectedDate,
            onDateSelected: (date) {
              setState(() {
                _selectedDate = date;
                _selectedTime = null;
                _selectedHallTypes.clear();
                booking.cancelBooking();
              });
            },
          ),
          const SizedBox(height: 24),

          // Hall Types
          HallTypeSelector(
            hallTypes: availableHallTypes,
            selectedHallTypes: _selectedHallTypes,
            onChanged: (ht, selected) {
              setState(() {
                if (selected) {
                  _selectedHallTypes.add(ht);
                } else {
                  _selectedHallTypes.remove(ht);
                }
                _selectedTime = null;
                booking.cancelBooking();
              });
            },
          ),
          const SizedBox(height: 24),

          // Times
          TimeSelector(
            filteredShowtimes: filteredShowtimes,
            selectedTime: _selectedTime,
            onSelected: (label, selectedShowtime) {
              setState(() => _selectedTime = label);
              booking.cancelBooking();
              booking.selectShowtime(
                showtime: selectedShowtime,
                date: _selectedDate!,
              );
            },
          ),
          const SizedBox(height: 24),

          // Seats
          if (_selectedLocation != null &&
              _selectedDate != null &&
              _selectedTime != null) ...[
            SeatGrid(rows: rows, cols: cols),
            const SizedBox(height: 24),
          ],
        ],
      ),

      // Bottom
      bottomNavigationBar: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (booking.selectedSeats.isNotEmpty)
              BookingSummary(booking: booking),

            TwoButton(
              leftText: "Cancel",
              rightText: "Proceed",
              onLeftPressed: () {
                booking.cancelBooking();
                Navigator.pop(context);
              },
              onRightPressed:
                  (_selectedLocation == null ||
                      _selectedDate == null ||
                      _selectedTime == null ||
                      booking.selectedSeats.isEmpty)
                  ? null
                  : () {
                      final selectedShowtime = movie.showtimes.firstWhere(
                        (s) =>
                            s.location == _selectedLocation &&
                            s.date == _dateKey(_selectedDate!) &&
                            "${s.time} • ${s.hallType}" == _selectedTime,
                      );

                      booking.selectShowtime(
                        showtime: selectedShowtime,
                        date: _selectedDate!,
                      );

                      Navigator.pushNamed(
                        context,
                        FoodBeverageScreen.routeName,
                        arguments: movie.id,
                      );
                    },
            ),
          ],
        ),
      ),
    );
  }
}
