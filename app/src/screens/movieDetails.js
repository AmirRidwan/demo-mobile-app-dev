import React from 'react';
import {  View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView, StatusBar, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
// import { StarRatingDisplay } from 'react-native-star-rating-widget';


export default MovieDetails = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { movieData } = route.params 

	return (
		<SafeAreaView style={styles.container}>			
			{/* HEADER */}
			<View style={styles.header}>
				<Pressable 
					style={styles.headerButton}
					onPress={() => navigation.goBack()}
				>
					<Icon name="arrow-back" size={24} color="#FFF" />
				</Pressable>
				<Pressable style={styles.headerButton}>
					<Icon name="resize" size={24} color="#FFF" />
				</Pressable>
			</View>
			
			{/* TRAILER */}
			<View style={styles.trailerContainer}>
				<Pressable style={styles.playButton}>
					<Icon name="play" size={40} color="#FFF" />
				</Pressable>
				
				<View style={styles.trailerLabelContainer}>
					<View style={styles.trailerLabel}>
						<Text style={styles.trailerText}>TRAILER</Text>
					</View>
				</View>
				
				<Pressable style={styles.volumeButton}>
					<Icon name="volume-mute-outline" size={24} color="#FFF" />
				</Pressable>
			</View>

			{/* MOVIE INFO */}
			<View style={styles.movieInfoCard}>
				<View style={styles.movieBasicInfo}>
					<View style={styles.movieImageContainer}>
						<Image source={{ uri: movieData.poster }} style={styles.movieImage} resizeMode="cover"/>
					</View>
					
					<View style={styles.titleContainer}>
						<Text style={styles.movieTitle}>{movieData.title}</Text>
						
						<View style={styles.genreContainer}>
							{ movieData.genre.map((genre) => {
								return (
									<View key={genre} style={styles.genreTag}>
										<Text style={styles.genreText}>{ genre }</Text>
									</View>
								)
							})}
						</View>
						
						<View style={styles.metaContainer}>
							<View style={styles.metaItem}>
								<Icon name="calendar-outline" size={16} color="#999" />
								<Text style={styles.metaText}>{movieData.release}</Text>
							</View>
							<View style={styles.metaItem}>
								<Icon name="alert-circle-outline" size={16} color="#999" />
								<Text style={styles.metaText}>{movieData.age_rating}</Text>
							</View>
							<View style={styles.metaItem}>
								<Icon name="time-outline" size={16} color="#999" />
								<Text style={styles.metaText}>{movieData.runtime.hour}h {movieData.runtime.minute}m</Text>
							</View>
						</View>
						
						<View style={styles.ratingContainer}>
							<Icon name="star" size={14} color="#FFD700" />
							{/* <StarRatingDisplay rating={movieData.rating.star}/> */}
							<Text style={styles.ratingText}>{movieData.rating.star}/5 ({movieData.rating.totalRatings})</Text>
						</View>
					</View>
					
					<Pressable style={styles.favoriteButton}>
						<Icon name="heart-outline" size={24} color="#FFF" />
					</Pressable>
				</View>
				
				{/* Tab Navigation */}
				<View style={styles.tabContainer}>
					<Pressable style={[styles.tab, styles.activeTab]}>
						<Text style={[styles.tabText, styles.activeTabText]}>Movie Details</Text>
					</Pressable>
					<Pressable style={styles.tab}>
						<Text style={styles.tabText}>Ratings & Reviews</Text>
					</Pressable>
				</View>
				
				{/* Movie Details Content */}
				<ScrollView style={styles.detailsContainer}>
					{/* Synopsis */}
					<Pressable style={styles.detailItem}>
						<View style={styles.detailHeader}>
							<Text style={styles.detailTitle}>Full synopsis</Text>
							<Icon name="chevron-forward" size={20} color="#999" />
						</View>
						<Text style={styles.synopsisPreview} numberOfLines={3}>{movieData.details.sypnosis}</Text>
					</Pressable>
					
					{/* Cast */}
					<Pressable style={styles.detailItem}>
						<View style={styles.detailHeader}>
							<Text style={styles.detailTitle}>Casts</Text>
							<Icon name="chevron-forward" size={20} color="#999" />
						</View>
						<Text style={styles.detailContent}>{movieData.details.cast}</Text>
					</Pressable>
					
					{/* Director */}
					<Pressable style={styles.detailItem}>
						<View style={styles.detailHeader}>
							<Text style={styles.detailTitle}>Director</Text>
							<Icon name="chevron-forward" size={20} color="#999" />
						</View>
						<Text style={styles.detailContent}>{movieData.details.director}</Text>
					</Pressable>
					
					{/* Writers */}
					<Pressable style={styles.detailItem}>
						<View style={styles.detailHeader}>
							<Text style={styles.detailTitle}>Writers</Text>
							<Icon name="chevron-forward" size={20} color="#999" />
						</View>
						<Text style={styles.detailContent}>{movieData.details.writers}</Text>
					</Pressable>
				</ScrollView>
				
				{/* Book Ticket Button */}
				<Pressable 
					style={styles.bookButton}
					onPress={() => navigation.navigate('TicketBooking', { movieData })}
				>
					<Text style={styles.bookButtonText}>Book Ticket</Text>
				</Pressable>
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
		bottom: 30,
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

	movieImageContainer: {
		width: '100',
		height: 150,
		marginRight: 10,
		borderRadius: 8,
		overflow: 'hidden',
		backgroundColor: '#222',
	},
	movieImage: {
		width: '100%',
		height: '100%',
		borderRadius: 12,
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
		flex: 1,
		paddingVertical: 12,
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor: '#FFF',
	},
	tabText: {
		textAlign: "center",
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

