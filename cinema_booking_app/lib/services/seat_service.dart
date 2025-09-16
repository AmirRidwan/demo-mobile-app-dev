import 'dart:async';
import 'package:flutter/foundation.dart' show defaultTargetPlatform, TargetPlatform;
import 'package:web_socket_channel/web_socket_channel.dart';

import '../core/app_config.dart';
import 'lan_ip_stub.dart' if (dart.library.io) 'lan_ip_io.dart';

class WebSocketUrlHelper {
  static Future<String> getUrl({String? lanIp, int? port}) async {
    final p = port ?? AppConfig.port;

    if (defaultTargetPlatform == TargetPlatform.android) {
      return "ws://10.0.2.2:$p"; // Android emulator
    }

    if (defaultTargetPlatform == TargetPlatform.iOS ||
        defaultTargetPlatform == TargetPlatform.macOS) {
      return "ws://localhost:$p"; // iOS simulator / macOS
    }

    // Web, desktop, or physical device
    final ip = await getLanIp() ?? lanIp ?? AppConfig.host;
    return "ws://$ip:$p";
  }
}

enum ConnectionStatus { connected, disconnected, reconnecting }

class SeatService {
  final String url;
  WebSocketChannel? _channel;
  final StreamController<String> _controller = StreamController.broadcast();
  Timer? _reconnectTimer;
  bool _disposed = false;
  ConnectionStatus _status = ConnectionStatus.disconnected;

  String? _currentShowtimeId;

  Stream<String> get stream => _controller.stream;
  ConnectionStatus get status => _status;

  /// Factory constructor to create and connect automatically
  static Future<SeatService> create({String? lanIp, int? port}) async {
    final url = await WebSocketUrlHelper.getUrl(
      lanIp: lanIp,
      port: port ?? AppConfig.port,
    );
    final service = SeatService._(url);
    service._connect();
    return service;
  }

  SeatService._(this.url);

  void _connect() {
    if (_disposed) return;

    try {
      _status = ConnectionStatus.reconnecting;
      _channel = WebSocketChannel.connect(Uri.parse(url));
      _status = ConnectionStatus.connected;

      _channel!.stream.listen(
            (message) {
          final msg = message.toString();
          print("📥 Received: $msg");
          _controller.add(msg);
        },
        onDone: () {
          if (!_disposed) {
            _status = ConnectionStatus.disconnected;
            print("⚠️ Connection closed, retrying...");
            _scheduleReconnect();
          }
        },
        onError: (e) {
          if (!_disposed) {
            _status = ConnectionStatus.disconnected;
            print("❌ WebSocket error: $e, retrying...");
            _scheduleReconnect();
          }
        },
      );

      print("✅ Connected to $url");

      // After reconnect → request state again
      if (_currentShowtimeId != null) {
        Future.delayed(const Duration(milliseconds: 500), () {
          requestState(_currentShowtimeId!);
        });
      }
    } catch (e) {
      _status = ConnectionStatus.disconnected;
      print("❌ Failed to connect: $e");
      _scheduleReconnect();
    }
  }

  void _scheduleReconnect() {
    if (_disposed) return;
    if (_reconnectTimer != null && _reconnectTimer!.isActive) return;

    _reconnectTimer = Timer(const Duration(seconds: 2), _connect);
  }

  void _send(String msg) {
    if (_status == ConnectionStatus.connected && _channel != null) {
      print("📤 Sending: $msg");
      _channel!.sink.add(msg);
    } else {
      print("⚠️ Cannot send, not connected: $msg");
    }
  }

  void sendLock(String seatId, String showtimeId) {
    _currentShowtimeId = showtimeId;
    _send("LOCK::$showtimeId::$seatId");
  }

  void sendUnlock(String seatId, String showtimeId) {
    _currentShowtimeId = showtimeId;
    _send("UNLOCK::$showtimeId::$seatId");
  }

  void requestState(String showtimeId) {
    _currentShowtimeId = showtimeId;
    _send("STATE_REQUEST::$showtimeId");
  }

  void dispose() {
    _disposed = true;
    _status = ConnectionStatus.disconnected;
    _reconnectTimer?.cancel();
    _channel?.sink.close();
    _controller.close();
  }
}
