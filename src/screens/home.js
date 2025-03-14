import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, TouchableOpacity, StatusBar, Pressable, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MovieCard = ({title, subtitle, image}) => (
	<TouchableOpacity style={styles.movieCard}>
		<View style={styles.movieImageContainer}>
		<View style={styles.movieImagePlaceholder} />
		</View>
		<View style={styles.movieTitleContainer}>
		<Text style={styles.movieTitle} numberOfLines={1}>
			{title}
		</Text>
		<Text style={styles.movieSubtitle} numberOfLines={1}>
			{subtitle}
		</Text>
		</View>
		<TouchableOpacity style={styles.movieOptionsButton}>
		<Icon name="ellipsis-vertical" size={16} color="#666" />
		</TouchableOpacity>
	</TouchableOpacity>
);

const MovieSection = ({title, viewAllAction}) => (
	<View style={styles.sectionContainer}>
		<View style={styles.sectionHeader}>
		<Text style={styles.sectionTitle}>{title}</Text>
		<TouchableOpacity onPress={viewAllAction}>
			<Text style={styles.viewAllText}>view all</Text>
		</TouchableOpacity>
		</View>
		<View style={styles.movieRow}>
		<MovieCard
			title={
			title === 'New Releases'
				? 'Venom: Let there be carnage'
				: title === 'Popular in cinemas'
				? 'Shang-Chi: Legend of the ten rings'
				: 'Recommended Movie 1'
			}
			subtitle={
			title === 'New Releases'
				? ''
				: title === 'Popular in cinemas'
				? ''
				: ''
			}
		/>
		<MovieCard
			title={
			title === 'New Releases'
				? '007: No Time To Die'
				: title === 'Popular in cinemas'
				? 'Ciao giallo (The egg)'
				: 'Recommended Movie 2'
			}
			subtitle={
			title === 'New Releases'
				? ''
				: title === 'Popular in cinemas'
				? ''
				: ''
			}
		/>
		</View>
	</View>
);


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
						<Text style={styles.greeting}>{user}</Text>
						<Text style={styles.subGreeting}>Want to go see a movie? Get your ticket today</Text>
					</View>
				</View>
				<Pressable onPress={() => console.log('Pressed')}>
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
				<MovieSection
					title="New Releases"
					viewAllAction={() => console.log('View all new releases')}
				/>
				<MovieSection
					title="Popular in cinemas"
					viewAllAction={() => console.log('View all popular')}
				/>
				<MovieSection
					title="Recommended for you"
					viewAllAction={() => console.log('View all recommended')}
				/>
			</ScrollView>

			{/* Bottom Navigation */}
			<View style={styles.bottomNav}>
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
			</View>
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
	sectionContainer: {
		marginBottom: 16,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		marginBottom: 8,
	},
	sectionTitle: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: '600',
	},
	viewAllText: {
		color: '#999',
		fontSize: 12,
	},
	movieRow: {
		flexDirection: 'row',
		paddingHorizontal: 16,
	},
	movieCard: {
		width: 150,
		marginRight: 12,
	},
	movieImageContainer: {
		width: '100%',
		height: 200,
		borderRadius: 8,
		overflow: 'hidden',
		backgroundColor: '#222',
	},
	movieImagePlaceholder: {
		flex: 1,
		backgroundColor: '#333',
	},
	movieTitleContainer: {
		paddingVertical: 4,
		flex: 1,
	},
	movieTitle: {
		color: '#FFF',
		fontSize: 12,
		fontWeight: '600',
	},
	movieSubtitle: {
		color: '#999',
		fontSize: 10,
	},
	movieOptionsButton: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		padding: 4,
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
