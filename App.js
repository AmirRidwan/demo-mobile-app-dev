import React from 'react';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import HomeScreen from './src/screens/home';
// Import other screens as needed
// import ProfileScreen from './src/screens/profile';
// import FavoritesScreen from './src/screens/favorites';
// import TicketsScreen from './src/screens/tickets';

// You'll need to create these placeholder screens or import your actual screens
const ProfileScreen = () => <></>;
const FavoritesScreen = () => <></>;
const TicketsScreen = () => <></>;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator
const MainTabs = () => {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarStyle: {
					backgroundColor: '#111',
					borderTopColor: '#333',
					borderTopWidth: 0.5,
					height: 60,
				},
				tabBarActiveTintColor: '#FFF',
				tabBarInactiveTintColor: '#666',
				tabBarShowLabel: false,
				// tabBarIcon: ({ focused, color, size }) => {
				// 	let iconName;

				// 	if (route.name === 'Home') {
				// 		iconName = focused ? 'home' : 'home-outline';
				// 	} else if (route.name === 'Tickets') {
				// 		iconName = focused ? 'film' : 'film-outline';
				// 	} else if (route.name === 'Favorites') {
				// 		iconName = focused ? 'heart' : 'heart-outline';
				// 	} else if (route.name === 'Profile') {
				// 		iconName = focused ? 'person' : 'person-outline';
				// 	}

				// 	return <Icon name={iconName} size={24} color={color} />;
				// },
			})}
		>
			<Tab.Screen name="Home" component={HomeScreen} />
			<Tab.Screen name="Tickets" component={TicketsScreen} />
			<Tab.Screen name="Favorites" component={FavoritesScreen} />
			<Tab.Screen name="Profile" component={ProfileScreen} />
		</Tab.Navigator>
	);
};

// Root Navigator
const App = () => {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					<Stack.Screen name="MainTabs" component={MainTabs} />
					{/* Add other stack screens here that you want to navigate to from the tabs */}
					{/* <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} /> */}
					{/* <Stack.Screen name="Checkout" component={CheckoutScreen} /> */}
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
};

// Register the app
AppRegistry.registerComponent('MovieTicketApp', () => App);

export default App;