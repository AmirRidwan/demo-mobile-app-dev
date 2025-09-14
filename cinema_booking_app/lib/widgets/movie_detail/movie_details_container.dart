import 'package:flutter/material.dart';
import '../../../models/movie.dart';
import 'movie_info_section.dart';
import 'movie_tabs_section.dart';

class MovieDetailsContainer extends StatelessWidget {
  final Movie movie;
  final double trailerHeight;

  const MovieDetailsContainer({
    super.key,
    required this.movie,
    required this.trailerHeight,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Positioned(
      top: trailerHeight - 40,
      left: 0,
      right: 0,
      bottom: 0,
      child: Container(
        decoration: BoxDecoration(
          color: scheme.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          boxShadow: [
            BoxShadow(
              blurRadius: 10,
              color: scheme.shadow.withValues(alpha: 0.2),
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: DefaultTabController(
            length: 2,
            child: Column(
              children: [
                MovieInfoSection(movie: movie),
                const SizedBox(height: 16),
                MovieTabsSection(movie: movie),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
