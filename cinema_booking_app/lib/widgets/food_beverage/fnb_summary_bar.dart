import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/fnb_provider.dart';
import '../one_button.dart';

class FnbSummaryBar extends StatelessWidget {
  final VoidCallback? onProceed;

  const FnbSummaryBar({super.key, required this.onProceed});

  @override
  Widget build(BuildContext context) {
    return Consumer<FnbProvider>(
      builder: (context, fnb, _) {
        final totalItems = fnb.selections.values.fold<int>(
          0,
          (sum, qty) => sum + qty,
        );
        final totalPrice = fnb.items.fold<double>(
          0,
          (sum, item) => sum + (item.price * (fnb.selections[item.id] ?? 0)),
        );

        final theme = Theme.of(context);

        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceContainerHighest,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "ITEM",
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                      Text(
                        "$totalItems",
                        style: theme.textTheme.bodyLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        "SUB-TOTAL",
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                      Text(
                        "RM ${totalPrice.toStringAsFixed(2)}",
                        style: theme.textTheme.bodyLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            OneButton(
              label: "Proceed",
              onPressed: totalItems > 0 ? onProceed : null,
            ),
          ],
        );
      },
    );
  }
}
