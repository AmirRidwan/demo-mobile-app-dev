import { View, Text, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, TouchableOpacity, StatusBar, Pressable, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


export default MovieList = ({children, title, viewAllAction}) => {
    return (
        <View style={MovieListStyles.sectionContainer}>
            <View style={MovieListStyles.sectionHeader}>
            <Text style={MovieListStyles.sectionTitle}>{title}</Text>
            <TouchableOpacity onPress={viewAllAction}>
                <Text style={MovieListStyles.viewAllText}>View All</Text>
            </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={MovieListStyles.movieRow}>
				{ children }
			</ScrollView>
        </View>
    );
}


const MovieListStyles= StyleSheet.create({
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
		paddingHorizontal: 15,
		gap: 10
	},
})