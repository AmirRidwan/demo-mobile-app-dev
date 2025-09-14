import 'dart:async';
import 'package:flutter/foundation.dart' show defaultTargetPlatform, TargetPlatform;
import 'package:web_socket_channel/web_socket_channel.dart';

import 'lan_ip_stub.dart' if (dart.library.io) 'lan_ip_io.dart';

class WebSocketUrlHelper {
  static Future<String> getUrl({String? lanIp, int port = 8080}) async {
    if (defaultTargetPlatform == TargetPlatform.android) {
      return "ws://10.0.2.2:$port";
    }

    if (defaultTargetPlatform == TargetPlatform.iOS ||
        defaultTargetPlatform == TargetPlatform.macOS) {
      return "ws://localhost:$port";
    }

    // On web or others
    final ip = await getLanIp() ?? lanIp ?? "localhost";
    return "ws://$ip:$port";
  }
}

class SeatService {
  final String url;
  WebSocketChannel? _channel;
  final StreamController<String> _controller = StreamController.broadcast();
  Timer? _reconnectTimer;
  bool _disposed = false;

  Stream<String> get stream => _controller.stream;

  // Factory constructor to auto-init with async URL resolution
  static Future<SeatService> create({String? lanIp, int port = 8080}) async {
    final url = await WebSocketUrlHelper.getUrl(lanIp: lanIp, port: port);
    final service = SeatService._(url);
    service._connect();
    return service;
  }

  SeatService._(this.url);

  void _connect() {
    if (_disposed) return;

    try {
      _channel = WebSocketChannel.connect(Uri.parse(url));
      _channel!.stream.listen(
            (message) {
          print("📥 Received: $message");
          _controller.add(message);
        },
        onDone: () {
          print("⚠️ Connection closed, retrying...");
          _scheduleReconnect();
        },
        onError: (e) {
          print("❌ WebSocket error: $e, retrying...");
          _scheduleReconnect();
        },
      );
      print("✅ Connected to $url");
    } catch (e) {
      print("❌ Failed to connect: $e");
      _scheduleReconnect();
    }
  }

  void _scheduleReconnect() {
    if (_disposed) return;
    if (_reconnectTimer != null && _reconnectTimer!.isActive) return;

    _reconnectTimer = Timer(const Duration(seconds: 2), _connect);
  }

  void sendLock(String seatId, String showtimeId) {
    final msg = "LOCK::$showtimeId::$seatId";
    print("📤 Sending: $msg");
    _channel?.sink.add(msg);
  }

  void sendUnlock(String seatId, String showtimeId) {
    final msg = "UNLOCK::$showtimeId::$seatId";
    print("📤 Sending: $msg");
    _channel?.sink.add(msg);
  }

  void requestState(String showtimeId) {
    final msg = "STATE_REQUEST::$showtimeId";
    print("📤 Sending: $msg");
    _channel?.sink.add(msg);
  }

  void dispose() {
    _disposed = true;
    _reconnectTimer?.cancel();
    _channel?.sink.close();
    _controller.close();
  }
}
