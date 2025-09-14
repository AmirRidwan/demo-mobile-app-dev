import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:http/http.dart' as http;
import '../models/fnb_item.dart';

class FnbService {
  final String apiUrl =
      "https://raw.githubusercontent.com/AmirRidwan/cinema-mock-api/main/data/fnb.json";

  Future<List<FnbItem>> fetchFnbItems() async {
    try {
      final res = await http.get(Uri.parse(apiUrl));
      if (res.statusCode == 200) {
        final List data = json.decode(res.body);
        return data.map((e) => FnbItem.fromJson(e)).toList();
      } else {
        throw Exception("Failed with status ${res.statusCode}");
      }
    } catch (_) {
      // fallback to local asset
      final jsonStr = await rootBundle.loadString("assets/data/fnb.json");
      final List data = json.decode(jsonStr);
      return data.map((e) => FnbItem.fromJson(e)).toList();
    }
  }
}
