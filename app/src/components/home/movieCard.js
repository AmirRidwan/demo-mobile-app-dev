import { View, Text, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, TouchableOpacity, StatusBar, Pressable, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


export default MovieCard = ({movieData, title, image}) => {
	const navigation = useNavigation();
	return (
		<View style={MovieCardStyles.cardContainer}>
			<Pressable onPress={() => navigation.navigate("MovieDetails", { movieData })} style={MovieCardStyles.movieCard}>
				<View style={MovieCardStyles.movieImageContainer}>
					<Image source={{ uri: image }} style={MovieCardStyles.movieImage} resizeMode="cover"/>
				</View>
			</Pressable>
			<View style={MovieCardStyles.movieInfoContainer}>
				<View style={MovieCardStyles.movieTitleContainer}>
					<Text style={MovieCardStyles.movieTitle}>
						{title}
					</Text>
				</View>
				<Pressable onPress={() => console.log('Movie Options')} style={MovieCardStyles.movieOptionsButton}>
					<Icon name="ellipsis-vertical" size={16} color="#666" />
				</Pressable>
			</View>
		</View>
	)
}


const MovieCardStyles = StyleSheet.create({
	cardContainer: {
		width: 150,
	},
    movieCard: {
		width: 150,
	},
	movieImageContainer: {
		width: '100%',
		height: 200,
		borderRadius: 8,
		overflow: 'hidden',
		backgroundColor: '#222',
	},
	movieImage: {
		width: '100%',
		height: '100%',
		borderRadius: 12,
	},
	movieInfoContainer: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		marginTop: 5,
	},

	movieTitleContainer: {
		flex: 1, 
		paddingLeft: 5,
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