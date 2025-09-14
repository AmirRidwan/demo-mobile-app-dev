import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/fnb_item.dart';
import '../services/fnb_service.dart';

class FnbProvider extends ChangeNotifier {
  final FnbService _service;

  FnbProvider({FnbService? service}) : _service = service ?? FnbService();

  List<FnbItem> _items = [];
  bool _loading = false;
  String? _error;

  final Map<String, int> _selections = {};

  // ----------------------------------------
  // Getters
  // ----------------------------------------
  List<FnbItem> get items => List.unmodifiable(_items);
  bool get loading => _loading;
  String? get error => _error;
  Map<String, int> get selections => Map.unmodifiable(_selections);

  double get total {
    double sum = 0;
    for (final entry in _selections.entries) {
      final item = getItemById(entry.key);
      if (item != null) {
        sum += item.price * entry.value;
      }
    }
    return sum;
  }

  // ----------------------------------------
  // Loaders
  // ----------------------------------------
  Future<void> loadFnb({bool forceRefresh = false}) async {
    if (_items.isNotEmpty && !forceRefresh) return;
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final loaded = await _service.fetchFnbItems();
      _items = loaded;
      _error = null;
    } catch (e, st) {
      if (kDebugMode) {
        print('FnbProvider.loadFnb error: $e\n$st');
      }
      _items = [];
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  // ----------------------------------------
  // Selection management
  // ----------------------------------------
  void updateSelection(String itemId, int qty) {
    if (qty <= 0) {
      _selections.remove(itemId);
    } else {
      _selections[itemId] = qty;
    }
    notifyListeners();
  }

  void clearSelections() {
    _selections.clear();
    notifyListeners();
  }

  FnbItem? getItemById(String id) {
    try {
      return _items.firstWhere((i) => i.id == id);
    } catch (_) {
      return null;
    }
  }

}