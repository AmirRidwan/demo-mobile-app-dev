import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

final darkColorScheme = const ColorScheme(
  brightness: Brightness.dark,
  primary: Color(0xFFFFD700), // gold highlight
  onPrimary: Colors.black,
  secondary: Color(0xFFD32F2F),
  onSecondary: Colors.white,
  error: Colors.redAccent,
  onError: Colors.black,
  surface: Color(0xFF121212),
  onSurface: Colors.white,
);

final lightColorScheme = const ColorScheme(
  brightness: Brightness.light,
  primary: Color(0xFFFFD700), // gold highlight
  onPrimary: Colors.white,
  secondary: Color(0xFFD32F2F),
  onSecondary: Colors.black,
  error: Colors.redAccent,
  onError: Colors.white,
  surface: Color(0xFFF9F9F9),
  onSurface: Colors.black,
);

ThemeData buildThemeData({bool isDark = true}) {
  final scheme = isDark ? darkColorScheme : lightColorScheme;

  return ThemeData(
    colorScheme: scheme,
    brightness: scheme.brightness,
    scaffoldBackgroundColor:
    isDark ? const Color(0xFF0D0D0D) : const Color(0xFFFDFDFD),
    useMaterial3: true,

    textTheme: TextTheme(
      displayLarge: GoogleFonts.poppins(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: scheme.onSurface,
      ),
      titleLarge: GoogleFonts.poppins(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: scheme.onSurface,
      ),
      titleMedium: GoogleFonts.poppins(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: scheme.onSurface.withValues(alpha: 0.85),
      ),
      bodyLarge: GoogleFonts.roboto(
        fontSize: 15,
        color: scheme.onSurface.withValues(alpha: 0.9),
      ),
      bodyMedium: GoogleFonts.roboto(
        fontSize: 13,
        color: scheme.onSurface.withValues(alpha: 0.7),
      ),
      labelLarge: GoogleFonts.poppins(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: scheme.onPrimary,
      ),
    ),

    appBarTheme: AppBarTheme(
      backgroundColor: scheme.surface,
      foregroundColor: scheme.onSurface,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: GoogleFonts.poppins(
        fontSize: 20,
        fontWeight: FontWeight.bold,
        color: scheme.onSurface,
      ),
      iconTheme: IconThemeData(color: scheme.onSurface),
      systemOverlayStyle: SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness:
        isDark ? Brightness.light : Brightness.dark,
        statusBarBrightness:
        isDark ? Brightness.dark : Brightness.light,
      ),
    ),

    cardTheme: CardThemeData(
      color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
      elevation: 0,
      margin: const EdgeInsets.all(8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),

    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: isDark
          ? Colors.white.withValues(alpha: 0.05)
          : Colors.black.withValues(alpha: 0.05),
      contentPadding: const EdgeInsets.symmetric(
          vertical: 12, horizontal: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(30),
        borderSide: BorderSide.none,
      ),
      hintStyle: GoogleFonts.roboto(
        fontSize: 14,
        color: isDark
            ? Colors.white.withValues(alpha: 0.5)
            : Colors.black.withValues(alpha: 0.4),
      ),
    ),

    bottomNavigationBarTheme: BottomNavigationBarThemeData(
      backgroundColor: isDark ? Colors.black : Colors.white,
      selectedItemColor: scheme.primary,
      unselectedItemColor: isDark
          ? Colors.white.withValues(alpha: 0.6)
          : Colors.black.withValues(alpha: 0.6),
      showUnselectedLabels: true,
      type: BottomNavigationBarType.fixed,
      selectedIconTheme: const IconThemeData(size: 28),
      unselectedIconTheme: const IconThemeData(size: 24),
    ),
  );
}
