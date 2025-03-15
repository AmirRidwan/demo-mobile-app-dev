import { View, Text, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, TouchableOpacity, StatusBar, Pressable, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


export default MovieCard = ({id, title, image}) => {
	const navigation = useNavigation();
	return (
		<View>
			<Pressable onPress={() => navigation.navigate("MovieDetails", { id })} style={MovieCardStyles.movieCard}>
				<View style={MovieCardStyles.movieImageContainer}>
					<View style={MovieCardStyles.movieImagePlaceholder} />
				</View>
			</Pressable>
			<View style={MovieCardStyles.movieInfoContainer}>
				<View style={MovieCardStyles.movieTitleContainer}>
					<Text style={MovieCardStyles.movieTitle}>
						{title}
					</Text>
				</View>
				<Pressable onPress={console.log('Movie Options')} style={MovieCardStyles.movieOptionsButton}>
					<Icon name="ellipsis-vertical" size={16} color="#666" />
				</Pressable>
			</View>
		</View>
	)
}


const MovieCardStyles = StyleSheet.create({
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
	movieInfoContainer: {
		flexDirection: 'row', // put title + icon in same row
		alignItems: 'flex-start',
		marginTop: 4,
	},

	movieTitleContainer: {
		flex: 1, // take up available space
		paddingRight: 8, // some breathing room from the icon
	},

	movieTitle: {
		color: '#FFF',
		fontSize: 11,
		fontWeight: '400',
	},

	movieOptionsButton: {
		padding: 4,
	},
})