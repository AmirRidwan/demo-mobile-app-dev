import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/booking_provider.dart';
import '../../providers/fnb_provider.dart';
import '../../providers/movies_provider.dart';
import '../../models/movie.dart';
import '../../widgets/booking_summary/combined_section.dart';
import '../../widgets/booking_summary/ticket_card.dart';
import '../../widgets/countdown_banner.dart';
import '../../widgets/one_button.dart';
import '../payment/payment_screen.dart';

class BookingSummaryScreen extends StatefulWidget {
  static const routeName = '/booking-summary';

  const BookingSummaryScreen({super.key});

  @override
  State<BookingSummaryScreen> createState() => _BookingSummaryScreenState();
}

class _BookingSummaryScreenState extends State<BookingSummaryScreen> {
  Timer? _timer;
  late DateTime _expiryTime;
  int _remainingSeconds = 0;

  @override
  void initState() {
    super.initState();
    _initBooking();
  }

  Future<void> _initBooking() async {
    final booking = context.read<BookingProvider>();

    if (!booking.hasActiveLock) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("No active seat lock. Please reselect.")),
        );
        Navigator.pop(context);
      });
      return;
    }

    _expiryTime = DateTime.now().add(
      Duration(seconds: booking.holdDurationSeconds),
    );

    _startTimer();
  }

  void _startTimer() {
  _timer?.cancel();
  _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
    final diff = _expiryTime.difference(DateTime.now()).inSeconds;
    if (diff <= 0) {
      timer.cancel();
      if (!mounted) return;
      _handleTimeout();
    } else {
      if (mounted) {
        setState(() => _remainingSeconds = diff);
      }
    }
  });
}

  void _cancelTimer() {
    _timer?.cancel();
    _timer = null;
  }

  void _resetBookingAndReturnHome(String message) {
    final booking = context.read<BookingProvider>();
    final fnb = context.read<FnbProvider>();

    booking.cancelBooking();
    fnb.clearSelections();

    if (!mounted) return;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      Navigator.popUntil(context, (route) => route.isFirst);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message)),
      );
    });
  }

  void _handleTimeout() {
    if (!mounted) return;
    _cancelTimer();
    _resetBookingAndReturnHome("Session expired");
  }

  Future<void> _confirmAndCancel() async {
    if (!mounted) return;

    final confirmed = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        title: const Text("Cancel Booking"),
        content: const Text("Are you sure you want to cancel your booking?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text("No"),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text("Yes"),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      _cancelTimer();
      _resetBookingAndReturnHome("Booking cancelled");
    }
  }

  Future<void> _handleConfirm() async {
    if (!mounted) return;
    _cancelTimer();
    Navigator.push<int>(
      context,
      MaterialPageRoute(
        builder: (_) => PaymentScreen(
          remainingSeconds: _expiryTime.difference(DateTime.now()).inSeconds,
        ),
      ),
    ).then((_) {
      if (!mounted) return;
      _startTimer();
    });
  }

  @override
  void dispose() {
    _cancelTimer();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final booking = context.watch<BookingProvider>();
    final movies = context.watch<MoviesProvider>().movies;
    final scheme = Theme.of(context).colorScheme;

    Movie? movie;
    if (movies.isNotEmpty) {
      movie = movies.firstWhere(
            (m) => m.showtimes.any((s) => s.id == booking.selectedShowtime?.id),
        orElse: () => movies.first,
      );
    }

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        await _confirmAndCancel();
      },
      child: Scaffold(
        backgroundColor: scheme.surface,
        appBar: AppBar(
          title: const Text("Booking Summary"),
          centerTitle: true,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: _confirmAndCancel,
          ),
        ),
        body: Column(
          children: [
            CountdownBanner(remainingSeconds: _remainingSeconds),
            Expanded(
              child: ListView(
                children: [
                  TicketCard(movie: movie, booking: booking),
                  CombinedSection(booking: booking),
                ],
              ),
            ),
          ],
        ),
        bottomNavigationBar: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: OneButton(
              label: "Proceed to payment",
              onPressed: _handleConfirm,
            ),
          ),
        ),
      ),
    );
  }
}
