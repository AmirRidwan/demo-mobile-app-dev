import 'package:flutter/material.dart';

class FnbTabBar extends StatelessWidget implements PreferredSizeWidget {
  final TabController tabController;
  final Map<String, String> tabCategoryMap;

  const FnbTabBar({
    super.key,
    required this.tabController,
    required this.tabCategoryMap,
  });

  @override
  Widget build(BuildContext context) {
    return TabBar(
      controller: tabController,
      tabs: tabCategoryMap.keys.map((tab) => Tab(text: tab)).toList(),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
