import 'package:flutter/material.dart';
import 'package:youtube_player_iframe/youtube_player_iframe.dart';
import '../../../models/movie.dart';

class MovieTrailerSection extends StatefulWidget {
  final Movie movie;
  final double trailerHeight;

  const MovieTrailerSection({
    super.key,
    required this.movie,
    required this.trailerHeight,
  });

  @override
  State<MovieTrailerSection> createState() => _MovieTrailerSectionState();
}

class _MovieTrailerSectionState extends State<MovieTrailerSection> {
  YoutubePlayerController? _controller;
  bool _showYoutube = false;

  @override
  void dispose() {
    _controller?.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final videoId = YoutubePlayerController.convertUrlToId(
      widget.movie.trailerUrl ?? '',
    );
    final isYouTube = videoId != null;

    if (isYouTube && _controller == null) {
      _controller = YoutubePlayerController.fromVideoId(
        videoId: videoId,
        autoPlay: false,
        params: const YoutubePlayerParams(showFullscreenButton: false),
      );
    }

    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      height: widget.trailerHeight,
      child: Stack(
        children: [
          Positioned.fill(
            child: _showYoutube && _controller != null
                ? YoutubePlayer(controller: _controller!)
                : Image.network(widget.movie.posterUrl, fit: BoxFit.cover),
          ),
          if (!_showYoutube && isYouTube)
            Center(
              child: InkWell(
                borderRadius: BorderRadius.circular(40),
                onTap: () {
                  setState(() {
                    _showYoutube = true;
                    _controller?.playVideo();
                  });
                },
                child: Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Theme.of(context).brightness == Brightness.dark
                        ? Colors.white.withValues(alpha: 0.3)
                        : Colors.black.withValues(alpha: 0.5),
                  ),
                  padding: const EdgeInsets.all(8),
                  child: Icon(
                    Icons.play_arrow_rounded,
                    size: 64,
                    color: Theme.of(context).brightness == Brightness.dark
                        ? Colors.black
                        : Colors.white,
                    shadows: [
                      Shadow(
                        blurRadius: 8,
                        color: Colors.black.withValues(alpha: 0.6),
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
