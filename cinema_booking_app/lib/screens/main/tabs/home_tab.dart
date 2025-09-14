import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/movies_provider.dart';
import '../../../widgets/main/movie_card.dart';
import '../../../widgets/main/movie_search_bar.dart';
import '../../movie_detail/movie_detail_screen.dart';

class HomeTab extends StatelessWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    final moviesProv = context.watch<MoviesProvider>();
    final movies = moviesProv.filteredMovies;

    return Column(
      children: [
        MovieSearchBar(
          query: moviesProv.query,
          onChanged: moviesProv.setQuery,
          onClear: () => moviesProv.setQuery(""),
        ),
        Expanded(
          child: moviesProv.loading
              ? const Center(child: CircularProgressIndicator())
              : moviesProv.error != null
              ? Center(child: Text('Error: ${moviesProv.error}'))
              : movies.isEmpty
              ? const Center(child: Text("No movies found"))
              : ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: movies.length,
            separatorBuilder: (_, __) =>
            const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final m = movies[index];
              return MovieCard(
                movie: m,
                onTap: () => Navigator.pushNamed(
                  context,
                  MovieDetailScreen.routeName,
                  arguments: m.id,
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
