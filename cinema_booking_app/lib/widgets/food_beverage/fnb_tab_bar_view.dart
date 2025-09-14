import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/fnb_provider.dart';
import '../../widgets/food_beverage/item_card.dart';

class FnbTabBarView extends StatelessWidget {
  final TabController tabController;
  final Map<String, String> tabCategoryMap;
  final int crossAxisCount;
  final double childAspectRatio;

  const FnbTabBarView({
    super.key,
    required this.tabController,
    required this.tabCategoryMap,
    required this.crossAxisCount,
    required this.childAspectRatio,
  });

  @override
  Widget build(BuildContext context) {
    final fnb = context.watch<FnbProvider>();

    return TabBarView(
      controller: tabController,
      children: tabCategoryMap.entries.map((entry) {
        final category = entry.value;
        final filteredItems = fnb.items
            .where(
              (item) => item.category.toLowerCase() == category.toLowerCase(),
            )
            .toList();

        if (filteredItems.isEmpty) {
          return const Center(child: Text("No items available"));
        }

        return GridView.builder(
          padding: const EdgeInsets.all(12),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: childAspectRatio,
          ),
          itemCount: filteredItems.length,
          itemBuilder: (context, index) {
            final item = filteredItems[index];
            final qty = fnb.selections[item.id] ?? 0;

            return ItemCard(
              item: item,
              quantity: qty,
              onAdd: () => fnb.updateSelection(item.id, qty + 1),
              onRemove: qty > 0
                  ? () => fnb.updateSelection(item.id, qty - 1)
                  : null,
            );
          },
        );
      }).toList(),
    );
  }
}
