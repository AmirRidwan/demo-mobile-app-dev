import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Snackbar from 'react-native-snackbar';

export default Payment = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { movieData, movieId, cinema, date, time, seats, subtotal } = route.params 

	const [paid, setPaid] = useState(false)

	const apiLink = "http://10.0.2.2:3000"

	const payForMovie = () => {
		fetch(`${apiLink}/seatsManager/payForSeat`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				movieId,
				seats, 
				subtotal,
				payment: {}
			})
		})
		.then((res) => res.json())
		.then((data) => {
			console.log(data)
			if(data.code == 200) {
				setPaid(true)
				navigation.navigate('PaymentSuccess', { movieData, movieId, cinema, date, time, seats, subtotal })
			}
		})
		.catch((error) => {
			console.error("Error :", error);
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

				<View style={paymentStyles.optionContainer}>
					<Pressable style={paymentStyles.optionBox} onPress={ payForMovie} disabled={paid}>
						<View style={paymentStyles.iconTextContainer}>
							<MaterialIcon name="credit-card-outline" size={22} color="white" />
							<View style={paymentStyles.textContainer}>
								<Text style={paymentStyles.title}>Debit card</Text>
								<Text style={paymentStyles.subText}>Pay with 💳 VISA</Text>
							</View>
						</View>
						<Icon name="chevron-forward" size={20} color="#999" />
					</Pressable>

					<View style={paymentStyles.dividerLine}/>

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

					<View style={paymentStyles.dividerLine}/>

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
		top: 45,
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
		paddingTop: 45
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
	optionContainer: {
		backgroundColor: 'black',
		borderRadius: 10,
	},
	optionBox: {
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	dividerLine: {
		marginHorizontal: 40,
		borderWidth: 0.5,
		height: 1,
		borderColor: 'gray'
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
