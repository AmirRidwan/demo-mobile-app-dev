import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/app_theme.dart';
import 'providers/movies_provider.dart';
import 'providers/booking_provider.dart';
import 'providers/fnb_provider.dart';
import 'screens/main/tabs/ticket_tab.dart';
import 'screens/splash/splash_screen.dart';
import 'services/seat_service.dart';
import 'screens/main/main_screen.dart';
import 'screens/movie_detail/movie_detail_screen.dart';
import 'screens/booking_summary/booking_summary_screen.dart';
import 'screens/food_beverage/food_beverage_screen.dart';
import 'screens/ticket_booking/ticket_booking_screen.dart';
import 'screens/payment/payment_screen.dart';
import 'screens/payment/payment_success_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final seatService = await SeatService.create();

  runApp(CinemaApp(seatService: seatService));
}

class CinemaApp extends StatefulWidget {
  final SeatService seatService;

  const CinemaApp({super.key, required this.seatService});

  @override
  State<CinemaApp> createState() => _CinemaAppState();
}

class _CinemaAppState extends State<CinemaApp> {
  @override
  void dispose() {
    widget.seatService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => MoviesProvider()..loadMovies()),
        ChangeNotifierProvider(
          create: (_) => BookingProvider(seatService: widget.seatService),
        ),
        ChangeNotifierProvider(create: (_) => FnbProvider()..loadFnb()),
      ],
      child: MaterialApp(
        title: 'Cinema Booking',
        debugShowCheckedModeBanner: false,
        theme: buildThemeData(isDark: false),
        darkTheme: buildThemeData(isDark: true),
        themeMode: ThemeMode.system,
        initialRoute: SplashScreen.routeName,
        routes: {
          SplashScreen.routeName: (_) => const SplashScreen(),
          MainScreen.routeName: (_) => const MainScreen(),
          MovieDetailScreen.routeName: (_) => const MovieDetailScreen(),
          TicketBookingScreen.routeName: (_) => const TicketBookingScreen(),
          FoodBeverageScreen.routeName: (_) => const FoodBeverageScreen(),
          BookingSummaryScreen.routeName: (_) => const BookingSummaryScreen(),
          PaymentSuccessScreen.routeName: (_) => const PaymentSuccessScreen(),
          TicketTab.routeName: (_) => const TicketTab(),
        },
        onGenerateRoute: (settings) {
          if (settings.name == PaymentScreen.routeName) {
            final args = settings.arguments as Map<String, dynamic>?;
            final remainingSeconds = args?['remainingSeconds'] as int? ?? 0;

            return MaterialPageRoute(
              builder: (_) => PaymentScreen(remainingSeconds: remainingSeconds),
              settings: settings,
            );
          }
          return null;
        },
      ),
    );
  }
}
