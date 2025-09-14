import 'package:flutter/material.dart';
import '../../models/fnb_item.dart';
import '../shimmer_box.dart';

class ItemCard extends StatelessWidget {
  final FnbItem item;
  final int quantity;
  final VoidCallback onAdd;
  final VoidCallback? onRemove;

  const ItemCard({
    super.key,
    required this.item,
    required this.quantity,
    required this.onAdd,
    this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            /// Item image
            AspectRatio(
              aspectRatio: 1,
              child: item.image.isNotEmpty
                  ? Image.network(
                      item.image,
                      fit: BoxFit.contain,
                      loadingBuilder: (context, child, loadingProgress) {
                        if (loadingProgress == null) return child;
                        return const ShimmerBox(width: 100, height: 140);
                      },
                    )
                  : const Icon(Icons.fastfood, size: 50),
            ),

            const SizedBox(height: 6),

            // Item name
            Text(
              item.name,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),

            // Item description
            if (item.description.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                item.description,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],

            const Spacer(),

            // Price (left) + Quantity (right)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                /// Price
                Text(
                  "RM ${item.price.toStringAsFixed(2)}",
                  style: Theme.of(
                    context,
                  ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold),
                ),

                // Quantity controls
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _smallIconButton(icon: Icons.remove, onPressed: onRemove),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      child: Text(
                        quantity.toString(),
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    _smallIconButton(icon: Icons.add, onPressed: onAdd),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _smallIconButton({
    required IconData icon,
    required VoidCallback? onPressed,
  }) {
    return SizedBox(
      width: 28,
      height: 28,
      child: IconButton(
        padding: EdgeInsets.zero,
        iconSize: 18,
        onPressed: onPressed,
        icon: Icon(icon),
      ),
    );
  }
}
