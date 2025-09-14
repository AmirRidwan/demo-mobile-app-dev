import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/booking_provider.dart';
import '../../providers/fnb_provider.dart';
import '../booking_summary/booking_summary_screen.dart';
import '../../widgets/food_beverage/fnb_tab_bar.dart';
import '../../widgets/food_beverage/fnb_tab_bar_view.dart';
import '../../widgets/food_beverage/fnb_summary_bar.dart';

class FoodBeverageScreen extends StatefulWidget {
  static const routeName = '/fnb';

  const FoodBeverageScreen({super.key});

  @override
  State<FoodBeverageScreen> createState() => _FoodBeverageScreenState();
}

class _FoodBeverageScreenState extends State<FoodBeverageScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final Map<String, String> tabCategoryMap = {
    "Combo": "Combo",
    "Food/Snacks": "Snack",
    "Beverages": "Beverage",
  };

  @override
  void initState() {
    super.initState();
    _tabController = TabController(
      length: tabCategoryMap.keys.length,
      vsync: this,
    );
    Future.microtask(
      () => context.read<FnbProvider>().loadFnb(forceRefresh: true),
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _proceedToSummary(
    BuildContext context,
    int movieId, {
    bool skip = false,
  }) async {
    final fnbProvider = context.read<FnbProvider>();
    final booking = context.read<BookingProvider>();

    if (skip) {
      fnbProvider.clearSelections();
      booking.setFoodSelections({}, fnbProvider.items);
    } else {
      booking.setFoodSelections(fnbProvider.selections, fnbProvider.items);
    }

    final success = await booking.confirmSeatSelection();
    if (!success) {
      if (!mounted) return;
      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text("Seat Unavailable"),
          content: const Text(
            "Some of your selected seats are no longer available.\n\nPlease go back and choose other seats.",
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("OK"),
            ),
          ],
        ),
      );
      return;
    }

    if (!mounted) return;
    Navigator.pushNamed(
      context,
      BookingSummaryScreen.routeName,
      arguments: movieId,
    );
  }

  @override
  Widget build(BuildContext context) {
    final fnb = context.watch<FnbProvider>();
    final movieId = ModalRoute.of(context)!.settings.arguments as int;
    final screenWidth = MediaQuery.of(context).size.width;

    int crossAxisCount = screenWidth > 1000
        ? 5
        : screenWidth > 800
        ? 4
        : screenWidth > 600
        ? 3
        : 2;

    double childAspectRatio = screenWidth > 1000
        ? 0.75
        : screenWidth > 600
        ? 0.7
        : 0.65;

    if (fnb.loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (fnb.error != null) {
      return Scaffold(body: Center(child: Text("Error: ${fnb.error}")));
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text("Food & Beverage"),
        actions: [
          TextButton(
            onPressed: () => _proceedToSummary(context, movieId, skip: true),
            child: Text(
              "Skip",
              style: TextStyle(color: Theme.of(context).colorScheme.primary),
            ),
          ),
        ],
        bottom: FnbTabBar(
          tabController: _tabController,
          tabCategoryMap: tabCategoryMap,
        ),
      ),
      body: FnbTabBarView(
        tabController: _tabController,
        tabCategoryMap: tabCategoryMap,
        crossAxisCount: crossAxisCount,
        childAspectRatio: childAspectRatio,
      ),
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.all(12),
        child: FnbSummaryBar(
          onProceed: () => _proceedToSummary(context, movieId),
        ),
      ),
    );
  }
}
