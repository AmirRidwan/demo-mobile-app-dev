import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/movies_provider.dart';
import '../../widgets/movie_detail/movie_back_button.dart';
import '../../widgets/movie_detail/movie_details_container.dart';
import '../../widgets/movie_detail/movie_trailer_section.dart';
import '../../widgets/one_button.dart';
import '../ticket_booking/ticket_booking_screen.dart';

class MovieDetailScreen extends StatelessWidget {
  static const routeName = '/movie';
  const MovieDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    final movieId = ModalRoute.of(context)!.settings.arguments as int;
    final movie = context.watch<MoviesProvider>().movies
        .firstWhere((m) => m.id == movieId);

    final trailerHeight = MediaQuery.of(context).size.width * 9 / 16;

    return Scaffold(
      backgroundColor: scheme.surface,
      body: Stack(
        children: [
          MovieTrailerSection(movie: movie, trailerHeight: trailerHeight),
          MovieDetailsContainer(movie: movie, trailerHeight: trailerHeight),
          const MovieBackButton(),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: OneButton(
            label: "Book Ticket",
            onPressed: () {
              Navigator.pushNamed(
                context,
                TicketBookingScreen.routeName,
                arguments: movie.id,
              );
            },
          ),
        ),
      ),
    );
  }
}
