import 'dart:async';
import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';

import '../models/booking.dart';
import '../models/seat.dart';
import '../models/movie.dart';
import '../models/fnb_item.dart';
import '../models/showtime.dart';
import '../services/seat_service.dart';

class ShowtimeSeatState {
  final Map<String, SeatStatus> seatStates = {};
  final Set<String> selectedSeats = {};
  final Map<String, double> seatPrices = {};
  final Map<String, Timer> timers = {};
  final Map<String, int> countdowns = {};

  void clear() {
    selectedSeats.clear();
    seatPrices.clear();
    timers.values.forEach((t) => t.cancel());
    timers.clear();
    countdowns.clear();
  }
}

class BookingProvider extends ChangeNotifier {
  // Dependencies
  final SeatService seatService;

  BookingProvider({required this.seatService}) {
    seatService.stream.listen(_handleWebSocketMessage);
  }

  // -------------------------------------------------
  // Core State
  // -------------------------------------------------
  Showtime? _selectedShowtime;
  DateTime? _selectedDate;
  double _defaultSeatPrice = 15.0;
  final List<Booking> _bookings = [];
  List<Booking> get bookings => List.unmodifiable(_bookings);

  Booking? get lastBooking =>
      _bookings.isNotEmpty ? _bookings.last : null;

  // Food & Beverages
  final Map<String, int> _foodSelections = {};
  final Map<String, Map<String, dynamic>> _menu = {};

  // Seat management per showtime
  final Map<String, ShowtimeSeatState> _showtimeStates = {};

  // Confirmed seats
  List<String> _confirmedSeats = [];

  static const int _holdDurationSeconds = 60;
  static const Map<String, double> _hallPricing = {
    "2D": 15.0,
    "IMAX": 25.0,
    "VIP": 40.0,
    "3D": 20.0,
  };

  // -------------------------------------------------
  // Getters
  // -------------------------------------------------
  Showtime? get selectedShowtime => _selectedShowtime;
  DateTime? get selectedDate => _selectedDate;
  double get defaultSeatPrice => _defaultSeatPrice;
  int get holdDurationSeconds => _holdDurationSeconds;

  ShowtimeSeatState? get _currentState =>
      _selectedShowtime == null ? null : _showtimeStates[_selectedShowtime!.id];

  Map<String, SeatStatus> get currentSeatStates =>
      _currentState?.seatStates ?? {};

  Set<String> get selectedSeats => _currentState?.selectedSeats ?? {};

  Map<String, double> get currentSeatPrices =>
      _currentState?.seatPrices ?? {};

  List<String> get confirmedSeats => _confirmedSeats;

  Map<String, int> get foodSelections => _foodSelections;
  Map<String, Map<String, dynamic>> get menu => _menu;

  int seatRemainingTime(String seatId) =>
      _currentState?.countdowns[seatId] ?? 0;

  // -------------------------------------------------
  // Totals
  // -------------------------------------------------
  double get seatSubtotal {
    final seatsToPrice =
        _confirmedSeats.isNotEmpty ? _confirmedSeats : selectedSeats;
    return seatsToPrice.fold(
      0.0,
      (total, id) => total + (currentSeatPrices[id] ?? _defaultSeatPrice),
    );
  }

  double get foodSubtotal => _foodSelections.entries.fold(0.0, (total, entry) {
        final price = _menu[entry.key]?['price'] ?? 0.0;
        return total + (price * entry.value);
      });

  double get totalAmount => seatSubtotal + foodSubtotal;

  // -------------------------------------------------
  // Showtime
  // -------------------------------------------------
  void selectShowtime({required Showtime showtime, required DateTime date}) {
    if (_selectedShowtime?.id != showtime.id || _selectedDate != date) {
      _resetSelections();
    }

    _selectedShowtime = showtime;
    _selectedDate = date;
    _defaultSeatPrice = _hallPricing[showtime.hallType] ?? 15.0;

    _showtimeStates.putIfAbsent(showtime.id, () => ShowtimeSeatState());
    seatService.requestState(showtime.id);
    notifyListeners();
  }

  void _resetSelections() {
    if (_selectedShowtime == null) return;
    final state = _showtimeStates[_selectedShowtime!.id];
    state?.clear();
    _confirmedSeats.clear();
    notifyListeners();
  }

  // -------------------------------------------------
  // Seat Management
  // -------------------------------------------------
  SeatStatus seatStatus(String seatId) =>
      currentSeatStates[seatId] ?? SeatStatus.available;

  bool toggleSeat(String seatId, {double? price}) {
    final state = _currentState;
    if (state == null) return false;

    final status = seatStatus(seatId);
    if (status == SeatStatus.locked || status == SeatStatus.booked) return false;

    if (state.selectedSeats.remove(seatId)) {
      state.seatStates[seatId] = SeatStatus.available;
      state.seatPrices.remove(seatId);
    } else {
      state.selectedSeats.add(seatId);
      state.seatStates[seatId] = SeatStatus.selected;
      state.seatPrices[seatId] = price ?? _defaultSeatPrice;
    }
    notifyListeners();
    return true;
  }

  bool get hasActiveLock => _currentState?.countdowns.isNotEmpty ?? false;

  void lockSelectedSeats() {
    final state = _currentState;
    if (state == null) return;

    for (final seatId in state.selectedSeats.toList()) {
      if (state.countdowns.containsKey(seatId)) continue;

      state.seatStates[seatId] = SeatStatus.locked;
      state.countdowns[seatId] = _holdDurationSeconds;

      state.timers[seatId] =
          Timer.periodic(const Duration(seconds: 1), (timer) {
        final remaining = state.countdowns[seatId];
        if (remaining == null) {
          timer.cancel();
          return;
        }

        if (remaining <= 1) {
          _releaseSeat(seatId);
        } else {
          state.countdowns[seatId] = remaining - 1;
          notifyListeners();
        }
      });

      seatService.sendLock(seatId, _selectedShowtime!.id);
    }
    notifyListeners();
  }

  void _releaseSeat(String seatId) {
    final state = _currentState;
    if (state == null) return;

    state.timers[seatId]?.cancel();
    state.timers.remove(seatId);
    state.countdowns.remove(seatId);
    state.selectedSeats.remove(seatId);
    state.seatPrices.remove(seatId);
    state.seatStates[seatId] = SeatStatus.available;
    seatService.sendUnlock(seatId, _selectedShowtime!.id);
    notifyListeners();
  }

  Future<bool> confirmSeatSelection({
    Duration waitForState = const Duration(milliseconds: 400),
  }) async {
    final state = _currentState;
    if (state == null || state.selectedSeats.isEmpty) return false;

    seatService.requestState(_selectedShowtime!.id);
    await Future.delayed(waitForState);

    final conflicts = state.selectedSeats.where((s) {
      final st = state.seatStates[s];
      return st == SeatStatus.locked || st == SeatStatus.booked;
    }).toList();

    if (conflicts.isNotEmpty) {
      for (final s in conflicts) {
        _releaseSeat(s);
      }
      return false;
    }

    _confirmedSeats = state.selectedSeats.toList();
    lockSelectedSeats();
    return true;
  }

  // -------------------------------------------------
  // Food & Beverages
  // -------------------------------------------------
  void updateFood(String itemId, int qty) {
    if (qty <= 0) {
      _foodSelections.remove(itemId);
    } else {
      _foodSelections[itemId] = qty;
    }
    notifyListeners();
  }

  void setFoodSelections(Map<String, int> selections, List<FnbItem> items) {
    _foodSelections
      ..clear()
      ..addAll(selections);

    for (final item in items) {
      _menu[item.id] = {"name": item.name, "price": item.price};
    }
    notifyListeners();
  }

  // -------------------------------------------------
  // Booking Lifecycle
  // -------------------------------------------------
    void cancelBooking() {
    if (_selectedShowtime == null) return;

    final state = _currentState;
    if (state != null) {
      for (final seatId in {...state.selectedSeats, ..._confirmedSeats}) {
        _releaseSeat(seatId);
      }
      state.clear();
    }

    _confirmedSeats.clear();
    _selectedShowtime = null;
    _selectedDate = null;
    notifyListeners();
  }

  void finalizeBooking() {
    final state = _currentState;
    if (state == null) return;

    for (final id in state.selectedSeats) {
      state.seatStates[id] = SeatStatus.booked;
      state.timers[id]?.cancel();
    }
    state.clear();
    _confirmedSeats.clear();
    notifyListeners();
  }

  void saveBooking(Movie movie) {
    if (_selectedShowtime == null) return;

    final booking = Booking(
      id: const Uuid().v4(),
      movie: movie,
      showtime: _selectedShowtime!,
      date: _selectedDate ?? DateTime.now(),
      seats: _confirmedSeats.toList(),
      food: _foodSelections.entries.map((entry) {
        final item = _menu[entry.key];
        return {
          "id": entry.key,
          "name": item?['name'],
          "price": item?['price'],
          "quantity": entry.value,
        };
      }).toList(),
      totalAmount: totalAmount,
      bookedAt: DateTime.now(),
    );

    _bookings.add(booking);
    finalizeBooking();
    notifyListeners();
  }

  // -------------------------------------------------
  // WebSocket handler
  // -------------------------------------------------
  void _handleWebSocketMessage(String message) {
    final parts = message.split("::");
    if (parts.length != 3) return;

    final action = parts[0], showtimeId = parts[1], seatId = parts[2];
    final state = _showtimeStates[showtimeId];
    if (state == null) return;

    switch (action) {
      case "LOCK":
        state.selectedSeats.remove(seatId);
        state.seatPrices.remove(seatId);
        state.seatStates[seatId] = SeatStatus.locked;
        break;
      case "UNLOCK":
        final isSelected = state.selectedSeats.contains(seatId);
        state.seatStates[seatId] =
            isSelected ? SeatStatus.selected : SeatStatus.available;
        break;
      case "STATE_RESPONSE":
        for (final seat in seatId.split(",")) {
          if (seat.isNotEmpty) {
            state.seatStates[seat] = SeatStatus.locked;
          }
        }
        break;
    }
    notifyListeners();
  }
}
