import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../../models/movie.dart';
import '../../providers/booking_provider.dart';
import '../../providers/fnb_provider.dart';
import '../../providers/movies_provider.dart';
import '../../widgets/countdown_banner.dart';
import 'payment_success_screen.dart';

class EWalletScreen extends StatefulWidget {
  final DateTime expiryTime;

  const EWalletScreen({super.key, required this.expiryTime});

  @override
  State<EWalletScreen> createState() => _EWalletScreenState();
}

class _EWalletScreenState extends State<EWalletScreen> {
  Timer? _timer;
  late DateTime _expiryTime;
  int _remainingSeconds = 0;
  bool _isProcessing = false;
  String? _selectedWallet;

  final List<String> _wallets = [
    'GrabPay',
    'Touch \'n Go',
    'ShopeePay',
    'Boost',
  ];

  @override
  void initState() {
    super.initState();
    _expiryTime = widget.expiryTime;
    _startTimer();
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

    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        Navigator.popUntil(context, (route) => route.isFirst);
      }
    });
  }

  void _handleTimeout() {
    _resetBookingAndReturnHome("Session expired. Seats released.");
  }

  Future<void> _processPayment() async {
    if (_selectedWallet == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please select an e-wallet")),
      );
      return;
    }

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

  Widget _buildWalletOption(String wallet) {
    final isSelected = _selectedWallet == wallet;
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 3,
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        leading: Icon(
          Icons.account_balance_wallet,
          color: isSelected
              ? Theme.of(context).colorScheme.primary
              : Colors.grey,
        ),
        title: Text(wallet),
        trailing: isSelected
            ? const Icon(Icons.check, color: Colors.green)
            : null,
        onTap: () {
          setState(() {
            _selectedWallet = wallet;
          });
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("E-Wallet Payment"),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          CountdownBanner(remainingSeconds: _remainingSeconds),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    "Select your preferred e-wallet and confirm the payment:",
                    style: TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 16),
                  ..._wallets.map(_buildWalletOption),
                  const SizedBox(height: 16),
                  Card(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            "Instructions",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            "After selecting your e-wallet, press 'Pay with E-Wallet'. "
                            "Follow your e-wallet app to complete the payment.",
                            style: TextStyle(fontSize: 14, height: 1.4),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
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
                        : const Text(
                      "Pay with E-Wallet",
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
