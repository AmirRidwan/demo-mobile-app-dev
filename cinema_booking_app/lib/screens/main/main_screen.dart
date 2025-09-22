import 'package:flutter/material.dart';

import 'tabs/favorite_tab.dart';
import 'tabs/home_tab.dart';
import 'tabs/profile_tab.dart';
import 'tabs/ticket_tab.dart';

class MainScreen extends StatefulWidget {
  static const routeName = '/';
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  void _onTabTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  final List<Widget> _screens = [
    const HomeTab(),
    const TicketTab(),
    const FavoriteTab(),
    const ProfileTab(),
  ];

  final List<String> _titles = [
    'Now Showing',
    'My Tickets',
    'Favorites',
    'Profile',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text(_titles[_selectedIndex])
        ),
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onTabTapped,
        type: BottomNavigationBarType.fixed,
        showSelectedLabels: true,
        showUnselectedLabels: false,
        selectedIconTheme: const IconThemeData(size: 24),
        unselectedIconTheme: const IconThemeData(size: 30),
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.home),
            label: _selectedIndex == 0 ? 'Home' : '',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.confirmation_num),
            label: _selectedIndex == 1 ? 'Ticket' : '',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.favorite),
            label: _selectedIndex == 2 ? 'Favorite' : '',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.person),
            label: _selectedIndex == 3 ? 'Profile' : '',
          ),
        ],
      ),
    );
  }
}
