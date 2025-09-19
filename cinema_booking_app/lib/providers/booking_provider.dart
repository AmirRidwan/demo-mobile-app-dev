import 'dart:async';
import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import '../models/booking.dart';
import '../models/seat.dart';
import '../models/movie.dart';
import '../models/fnb_item.dart';
import '../models/showtime.dart';
import '../services/seat_service.dart';

class BookingProvider extends ChangeNotifier {
  // ----------------------------------------
  // Core State
  // ----------------------------------------
  Showtime? _selectedShowtime;
  DateTime? _selectedDate;
  double _defaultSeatPrice = 15.0;
  final List<Booking> _bookings = [];
  List<Booking> get bookings => List.unmodifiable(_bookings);

  Booking? get lastBooking =>
      _bookings.isNotEmpty ? _bookings.last : null;

  // Hall-based pricing
  static const Map<String, double> _hallPricing = {
    "2D": 15.0,
    "IMAX": 25.0,
    "VIP": 40.0,
    "3D": 20.0,
  };

  // Seats: state, selections, prices, timers
  final Map<String, Map<String, SeatStatus>> _seatStates = {};
  final Map<String, Set<String>> _selectedSeats = {};
  final Map<String, Map<String, double>> _seatPrices = {};
  final Map<String, Map<String, Timer>> _seatTimers = {};
  final Map<String, Map<String, int>> _seatCountdowns = {};

  // Confirmed seats
  List<String> _confirmedSeats = [];

  // Food & Beverages
  final Map<String, int> _foodSelections = {};
  final Map<String, Map<String, dynamic>> _menu = {};

  // Constants
  static const int _holdDurationSeconds = 60;

  // WebSocket
  final SeatService seatService;

  BookingProvider({required this.seatService}) {
    seatService.stream.listen(_handleWebSocketMessage);
  }

  // ----------------------------------------
  // Getters
  // ----------------------------------------
  Showtime? get selectedShowtime => _selectedShowtime;
  DateTime? get selectedDate => _selectedDate;
  double get defaultSeatPrice => _defaultSeatPrice;
  int get holdDurationSeconds => _holdDurationSeconds;

  Map<String, SeatStatus> get currentSeatStates =>
      _selectedShowtime == null ? {} : _seatStates[_selectedShowtime!.id] ?? {};

  Set<String> get selectedSeatsForCurrent =>
      _selectedShowtime == null ? {} : _selectedSeats[_selectedShowtime!.id] ?? {};

  Map<String, double> get currentSeatPrices =>
      _selectedShowtime == null ? {} : _seatPrices[_selectedShowtime!.id] ?? {};

  Set<String> get selectedSeats => selectedSeatsForCurrent;
  List<String> get confirmedSeats => _confirmedSeats;

  Map<String, int> get foodSelections => _foodSelections;
  Map<String, Map<String, dynamic>> get menu => _menu;

  int seatRemainingTime(String seatId) {
    if (_selectedShowtime == null) return 0;
    return _seatCountdowns[_selectedShowtime!.id]?[seatId] ?? 0;
  }

  // ----------------------------------------
  // Totals
  // ----------------------------------------
  double get seatSubtotal {
    final seatsToPrice =
    _confirmedSeats.isNotEmpty ? _confirmedSeats : selectedSeatsForCurrent;

    return seatsToPrice.fold(
      0.0,
          (total, id) => total + (currentSeatPrices[id] ?? _defaultSeatPrice),
    );
  }

  double get foodSubtotal {
    return _foodSelections.entries.fold(0.0, (total, entry) {
      final price = _menu[entry.key]?['price'] ?? 0.0;
      return total + (price * entry.value);
    });
  }

  double get totalAmount => seatSubtotal + foodSubtotal;

  // ----------------------------------------
  // Showtime
  // ----------------------------------------
  void selectShowtime({
    required Showtime showtime,
    required DateTime date,
  }) {
    if (_selectedShowtime?.id != showtime.id || _selectedDate != date) {
      _resetSelections();
    }

    _selectedShowtime = showtime;
    _selectedDate = date;

    // 🎯 Set seat price based on hall type
    _defaultSeatPrice = _hallPricing[showtime.hallType] ?? 15.0;

    // Initialize storage for this showtime
    _seatStates.putIfAbsent(showtime.id, () => {});
    _selectedSeats.putIfAbsent(showtime.id, () => {});
    _seatPrices.putIfAbsent(showtime.id, () => {});
    _seatTimers.putIfAbsent(showtime.id, () => {});
    _seatCountdowns.putIfAbsent(showtime.id, () => {});

    seatService.requestState(showtime.id);
    notifyListeners();
  }

  void _resetSelections() {
    if (_selectedShowtime == null) return;
    final showtimeId = _selectedShowtime!.id;
    _selectedSeats[showtimeId]?.clear();
    _seatPrices[showtimeId]?.clear();
    _confirmedSeats.clear();
    notifyListeners();
  }

  // ----------------------------------------
  // Seat Management
  // ----------------------------------------
  SeatStatus seatStatus(String seatId) =>
      currentSeatStates[seatId] ?? SeatStatus.available;

  bool toggleSeat(String seatId, {double? price}) {
    if (_selectedShowtime == null) return false;
    final showtimeId = _selectedShowtime!.id;

    final status = seatStatus(seatId);
    if (status == SeatStatus.locked || status == SeatStatus.booked) return false;

    final selected = _selectedSeats[showtimeId]!;
    final states = _seatStates[showtimeId]!;
    final prices = _seatPrices[showtimeId]!;

    if (selected.remove(seatId)) {
      states[seatId] = SeatStatus.available;
      prices.remove(seatId);
    } else {
      selected.add(seatId);
      states[seatId] = SeatStatus.selected;
      prices[seatId] = price ?? _defaultSeatPrice;
    }
    notifyListeners();
    return true;
  }

  bool get hasActiveLock {
    if (_selectedShowtime == null) return false;
    return _seatCountdowns[_selectedShowtime!.id]?.isNotEmpty ?? false;
  }

  void lockSelectedSeats() {
    if (_selectedShowtime == null) return;
    final showtimeId = _selectedShowtime!.id;
    final seats = _selectedSeats[showtimeId]!.toList();
    final timers = _seatTimers[showtimeId]!;
    final countdowns = _seatCountdowns[showtimeId]!;

    for (final seatId in seats) {
      if (countdowns.containsKey(seatId)) continue;

      _seatStates[showtimeId]?[seatId] = SeatStatus.locked;
      countdowns[seatId] = _holdDurationSeconds;

      timers[seatId] = Timer.periodic(const Duration(seconds: 1), (timer) {
        final remaining = countdowns[seatId];
        if (remaining == null) {
          timer.cancel();
          return;
        }

        if (remaining <= 1) {
          _releaseSeat(showtimeId, seatId);
        } else {
          countdowns[seatId] = remaining - 1;
          notifyListeners();
        }
      });

      seatService.sendLock(seatId, showtimeId);
    }
    notifyListeners();
  }

  void _releaseSeat(String showtimeId, String seatId) {
    _cancelSeatTimer(showtimeId, seatId);
    _selectedSeats[showtimeId]?.remove(seatId);
    _seatStates[showtimeId]?[seatId] = SeatStatus.available;
    _seatPrices[showtimeId]?.remove(seatId);
    seatService.sendUnlock(seatId, showtimeId);
    notifyListeners();
  }

  void _cancelSeatTimer(String showtimeId, String seatId) {
    _seatTimers[showtimeId]?[seatId]?.cancel();
    _seatTimers[showtimeId]?.remove(seatId);
    _seatCountdowns[showtimeId]?.remove(seatId);
  }

  Future<bool> confirmSeatSelection({
    Duration waitForState = const Duration(milliseconds: 400),
  }) async {
    if (_selectedShowtime == null) return false;
    final showtimeId = _selectedShowtime!.id;
    final seats = _selectedSeats[showtimeId];
    if (seats == null || seats.isEmpty) return false;

    seatService.requestState(showtimeId);
    await Future.delayed(waitForState);

    final conflicts = seats.where((s) {
      final st = _seatStates[showtimeId]?[s];
      return st == SeatStatus.locked || st == SeatStatus.booked;
    }).toList();

    if (conflicts.isNotEmpty) {
      for (final s in conflicts) {
        _releaseSeat(showtimeId, s);
      }
      return false;
    }

    _confirmedSeats = seats.toList();
    lockSelectedSeats();
    return true;
  }

  // ----------------------------------------
  // Food & Beverages
  // ----------------------------------------
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

  // ----------------------------------------
  // Cancel / Finalize
  // ----------------------------------------
  void cancelBooking() {
    if (_selectedShowtime == null) return;
    final showtimeId = _selectedShowtime!.id;

    final seatsToRelease = {...selectedSeatsForCurrent, ..._confirmedSeats};
    for (final seatId in seatsToRelease) {
      _releaseSeat(showtimeId, seatId);
    }

    _selectedSeats[showtimeId]?.clear();
    _confirmedSeats.clear();

    _selectedShowtime = null;
    _selectedDate = null;

    notifyListeners();
  }

  void finalizeBooking() {
    if (_selectedShowtime == null) return;
    final showtimeId = _selectedShowtime!.id;

    for (final id in selectedSeatsForCurrent) {
      _seatStates[showtimeId]?[id] = SeatStatus.booked;
      _cancelSeatTimer(showtimeId, id);
    }

    _selectedSeats[showtimeId]?.clear();
    _seatPrices[showtimeId]?.clear();
    _seatTimers[showtimeId]?.clear();
    _seatCountdowns[showtimeId]?.clear();

    _confirmedSeats.clear();
    notifyListeners();
  }

  // Save booking details
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

  // ----------------------------------------
  // WebSocket handler
  // ----------------------------------------
  void _handleWebSocketMessage(String message) {
    final parts = message.split("::");
    if (parts.length != 3) return;

    final action = parts[0], showtimeId = parts[1], seatId = parts[2];

    switch (action) {
      case "LOCK":
        _applyRemoteLock(showtimeId, seatId);
        break;
      case "UNLOCK":
        _applyRemoteUnlock(showtimeId, seatId);
        break;
      case "STATE_RESPONSE":
        for (final seat in seatId.split(",")) {
          if (seat.isNotEmpty) _applyRemoteLock(showtimeId, seat);
        }
        break;
    }
    notifyListeners();
  }

  void _applyRemoteLock(String showtimeId, String seatId) {
    _selectedSeats[showtimeId]?.remove(seatId);
    _seatPrices[showtimeId]?.remove(seatId);
    _seatStates[showtimeId]?[seatId] = SeatStatus.locked;
  }

  void _applyRemoteUnlock(String showtimeId, String seatId) {
    final selected = _selectedSeats[showtimeId]?.contains(seatId) ?? false;
    _seatStates[showtimeId]?[seatId] =
    selected ? SeatStatus.selected : SeatStatus.available;
  }
}
