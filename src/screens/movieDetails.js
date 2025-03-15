import React from 'react';
import {  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
export default MovieDetails = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { movieId, title } = route.params || { movieId: '1', title: 'Venom: Let There Be Carnage' };

	return (
		<SafeAreaView style={styles.container}>			
			{/* Header with back button and fullscreen button */}
			<View style={styles.header}>
				<TouchableOpacity 
					style={styles.headerButton}
					onPress={() => navigation.goBack()}
				>
					<Icon name="arrow-back" size={24} color="#FFF" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.headerButton}>
					<Icon name="resize" size={24} color="#FFF" />
				</TouchableOpacity>
			</View>
			
			{/* Video Trailer Section */}
			<View style={styles.trailerContainer}>
				<TouchableOpacity style={styles.playButton}>
					<Icon name="play" size={40} color="#FFF" />
				</TouchableOpacity>
				
				<View style={styles.trailerLabelContainer}>
					<View style={styles.trailerLabel}>
						<Text style={styles.trailerText}>TRAILER</Text>
					</View>
				</View>
				
				<TouchableOpacity style={styles.volumeButton}>
					<Icon name="volume-mute-outline" size={24} color="#FFF" />
				</TouchableOpacity>
			</View>
			
			{/* Movie Info Card */}
			<View style={styles.movieInfoCard}>
				<View style={styles.movieBasicInfo}>
					<View style={styles.posterContainer}>
						<View style={styles.poster} />
					</View>
					
					<View style={styles.titleContainer}>
						<Text style={styles.movieTitle}>Venom: Let There Be Carnage</Text>
						
						<View style={styles.genreContainer}>
							<View style={styles.genreTag}>
								<Text style={styles.genreText}>Action</Text>
							</View>
							<View style={styles.genreTag}>
								<Text style={styles.genreText}>Adventure</Text>
							</View>
							<View style={styles.genreTag}>
								<Text style={styles.genreText}>Sci-Fi</Text>
							</View>
						</View>
						
						<View style={styles.metaContainer}>
							<View style={styles.metaItem}>
								<Icon name="calendar-outline" size={16} color="#999" />
								<Text style={styles.metaText}>October 2021</Text>
							</View>
							<View style={styles.metaItem}>
								<Icon name="alert-circle-outline" size={16} color="#999" />
								<Text style={styles.metaText}>18+</Text>
							</View>
							<View style={styles.metaItem}>
								<Icon name="time-outline" size={16} color="#999" />
								<Text style={styles.metaText}>1h 37m</Text>
							</View>
						</View>
						
						<View style={styles.ratingContainer}>
							<Icon name="star" size={14} color="#FFD700" />
							<Icon name="star" size={14} color="#FFD700" />
							<Icon name="star" size={14} color="#FFD700" />
							<Icon name="star" size={14} color="#FFD700" />
							<Icon name="star-half" size={14} color="#FFD700" />
							<Text style={styles.ratingText}>4.5/5 (28)</Text>
						</View>
					</View>
					
					<TouchableOpacity style={styles.favoriteButton}>
						<Icon name="heart-outline" size={24} color="#FFF" />
					</TouchableOpacity>
				</View>
				
				{/* Tab Navigation */}
				<View style={styles.tabContainer}>
					<TouchableOpacity style={[styles.tab, styles.activeTab]}>
						<Text style={[styles.tabText, styles.activeTabText]}>Movie Details</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.tab}>
						<Text style={styles.tabText}>Ratings & Reviews</Text>
					</TouchableOpacity>
				</View>
				
				{/* Movie Details Content */}
				<ScrollView style={styles.detailsContainer}>
					{/* Synopsis */}
					<TouchableOpacity style={styles.detailItem}>
						<View style={styles.detailHeader}>
							<Text style={styles.detailTitle}>Full synopsis</Text>
							<Icon name="chevron-forward" size={20} color="#999" />
						</View>
						<Text style={styles.synopsisPreview} numberOfLines={3}>
							Eddie Brock is still struggling to co-exist with the shape-shifting 
							extraterrestrial Venom. When deranged serial killer Cletus Kasady also 
							becomes host to an alien symbiote...
						</Text>
					</TouchableOpacity>
					
					{/* Cast */}
					<TouchableOpacity style={styles.detailItem}>
						<View style={styles.detailHeader}>
							<Text style={styles.detailTitle}>Casts</Text>
							<Icon name="chevron-forward" size={20} color="#999" />
						</View>
						<Text style={styles.detailContent}>
							Tom Hardy, Woody Harrelson, Michelle Williams, Naomi Harris
						</Text>
					</TouchableOpacity>
					
					{/* Director */}
					<TouchableOpacity style={styles.detailItem}>
						<View style={styles.detailHeader}>
							<Text style={styles.detailTitle}>Director</Text>
							<Icon name="chevron-forward" size={20} color="#999" />
						</View>
						<Text style={styles.detailContent}>
							Andy Serkis
						</Text>
					</TouchableOpacity>
					
					{/* Writers */}
					<TouchableOpacity style={styles.detailItem}>
						<View style={styles.detailHeader}>
							<Text style={styles.detailTitle}>Writers</Text>
							<Icon name="chevron-forward" size={20} color="#999" />
						</View>
						<Text style={styles.detailContent}>
							Kelly Marcel (Screenplay by), Tom Hardy (Story by)
						</Text>
					</TouchableOpacity>
				</ScrollView>
				
				{/* Book Ticket Button */}
				<TouchableOpacity 
					style={styles.bookButton}
					onPress={() => navigation.navigate('TicketBooking', { movieId, title })}
				>
					<Text style={styles.bookButtonText}>Book Ticket</Text>
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
		height: 50,
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
	},
	headerButton: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	trailerContainer: {
		height: 220,
		backgroundColor: '#555',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
	},
	playButton: {
		width: 70,
		height: 70,
		borderRadius: 35,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	trailerLabelContainer: {
		position: 'absolute',
		bottom: 20,
		left: 20,
	},
	trailerLabel: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		borderRadius: 4,
	},
	trailerText: {
		color: '#FFF',
		fontSize: 12,
		fontWeight: '600',
	},
	volumeButton: {
		position: 'absolute',
		bottom: 20,
		right: 20,
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	movieInfoCard: {
		flex: 1,
		backgroundColor: '#111',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		marginTop: -20,
		paddingTop: 20,
		paddingHorizontal: 16,
	},
	movieBasicInfo: {
		flexDirection: 'row',
		marginBottom: 20,
	},
	posterContainer: {
		width: 100,
		height: 150,
		marginRight: 16,
	},
	poster: {
		flex: 1,
		backgroundColor: '#333',
		borderRadius: 8,
	},
	titleContainer: {
		flex: 1,
	},
	movieTitle: {
		color: '#FFF',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	genreContainer: {
		flexDirection: 'row',
		marginBottom: 8,
	},
	genreTag: {
		backgroundColor: '#333',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
		marginRight: 8,
	},
	genreText: {
		color: '#FFF',
		fontSize: 10,
	},
	metaContainer: {
		flexDirection: 'row',
		marginBottom: 8,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 12,
	},
	metaText: {
		color: '#999',
		fontSize: 12,
		marginLeft: 4,
	},
	ratingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	ratingText: {
		color: '#999',
		fontSize: 12,
		marginLeft: 4,
	},
	favoriteButton: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	tabContainer: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#333',
		marginBottom: 16,
	},
	tab: {
		paddingVertical: 12,
		marginRight: 20,
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor: '#FFF',
	},
	tabText: {
		color: '#999',
		fontSize: 14,
	},
	activeTabText: {
		color: '#FFF',
		fontWeight: '600',
	},
	detailsContainer: {
		flex: 1,
	},
	detailItem: {
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#333',
	},
	detailHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4,
	},
	detailTitle: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: '600',
	},
	synopsisPreview: {
		color: '#999',
		fontSize: 14,
		lineHeight: 20,
	},
	detailContent: {
		color: '#999',
		fontSize: 14,
	},
	bookButton: {
		backgroundColor: '#333',
		paddingVertical: 16,
		borderRadius: 8,
		marginVertical: 16,
		alignItems: 'center',
	},
	bookButtonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: '600',
	},
});

