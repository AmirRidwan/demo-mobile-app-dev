import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/movie.dart';
import '../../providers/booking_provider.dart';
import '../../providers/fnb_provider.dart';
import '../../providers/movies_provider.dart';

class CardPaymentScreen extends StatefulWidget {
  final DateTime expiryTime;
  final VoidCallback onSuccess;

  const CardPaymentScreen({
    super.key, 
    required this.expiryTime, 
    required this.onSuccess,
  });

  @override
  State<CardPaymentScreen> createState() => _CardPaymentScreenState();
}

class _CardPaymentScreenState extends State<CardPaymentScreen> {
  bool _isProcessing = false;

  final _formKey = GlobalKey<FormState>();
  final _cardNumberController = TextEditingController();
  final _expiryController = TextEditingController();
  final _cvvController = TextEditingController();

  @override
  void initState() {
    super.initState();

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
    _cardNumberController.dispose();
    _expiryController.dispose();
    _cvvController.dispose();
    super.dispose();
  }

  Future<void> _processPayment() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isProcessing = true);
    await Future.delayed(const Duration(seconds: 2));

    final booking = context.read<BookingProvider>();
    final fnb = context.read<FnbProvider>();
    final movies = context.read<MoviesProvider>().movies;

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

    widget.onSuccess();
  }

  @override
  Widget build(BuildContext context) {
    final booking = context.watch<BookingProvider>();
    final totalPrice = booking.totalAmount;

    return Padding(
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
                      final regex = RegExp(r'^(0[1-9]|1[0-2])/\d{2}$');
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
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
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
