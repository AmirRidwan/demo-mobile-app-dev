import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/booking_provider.dart';
import '../../../models/seat.dart';
import 'legend.dart';

class SeatGrid extends StatelessWidget {
  final int rows;
  final int cols;

  const SeatGrid({super.key, required this.rows, required this.cols});

  String _seatId(int rowIdx, int colIdx) {
    final letter = String.fromCharCode('A'.codeUnitAt(0) + rowIdx);
    final number = colIdx + 1;
    return '$letter$number';
  }

  @override
  Widget build(BuildContext context) {
    final booking = context.watch<BookingProvider>();
    final scheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Column(
      children: [
        Text("Select Seat", style: textTheme.titleMedium),
        const SizedBox(height: 12),
        const Legend(),
        Container(
          margin: const EdgeInsets.symmetric(vertical: 16),
          child: Column(
            children: [
              Container(
                height: 20,
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(100),
                  ),
                  color: scheme.primary,
                ),
              ),
              const SizedBox(height: 8),
              const Text("Screen"),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Seat grid
        Column(
          children: List.generate(rows, (r) {
            final rowLetter = String.fromCharCode('A'.codeUnitAt(0) + r);
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // left label
                  SizedBox(width: 28, child: Center(child: Text(rowLetter))),
                  Expanded(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: List.generate(cols, (c) {
                        final seatId = _seatId(r, c);
                        final status = booking.seatStatus(seatId);
                        final isSelected = booking.selectedSeats.contains(
                          seatId,
                        );
                        final isUnavailable =
                            status == SeatStatus.locked ||
                            status == SeatStatus.booked;

                        Color bg;
                        Color fg;
                        if (isSelected) {
                          bg = Colors.green; // Selected
                          fg = Colors.white;
                        } else if (isUnavailable) {
                          bg = Colors.red.shade300; // Unavailable
                          fg = Colors.white;
                        } else {
                          bg = Colors.grey.shade300; // Available
                          fg = Colors.black;
                        }

                        return InkWell(
                          onTap: () {
                            if (!isUnavailable) {
                              booking.toggleSeat(seatId);
                            }
                          },
                          child: Container(
                            width: 28,
                            height: 28,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: bg,
                              borderRadius: BorderRadius.circular(4),
                              border: Border.all(color: Colors.black26),
                            ),
                            child: Text(
                              seatId,
                              style: textTheme.bodySmall?.copyWith(color: fg),
                            ),
                          ),
                        );
                      }),
                    ),
                  ),
                  // right label
                  SizedBox(width: 28, child: Center(child: Text(rowLetter))),
                ],
              ),
            );
          }),
        ),

        const SizedBox(height: 24),

        if (booking.selectedSeats.isNotEmpty) ...[
          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              "Seat: ${booking.selectedSeats.join(", ")}",
              style: textTheme.titleMedium,
            ),
          ),
        ],
      ],
    );
  }
}
