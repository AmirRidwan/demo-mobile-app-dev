import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, TouchableOpacity, StatusBar, Pressable, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// COMPONENTS
import MovieCard from '../components/home/movieCard';
import MovieList from '../components/home/movieList';


export default Home = () => { 
	const [user, setUser] = useState("")

	useEffect(() => {
		setUser("Raymond")
	})

	return (
		<SafeAreaView style={styles.container}>

			{/* HEADER SECTION */}
			<View style={styles.header}>
				<View style={styles.userInfo}>
					<View style={styles.profilePic} />
					<View>
						<Text style={styles.greeting}>Hello, &nbsp;
							<Text style={styles.user}>{user}</Text>
						</Text>
						<Text style={styles.subGreeting}>Want to go see a movie? Get your ticket today</Text>
					</View>
				</View>
				<Pressable onPressed={() => console.log('Pressed')}>
					<Icon name="notifications-outline" size={24} color="#FFF" />
				</Pressable>
			</View>

			{/* Search Bar */}
			<View style={styles.searchContainer}>
				<Icon name="search" size={20} color="#666" style={styles.searchIcon} />
				<TextInput style={styles.searchInput} placeholder="Search by movies or cinema hall" placeholderTextColor="#666"/>
				<TouchableOpacity style={styles.filterButton}>
					<Icon name="options-outline" size={20} color="#666" />
				</TouchableOpacity>
			</View>

			{/* Movie Listings */}
			<ScrollView style={styles.content}>
				<MovieList title="New Releases" viewAllAction={() => console.log('View all new releases')}>
					<MovieCard title="Venom: Let there be carnage" />
				</MovieList>
				<MovieList title="Popular in cinemas" viewAllAction={() => console.log('View all popular')}>
				</MovieList>
				<MovieList title="Recommended for you" viewAllAction={() => console.log('View all recommended')}>
				</MovieList>

			</ScrollView>

			{/* Bottom Navigation */}
			{/* <View style={styles.bottomNav}>
				<TouchableOpacity style={styles.navItem}>
				<Icon name="home" type="Ionicons" size={24} color="#FFF" />
				</TouchableOpacity>
				<TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
				<Icon name="film-outline" size={24} color="#FFF" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.navItem}>
				<Icon name="heart-outline" type="Ionicons" size={24} color="#FFF" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.navItem}>
				<Icon name="person-outline" type="Ionicons" size={24} color="#FFF" />
				</TouchableOpacity>
			</View> */}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	profilePic: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#333',
		marginRight: 12,
	},
	greeting: {
		color: '#999',
		fontSize: 16,
	},
	user: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: '600',
	},
	subGreeting: {
		color: '#999',
		fontSize: 12,
	},
	notificationButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#222',
		borderRadius: 10,
		marginHorizontal: 16,
		marginVertical: 12,
		paddingHorizontal: 12,
		height: 40,
	},
	searchIcon: {
		marginRight: 8,
	},
	searchInput: {
		flex: 1,
		color: '#FFF',
		fontSize: 14,
		height: 40,
	},
	filterButton: {
		padding: 4,
	},
	content: {
		flex: 1,
	},


	bottomNav: {
		flexDirection: 'row',
		height: 60,
		backgroundColor: '#111',
		justifyContent: 'space-around',
		alignItems: 'center',
		borderTopWidth: 0.5,
		borderTopColor: '#333',
	},
	navItem: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
	},
	activeNavItem: {
		borderTopWidth: 2,
		borderTopColor: '#FFF',
	},
});
