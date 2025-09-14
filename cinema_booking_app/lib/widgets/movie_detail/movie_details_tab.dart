import 'package:flutter/material.dart';
import '../../../models/movie.dart';

class MovieDetailsTab extends StatelessWidget {
  final Movie movie;

  const MovieDetailsTab({super.key, required this.movie});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        ListTile(
          title: Text("Full synopsis", style: textTheme.titleMedium),
          subtitle: Text(movie.synopsis),
        ),
        const Divider(),
        ListTile(
          title: Text("Casts", style: textTheme.titleMedium),
          subtitle: Text(movie.casts.join(", ")),
        ),
        const Divider(),
        ListTile(
          title: Text("Director", style: textTheme.titleMedium),
          subtitle: Text(movie.director),
        ),
        const Divider(),
        ListTile(
          title: Text("Writers", style: textTheme.titleMedium),
          subtitle: Text(movie.writers.join(", ")),
        ),
      ],
    );
  }
}
