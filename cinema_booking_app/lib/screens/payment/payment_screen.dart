import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/booking_provider.dart';
import '../../providers/fnb_provider.dart';
import '../../widgets/countdown_banner.dart';
import 'bank_transfer_screen.dart';
import 'card_payment_screen.dart';
import 'ewallet_screen.dart';

class PaymentScreen extends StatefulWidget {
  static const routeName = '/payment';
  final int remainingSeconds;

  const PaymentScreen({super.key, required this.remainingSeconds});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  Timer? _timer;
  late DateTime _expiryTime;
  int _remainingSeconds = 0;

  @override
  void initState() {
    super.initState();
    _expiryTime = DateTime.now().add(
      Duration(seconds: widget.remainingSeconds),
    );
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      final diff = _expiryTime.difference(DateTime.now()).inSeconds;
      if (diff <= 0) {
        timer.cancel();
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

  @override
  void dispose() {
    _cancelTimer();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        await _confirmAndCancel();
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text("Payment"),
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
                padding: const EdgeInsets.all(16),
                children: [
                  Text(
                    "How would you like to make payment?\nKindly select your preferred option",
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 20),
                  Container(
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          leading: const Icon(Icons.credit_card),
                          title: const Text("Credit / Debit Card"),
                          onTap: () {
                            _cancelTimer();
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => CardPaymentScreen(expiryTime: _expiryTime),
                              ),
                            ).then((_) {
                              if (!mounted) return;
                              _startTimer();
                            });
                          },
                        ),
                        const Divider(height: 1),
                        ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          leading: const Icon(Icons.account_balance),
                          title: const Text("Bank Transfer"),
                          onTap: () {
                            _cancelTimer();
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => BankTransferScreen(expiryTime: _expiryTime),
                              ),
                            ).then((_) {
                              if (!mounted) return;
                              _startTimer();
                            });
                          },
                        ),
                        const Divider(height: 1),
                        ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          leading: const Icon(Icons.account_balance_wallet),
                          title: const Text("E-Wallet"),
                          onTap: () {
                            _cancelTimer();
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => EWalletScreen(expiryTime: _expiryTime),
                              ),
                            ).then((_) {
                              if (!mounted) return;
                              _startTimer();
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
