import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../models/movie.dart';
import '../../../providers/movies_provider.dart';
import '../shimmer_box.dart';

class MovieInfoSection extends StatelessWidget {
  final Movie movie;

  const MovieInfoSection({super.key, required this.movie});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Image.network(
            movie.posterUrl,
            height: 140,
            width: 100,
            fit: BoxFit.cover,
            loadingBuilder: (context, child, loadingProgress) {
              if (loadingProgress == null) return child;
              return const ShimmerBox(width: 100, height: 140);
            },
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Expanded(
                    child: Text(
                      movie.title,
                      style: textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Consumer<MoviesProvider>(
                    builder: (context, provider, _) => IconButton(
                      icon: Icon(
                        movie.isFavorite
                            ? Icons.favorite
                            : Icons.favorite_border,
                        color: movie.isFavorite ? Colors.red : Colors.grey,
                      ),
                      onPressed: () => provider.toggleFavorite(movie),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 6,
                runSpacing: 4,
                children: movie.genres
                    .map(
                      (g) => Chip(label: Text(g, style: textTheme.bodySmall)),
                    )
                    .toList(),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 12,
                children: [
                  _iconText(context, Icons.calendar_today, movie.releaseDate),
                  _iconText(context, Icons.label, movie.rating),
                  _iconText(
                    context,
                    Icons.access_time,
                    "${movie.durationMin} min",
                  ),
                ],
              ),
              const SizedBox(height: 8),
              _buildRatingRow(context),
            ],
          ),
        ),
      ],
    );
  }

  Widget _iconText(BuildContext context, IconData icon, String text) {
    final scheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: scheme.onSurfaceVariant),
        const SizedBox(width: 4),
        Text(text, style: textTheme.bodyMedium),
      ],
    );
  }

  Widget _buildRatingRow(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    final rating = movie.ratingValue.clamp(0, 5).toDouble();
    final fullStars = rating.floor();
    final halfStar = (rating - fullStars) >= 0.5;
    final emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return Padding(
      padding: const EdgeInsets.only(left: 2),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          ...List.generate(
            fullStars,
            (_) => const Padding(
              padding: EdgeInsets.symmetric(horizontal: 1),
              child: Icon(Icons.star, size: 18, color: Colors.amber),
            ),
          ),
          if (halfStar)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 1),
              child: Icon(Icons.star_half, size: 18, color: Colors.amber),
            ),
          ...List.generate(
            emptyStars,
            (_) => const Padding(
              padding: EdgeInsets.symmetric(horizontal: 1),
              child: Icon(Icons.star_border, size: 18, color: Colors.amber),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            "${rating.toStringAsFixed(1)}/5",
            style: textTheme.bodyMedium?.copyWith(
              color: scheme.onSurface,
              fontWeight: FontWeight.w500,
            ),
          ),
          if (movie.reviewCount > 0) ...[
            const SizedBox(width: 4),
            Text(
              "(${movie.reviewCount})",
              style: textTheme.bodySmall?.copyWith(
                color: scheme.onSurfaceVariant,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
