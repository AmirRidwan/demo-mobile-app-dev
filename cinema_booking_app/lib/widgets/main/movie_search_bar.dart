import 'dart:async';
import 'package:flutter/material.dart';

class MovieSearchBar extends StatefulWidget {
  final String query;
  final ValueChanged<String> onChanged;
  final VoidCallback onClear;

  const MovieSearchBar({
    super.key,
    required this.query,
    required this.onChanged,
    required this.onClear,
  });

  @override
  State<MovieSearchBar> createState() => _MovieSearchBarState();
}

class _MovieSearchBarState extends State<MovieSearchBar> {
  late final TextEditingController _controller;
  Timer? _debounce;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.query);
  }

  @override
  void didUpdateWidget(MovieSearchBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.query != widget.query) {
      _controller.text = widget.query;
      _controller.selection = TextSelection.fromPosition(
        TextPosition(offset: widget.query.length),
      );
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  void _onTextChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 300), () {
      widget.onChanged(value);
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      child: Container(
        decoration: BoxDecoration(
          color: scheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: scheme.shadow.withValues(alpha: 0.1),
              blurRadius: 6,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Icon(
                Icons.search,
                color: scheme.onSurfaceVariant,
                size: 22,
              ),
            ),
            Expanded(
              child: TextField(
                controller: _controller,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: scheme.onSurface,
                ),
                cursorColor: scheme.primary,
                decoration: InputDecoration(
                  hintText: 'Search by movies or cinema hall',
                  hintStyle: theme.textTheme.bodyMedium?.copyWith(
                    color: scheme.onSurfaceVariant,
                  ),
                  border: InputBorder.none,
                  filled: false,
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(vertical: 12),
                ),
                onChanged: _onTextChanged,
              ),
            ),
            if (widget.query.isNotEmpty)
              IconButton(
                icon: Icon(
                  Icons.clear,
                  color: scheme.onSurfaceVariant,
                  size: 22,
                ),
                onPressed: () {
                  _controller.clear();
                  widget.onClear();
                },
              ),
          ],
        ),
      ),
    );
  }
}
