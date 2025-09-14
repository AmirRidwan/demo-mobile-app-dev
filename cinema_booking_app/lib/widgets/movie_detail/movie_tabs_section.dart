import 'package:flutter/material.dart';
import '../../../models/movie.dart';
import 'movie_details_tab.dart';
import 'movie_reviews_tab.dart';

class MovieTabsSection extends StatelessWidget {
  final Movie movie;

  const MovieTabsSection({super.key, required this.movie});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Expanded(
      child: Column(
        children: [
          TabBar(
            labelColor: scheme.primary,
            unselectedLabelColor: scheme.onSurface.withValues(alpha: 0.6),
            tabs: const [
              Tab(text: "Movie Details"),
              Tab(text: "Ratings & Reviews"),
            ],
          ),
          Expanded(
            child: TabBarView(
              children: [
                MovieDetailsTab(movie: movie),
                MovieReviewsTab(movie: movie),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
