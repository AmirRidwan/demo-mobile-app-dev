import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../models/booking.dart';
import '../../../widgets/main/cutout_divider.dart';

class TicketDetailScreen extends StatelessWidget {
  final Booking booking;

  const TicketDetailScreen({super.key, required this.booking});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    DateTime? showDateTime;
    try {
      showDateTime = DateFormat(
        "yyyy-MM-dd hh:mm a",
      ).parse("${booking.showtime.date} ${booking.showtime.time}");
    } catch (_) {
      showDateTime = null;
    }

    final formattedShowtime = showDateTime != null
        ? DateFormat('EEE, dd MMM yyyy • hh:mm a').format(showDateTime)
        : "${booking.showtime.date} ${booking.showtime.time}";

    return Scaffold(
      backgroundColor: scheme.surface,
      appBar: AppBar(title: const Text("Ticket Details")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Container(
          decoration: BoxDecoration(
            color: scheme.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: scheme.shadow, // theme-adaptive shadow
                blurRadius: 6,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        booking.movie.posterUrl,
                        width: 95,
                        height: 130,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            booking.movie.title,
                            style: theme.textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: scheme.onSurface,
                            ),
                          ),
                          const SizedBox(height: 4),
                          if (booking.movie.genres.isNotEmpty)
                            Text(
                              booking.movie.genres.join(", "),
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: scheme.onSurfaceVariant,
                              ),
                            ),
                          const SizedBox(height: 12),
                          Text(
                            "${booking.showtime.hallType} ${booking.showtime.hall}",
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: scheme.onSurfaceVariant,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            formattedShowtime,
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: scheme.primary,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Icon(
                                Icons.location_on,
                                size: 18,
                                color: scheme.primary,
                              ),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  booking.showtime.location,
                                  style: theme.textTheme.bodyMedium?.copyWith(
                                    color: scheme.onSurface,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const CutoutDivider(),

              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Seats", style: theme.textTheme.titleMedium),
                    const SizedBox(height: 4),
                    Text(
                      booking.seats.isEmpty ? "N/A" : booking.seats.join(", "),
                      style: theme.textTheme.bodyLarge?.copyWith(
                        fontWeight: FontWeight.w600,
                        color: scheme.onSurface,
                      ),
                    ),
                    const SizedBox(height: 16),

                    Text(
                      "Food & Beverages",
                      style: theme.textTheme.titleMedium,
                    ),
                    const SizedBox(height: 4),
                    booking.food.isEmpty
                        ? Text("N/A", style: theme.textTheme.bodyMedium)
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: booking.food.map((item) {
                              return Padding(
                                padding: const EdgeInsets.symmetric(
                                  vertical: 2,
                                ),
                                child: Text(
                                  "${item['name']} x${item['quantity']} - RM ${item['price']}",
                                  style: theme.textTheme.bodyLarge?.copyWith(
                                    color: scheme.onSurface,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                    const SizedBox(height: 16),

                    Text("Total", style: theme.textTheme.titleMedium),
                    const SizedBox(height: 4),
                    Text(
                      "RM ${booking.totalAmount.toStringAsFixed(2)}",
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: scheme.primary,
                      ),
                    ),
                  ],
                ),
              ),

              const CutoutDivider(),

              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: QrImageView(
                        data: booking.id,
                        version: QrVersions.auto,
                        size: 160,
                        backgroundColor: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "Booking ID: ${booking.id}",
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: scheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
