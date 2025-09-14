import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/movies_provider.dart';
import '../../../widgets/main/movie_card.dart';
import '../../movie_detail/movie_detail_screen.dart';

class FavoriteTab extends StatelessWidget {
  const FavoriteTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<MoviesProvider>(
      builder: (context, provider, _) {
        final favorites = provider.favorites;

        if (favorites.isEmpty) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.favorite_border,
                    size: 80,
                    color: Theme.of(
                      context,
                    ).colorScheme.primary.withValues(alpha: 0.6),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    "No favorite movies yet",
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: Colors.grey[700],
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Start exploring and add movies to your favorites!",
                    textAlign: TextAlign.center,
                    style: Theme.of(
                      context,
                    ).textTheme.bodyMedium?.copyWith(color: Colors.grey[500]),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pushNamedAndRemoveUntil(
                        context,
                        '/',
                        (route) => false,
                      );
                    },
                    icon: const Icon(Icons.movie),
                    label: const Text("Browse Movies"),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(8),
          itemCount: favorites.length,
          itemBuilder: (context, index) {
            final movie = favorites[index];
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: MovieCard(
                movie: movie,
                onTap: () {
                  Navigator.pushNamed(
                    context,
                    MovieDetailScreen.routeName,
                    arguments: movie.id,
                  );
                },
              ),
            );
          },
        );
      },
    );
  }
}
