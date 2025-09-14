import 'package:flutter/material.dart';
import '../../../models/movie.dart';

class MovieReviewsTab extends StatelessWidget {
  final Movie movie;

  const MovieReviewsTab({super.key, required this.movie});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return ListView.separated(
      padding: const EdgeInsets.all(8),
      itemBuilder: (context, i) {
        final review = movie.reviews[i];
        return ListTile(
          leading: CircleAvatar(child: Text(review.author[0])),
          title: Text(review.author, style: textTheme.titleMedium),
          subtitle: Text(review.content),
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: List.generate(
              5,
              (index) => Icon(
                index < review.stars ? Icons.star : Icons.star_border,
                color: scheme.tertiary,
                size: 18,
              ),
            ),
          ),
        );
      },
      separatorBuilder: (_, __) => const Divider(),
      itemCount: movie.reviews.length,
    );
  }
}
