import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default Payment = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { movieId, seats, subtotal } = route.params 

	const payForMovie = () => {
		fetch(`${apiLink}/seatsManager/payForSeat`, {
			method: "POST",
			body: {
				movieId,
				seats, 
				subtotal,
				payment: {}
			}
		})
		.then((res) => res.json())
		.then((data) => {
			setTimeList(data.time)
		})
		.catch((error) => {
			console.error("Error fetching available time:", error);
			Snackbar.show({ text: 'An error has occured, please check back later', duration: Snackbar.LENGTH_SHORT,});
		});
	}

	return (
		<SafeAreaView style={paymentStyles.container}>

			<Pressable style={paymentStyles.headerButton} onPress={() => { navigation.goBack() }}>
				<Icon name="arrow-back" size={24} color="white" />
			</Pressable>	
			<Text style={paymentStyles.headerTitle}>Payment</Text>

			<View style={paymentStyles.contentContainer}>
				<Text style={paymentStyles.questionText}>How would you like to make the payment? Kindly select your preferred option</Text>

				<Pressable style={paymentStyles.optionBox} onPress={() => navigation.navigate('PaymentSuccess')}>
					<View style={paymentStyles.iconTextContainer}>
						<MaterialIcon name="credit-card-outline" size={22} color="white" />
						<View style={paymentStyles.textContainer}>
							<Text style={paymentStyles.title}>Debit card</Text>
							<Text style={paymentStyles.subText}>Pay with 💳 VISA</Text>
						</View>
					</View>
					<Icon name="chevron-forward" size={20} color="#999" />
				</Pressable>

				<Pressable style={paymentStyles.optionBox} onPress={() => navigation.navigate('PaymentSuccess')}>
					<View style={paymentStyles.iconTextContainer}>
						<MaterialIcon name="bank-transfer" size={22} color="white" />
						<View style={paymentStyles.textContainer}>
							<Text style={paymentStyles.title}>Bank Transfer</Text>
							<Text style={paymentStyles.subText}>Make a transfer from your bank account</Text>
						</View>
					</View>
					<Icon name="chevron-forward" size={20} color="#999" />
				</Pressable>

				<Pressable style={paymentStyles.optionBox} onPress={() => navigation.navigate('PaymentSuccess')}>
					<View style={paymentStyles.iconTextContainer}>
						<MaterialIcon name="bitcoin" size={22} color="white" />
						<View style={paymentStyles.textContainer}>
							<Text style={paymentStyles.title}>Crypto wallets</Text>
							<Text style={paymentStyles.subText}>Pay from your cryptocurrency wallet</Text>
						</View>
					</View>
					<Icon name="chevron-forward" size={20} color="#999" />
				</Pressable>
			</View>
			
		</SafeAreaView>
	);
};

const paymentStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#111',
	},

	headerButton: {
		position: 'absolute',
		top: 30,
		left: 15,
		zIndex: 100,
		height: 20,
	},
	headerTitle: {
		backgroundColor: 'black',
		color: 'white', 
		fontSize: 18, 
		fontWeight: 'bold', 
		textAlign: 'center',
		paddingVertical: 15,
		paddingTop: 30
	},

	contentContainer: {
		padding: 20,
		flexDirection: "column"
	},

	questionText: {
		color: '#eee',
		fontSize: 14,
		lineHeight: 20,
		fontWeight: '400',
		marginBottom: 20
	},
	optionBox: {
		backgroundColor: '#1a1a1a',
		borderRadius: 10,
		padding: 15,
		marginBottom: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	iconTextContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	textContainer: {
		marginLeft: 12,
	},
	title: {
		color: '#fff',
		fontSize: 15,
		fontWeight: '500',
	},
	subText: {
		color: '#aaa',
		fontSize: 12,
		marginTop: 2,
	},
});
