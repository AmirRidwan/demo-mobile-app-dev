import 'dart:convert';
import 'package:http/http.dart' as http;

import '../core/app_config.dart';
import '../models/fnb_item.dart';

class FnbService {
  Future<List<FnbItem>> fetchFnbItems() async {
    final baseUrl = await AppConfig.getBaseUrl();
    final apiUrl = "$baseUrl/fnb";

    final res = await http
        .get(Uri.parse(apiUrl))
        .timeout(const Duration(seconds: 5));

    if (res.statusCode == 200) {
      final List data = json.decode(res.body);
      print("✅ FnbService: Loaded ${data.length} items from API");
      return data.map((e) => FnbItem.fromJson(e)).toList();
    } else {
      throw Exception("FnbService failed: status ${res.statusCode}");
    }
  }
}
