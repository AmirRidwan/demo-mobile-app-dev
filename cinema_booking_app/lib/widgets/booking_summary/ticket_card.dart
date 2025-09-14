import 'package:flutter/material.dart';
import '../../../models/movie.dart';
import '../../../providers/booking_provider.dart';
import '../shimmer_box.dart';
import '../../../widgets/main/cutout_divider.dart';

class TicketCard extends StatelessWidget {
  final Movie? movie;
  final BookingProvider booking;

  const TicketCard({
    super.key,
    required this.movie,
    required this.booking,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: scheme.secondary.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: scheme.onSurface.withValues(alpha: 0.05),
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
                    movie?.posterUrl ?? "",
                    height: 130,
                    width: 95,
                    fit: BoxFit.cover,
                    loadingBuilder: (context, child, loadingProgress) {
                      if (loadingProgress == null) return child;
                      return const ShimmerBox(width: 95, height: 130);
                    },
                    errorBuilder: (_, __, ___) => Container(
                      height: 130,
                      width: 95,
                      color: scheme.surfaceContainerHighest,
                      child: const Icon(Icons.movie, size: 40),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        movie?.title ?? "-",
                        style: textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: scheme.onSurface,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 10),
                      Text(
                        "${(movie?.genres is List ? (movie?.genres as List).join(', ') : movie?.genres ?? '')}\n"
                            "${movie?.durationMin ?? 0} min\n"
                            "${movie?.rating ?? ''}\n"
                            "${booking.selectedShowtime?.hallType ?? ''} Tickets",
                        style: textTheme.bodyMedium?.copyWith(
                          color: scheme.onSurfaceVariant,
                          height: 1.4,
                        ),
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
                _ticketInfo("Cinema", booking.selectedShowtime?.location ?? "-", textTheme, scheme),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: _ticketInfo(
                        "Date",
                        booking.selectedDate != null
                            ? "${booking.selectedDate!.day}/${booking.selectedDate!.month}/${booking.selectedDate!.year}"
                            : "-",
                        textTheme,
                        scheme,
                      ),
                    ),
                    Expanded(
                      child: _ticketInfo(
                        "Seat",
                        booking.confirmedSeats.isEmpty ? "-" : booking.confirmedSeats.join(", "),
                        textTheme,
                        scheme,
                      ),
                    ),
                    Expanded(
                      child: _ticketInfo(
                        "Showtime",
                        booking.selectedShowtime?.time ?? "-",
                        textTheme,
                        scheme,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _ticketInfo(String title, String value, TextTheme textTheme, ColorScheme scheme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: textTheme.bodyMedium?.copyWith(color: scheme.onSurfaceVariant),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: textTheme.titleSmall?.copyWith(
            fontWeight: FontWeight.bold,
            color: scheme.onSurface,
          ),
        ),
      ],
    );
  }
}
