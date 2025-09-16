import 'package:flutter/foundation.dart' show defaultTargetPlatform, TargetPlatform;
import '../services/lan_ip_stub.dart' if (dart.library.io) '../services/lan_ip_io.dart';

class AppConfig {
  static const String host = "localhost";

  static const int port = 3000;

  static Future<String> getBaseUrl({String? lanIp}) async {
    if (defaultTargetPlatform == TargetPlatform.android) {
      return "http://10.0.2.2:$port";
    }

    if (defaultTargetPlatform == TargetPlatform.iOS ||
        defaultTargetPlatform == TargetPlatform.macOS) {
      return "http://localhost:$port";
    }

    final ip = await getLanIp() ?? lanIp ?? host;
    return "http://$ip:$port";
  }
}
