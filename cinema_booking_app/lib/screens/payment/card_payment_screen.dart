import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/movie.dart';
import '../../providers/booking_provider.dart';
import '../../providers/fnb_provider.dart';
import '../../providers/movies_provider.dart';
import '../../widgets/countdown_banner.dart';
import 'payment_success_screen.dart';

class CardPaymentScreen extends StatefulWidget {
  final DateTime expiryTime;

  const CardPaymentScreen({super.key, required this.expiryTime});

  @override
  State<CardPaymentScreen> createState() => _CardPaymentScreenState();
}

class _CardPaymentScreenState extends State<CardPaymentScreen> {
  Timer? _timer;
  late DateTime _expiryTime;
  int _remainingSeconds = 0;
  bool _isProcessing = false;

  final _formKey = GlobalKey<FormState>();
  final _cardNumberController = TextEditingController();
  final _expiryController = TextEditingController();
  final _cvvController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _expiryTime = widget.expiryTime;
    _startTimer();

    _expiryController.addListener(() {
      final text = _expiryController.text;
      if (text.length == 2 && !text.contains("/")) {
        _expiryController.text = "$text/";
        _expiryController.selection = TextSelection.fromPosition(
          TextPosition(offset: _expiryController.text.length),
        );
      }
    });
  }

  @override
  void dispose() {
    _cancelTimer();
    super.dispose();
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      final diff = _expiryTime.difference(DateTime.now()).inSeconds;
      if (diff <= 0) {
        timer.cancel();
        _handleTimeout();
      } else {
        setState(() => _remainingSeconds = diff);
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
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(message)));
    });
  }

  void _handleTimeout() {
    if (!mounted) return;
    _cancelTimer();
    _resetBookingAndReturnHome("Session expired");
  }

  Future<void> _processPayment() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isProcessing = true);
    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return;

    final booking = context.read<BookingProvider>();
    final fnb = context.read<FnbProvider>();
    final movies = context.read<MoviesProvider>().movies;

    _cancelTimer();

    Movie? movie;
    if (movies.isNotEmpty) {
      movie = movies.firstWhere(
        (m) => m.showtimes.any((s) => s.id == booking.selectedShowtime?.id),
        orElse: () => movies.first,
      );
    }

    if (movie != null) {
      booking.saveBooking(movie);
    }

    fnb.clearSelections();

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const PaymentSuccessScreen()),
      (route) => route.isFirst,
    );
  }

  @override
  Widget build(BuildContext context) {
    final booking = context.watch<BookingProvider>();

    final totalPrice = booking.totalAmount;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (!didPop) {
          Navigator.pop(context);
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text("Card payment"),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: Column(
          children: [
            CountdownBanner(remainingSeconds: _remainingSeconds),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Form(
                  key: _formKey,
                  child: ListView(
                    children: [
                      const Text(
                        "Please enter your card details",
                        style: TextStyle(fontSize: 16),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _cardNumberController,
                        decoration: const InputDecoration(
                          labelText: "Card number",
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return "Enter card number";
                          }
                          if (value.replaceAll(" ", "").length < 16) {
                            return "Invalid card number";
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _expiryController,
                              decoration: const InputDecoration(
                                labelText: "MM/YY",
                                border: OutlineInputBorder(),
                              ),
                              keyboardType: TextInputType.number,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return "Enter expiry date";
                                }
                                final regex = RegExp(
                                  r'^(0[1-9]|1[0-2])/\d{2}$',
                                );
                                if (!regex.hasMatch(value)) {
                                  return "Invalid expiry";
                                }
                                return null;
                              },
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: TextFormField(
                              controller: _cvvController,
                              decoration: const InputDecoration(
                                labelText: "CVV",
                                border: OutlineInputBorder(),
                              ),
                              keyboardType: TextInputType.number,
                              obscureText: true,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return "Enter CVV";
                                }
                                if (value.length < 3) {
                                  return "Invalid CVV";
                                }
                                return null;
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: _isProcessing ? null : _processPayment,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Theme.of(context).colorScheme.primary,
                            foregroundColor: Theme.of(context).colorScheme.onPrimary,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: _isProcessing
                              ? SizedBox(
                            height: 24,
                            width: 24,
                            child: CircularProgressIndicator(
                              color: Theme.of(context).colorScheme.onPrimary,
                              strokeWidth: 2,
                            ),
                          )
                              : Text(
                            "Pay RM ${totalPrice.toStringAsFixed(2)}",
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
