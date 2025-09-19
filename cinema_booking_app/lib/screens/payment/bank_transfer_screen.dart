import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../../models/movie.dart';
import '../../providers/booking_provider.dart';
import '../../providers/fnb_provider.dart';
import '../../providers/movies_provider.dart';

class BankTransferScreen extends StatefulWidget {
  final DateTime expiryTime;
  final VoidCallback onSuccess;

  const BankTransferScreen({
    super.key, 
    required this.expiryTime,
    required this.onSuccess,
    });

  @override
  State<BankTransferScreen> createState() => _BankTransferScreenState();
}

class _BankTransferScreenState extends State<BankTransferScreen> {
  bool _isProcessing = false;

  Future<void> _processPayment() async {
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

  Widget _buildMovieDetails(Movie movie, BookingProvider booking) {
    final selectedSeats = booking.confirmedSeats.join(", ");
    final showtime = booking.selectedShowtime?.time ?? "";
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 16),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                movie.posterUrl,
                width: 80,
                height: 120,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    movie.title,
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 8),
                  Text("Showtime: $showtime"),
                  const SizedBox(height: 4),
                  Text("Seats: $selectedSeats"),
                  const SizedBox(height: 8),
                  Text(
                    "Total: RM ${booking.totalAmount.toStringAsFixed(2)}",
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBankInfoCard(BookingProvider booking) {
    const bankName = "Maybank";
    const accountNumber = "123-456-7890";
    const accountName = "Movie Tickets Sdn Bhd";
    final amount = booking.totalAmount.toStringAsFixed(2);

    // QR code data includes exact amount
    final qrData = "$bankName|$accountNumber|$accountName|$amount";

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 3,
      margin: const EdgeInsets.symmetric(vertical: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(bankName,
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: Text("Account Number: $accountNumber",
                      style: const TextStyle(fontSize: 16)),
                ),
                IconButton(
                  icon: const Icon(Icons.copy),
                  onPressed: () {
                    Clipboard.setData(const ClipboardData(text: accountNumber));
                    ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Account number copied")));
                  },
                )
              ],
            ),
            const SizedBox(height: 4),
            Text("Account Name: $accountName", style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 8),
            Text("Amount: RM $amount",
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            Center(
              child: SizedBox(
                width: 180,
                height: 180,
                child: QrImageView(
                  data: qrData,
                  version: QrVersions.auto,
                  size: 200.0,
                  backgroundColor: Colors.white,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text(
                "Instructions:\nScan the QR code or transfer the exact amount "
                    "to the bank account. Press 'Confirm Transfer' once done.",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.normal),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final booking = context.watch<BookingProvider>();
    final movies = context.read<MoviesProvider>().movies;
    final movie = movies.isNotEmpty
        ? movies.firstWhere(
            (m) => m.showtimes.any((s) => s.id == booking.selectedShowtime?.id),
            orElse: () => movies.first,
          )
        : null;

    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (movie != null) _buildMovieDetails(movie, booking),
                  _buildBankInfoCard(booking),
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
                      "Confirm Transfer",
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
