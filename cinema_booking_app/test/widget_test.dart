import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:cinema_booking_app/main.dart';
import 'package:cinema_booking_app/services/seat_service.dart';

void main() {
  testWidgets('App builds without crashing', (WidgetTester tester) async {
    // Create a SeatService using the async factory
    final seatService = await SeatService.create(
      lanIp: "localhost",
      port: 1234, // use a dummy test port
    );

    // Build our app and trigger a frame
    await tester.pumpWidget(CinemaApp(seatService: seatService));

    // Verify that app loads MainScreen (by looking for something on that screen)
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
