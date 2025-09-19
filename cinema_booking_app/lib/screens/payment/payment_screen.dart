import 'package:flutter/material.dart';

import '../../widgets/countdown_banner.dart';
import 'bank_transfer_screen.dart';
import 'card_payment_screen.dart';
import 'ewallet_screen.dart';

class PaymentScreen extends StatefulWidget {
  final DateTime expiryTime;
  final VoidCallback onCancel;
  final VoidCallback onSuccess;

  const PaymentScreen({
    super.key,
    required this.expiryTime,
    required this.onCancel,
    required this.onSuccess,
  });

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  String? _selectedMethod;

  Widget _buildPaymentOptions() {
    return ListView(
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
            boxShadow: const [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 4,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Icons.credit_card),
                title: const Text("Credit / Debit Card"),
                onTap: () => setState(() => _selectedMethod = "card"),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.account_balance),
                title: const Text("Bank Transfer"),
                onTap: () => setState(() => _selectedMethod = "bank"),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.account_balance_wallet),
                title: const Text("E-Wallet"),
                onTap: () => setState(() => _selectedMethod = "ewallet"),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMethodScreen() {
    switch (_selectedMethod) {
      case "card":
        return CardPaymentScreen(
          expiryTime: widget.expiryTime,
          onSuccess: widget.onSuccess,
        );
      case "bank":
        return BankTransferScreen(
          expiryTime: widget.expiryTime,
          onSuccess: widget.onSuccess,
        );
      case "ewallet":
        return EWalletScreen(
          expiryTime: widget.expiryTime,
          onSuccess: widget.onSuccess,
        );
      default:
        return _buildPaymentOptions();
    }
  }

  String _getMethodTitle() {
    switch (_selectedMethod) {
      case "card":
        return "Credit / Debit Card";
      case "bank":
        return "Bank Transfer";
      case "ewallet":
        return "E-Wallet";
      default:
        return "Payment";
    }
  }

  @override
  Widget build(BuildContext context) {
    final remainingSeconds =
        widget.expiryTime.difference(DateTime.now()).inSeconds;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        setState(() => _selectedMethod = null);
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(_getMethodTitle()),
          leading: _selectedMethod != null
              ? IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: () {
                    setState(() => _selectedMethod = null);
                  },
                )
              : null,
        ),
        body: Column(
          children: [
            CountdownBanner(remainingSeconds: remainingSeconds),
            Expanded(child: _buildMethodScreen()),
          ],
        ),
      ),
    );
  }
}
