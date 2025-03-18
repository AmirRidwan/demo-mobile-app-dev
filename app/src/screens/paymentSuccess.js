import React from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet, Image  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default SuccessScreen = () => {
    const navigation = useNavigation();
	const route = useRoute();
	const  { movieData, movieId, cinema, date, time, seats, subtotal } = route.params 

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Image
					source={require('../assets/checkmark.png')}
					style={styles.checkmark}
				/>

				<Text style={styles.title}>Congratulations!</Text>
				<Text style={styles.subtitle}>
					Your ticket purchase is successful, a confirmation has{'\n'}been sent to your e-mail
				</Text>

				<View style={styles.buttonRow}>
					<Pressable style={styles.button} onPress={() => navigation.navigate('MainTabs', { screen: 'Home'})}>
						<Text style={styles.buttonText}>⬅ Main menu</Text>
					</Pressable>

					<Pressable style={styles.button} onPress={() => navigation.navigate('BookingSummary',  { movieData, movieId, cinema, date, time, seats, subtotal, paid: true })}>
						<Text style={styles.buttonText}>🎟 View ticket</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	checkmark: {
		width: 130,
		height: 130,
		marginBottom: 30,
		// tintColor: 'white',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 100,
	},
	title: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	subtitle: {
		color: '#bbb',
		fontSize: 14,
		textAlign: 'center',
		marginBottom: 30,
	},
	buttonRow: {
		flexDirection: 'row',
		gap: 10,
	},
	button: {
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 16,
		marginHorizontal: 5,
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
	},
});
