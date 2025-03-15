import React, {useState} from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';

const getNext7Days = () => {
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	const today = new Date();
	const currentMonth = months[today.getMonth()];

	const dates = Array.from({ length: 7 }, (_, i) => {
		const date = new Date();
		date.setDate(today.getDate() + i);

		return {
			day: days[date.getDay()],
			date: date.getDate(),
		};
	});

	return {
		dates,
		month: currentMonth,
	};
};

export default TicketBooking = () => {
	const [selectedLocation, setSelectedLocation] = useState();
	const [selectedCinema, setSelectedCinema] = useState();
	
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);

	const [selectedSeats, setSelectedSeats] = useState(new Set());
	
	const next7Days = getNext7Days()

	const times = ['9:20AM', '11:40AM', '1:20PM', '3:30PM', '5:40PM', '7:30PM', '9:20PM'];

	const seatRows = 'ABCDEFGH'.split('');

	// TEMP SHOW
	const seatStatus = {
		B4: 2,
		B5: 2,
		C6: 2,
		D7: 2,
		E3: 2,
		F4: 2
	}


	const handleSeatPress = (seatId) => {
		setSelectedSeats((prevSelected) => {
			const updated = new Set(prevSelected);
			if (updated.has(seatId)) {
				updated.delete(seatId);
			} else {
				updated.add(seatId);
			}
			return updated;
		});
	};

	const seatPrice = 2500;

	return (
		<SafeAreaView style={TicketBookingStyles.container}>	
			<Pressable style={TicketBookingStyles.headerButton} onPress={() => navigation.goBack()}>
				<Icon name="arrow-back" size={24} color="white" />
			</Pressable>	
			<Text style={TicketBookingStyles.title}>Ticket Booking</Text>
	

			<ScrollView style={TicketBookingStyles.scrollContainer}>

				<Text  style={TicketBookingStyles.description}>Where would you like to see the movie? Kindly select as appropriate</Text>

				{/* SEAT TIER??? */}
				<View>
					<View>
						<Text>Tickets from</Text>
					</View>
				</View>

				{/* LOCATION */}
				<Text style={TicketBookingStyles.selectorLabel}>Location</Text>
				<View style={TicketBookingStyles.dropdownWrapper}>
					<Picker selectedValue={selectedLocation} style={TicketBookingStyles.picker} onValueChange={itemValue => setSelectedLocation(itemValue)}>
						<Picker.Item label="Select Location" value={null} />
						{/* <Picker.Item label="Lagos" value="lagos" />
						<Picker.Item label="Abuja" value="abuja" /> */}
					</Picker>
				</View>

				{/* HALL */}
				<Text style={TicketBookingStyles.selectorLabel}>Cinema Location</Text>
				<View style={TicketBookingStyles.dropdownWrapper}>
					<Picker selectedValue={selectedCinema} style={TicketBookingStyles.picker} onValueChange={itemValue => setSelectedCinema(itemValue)}>
						<Picker.Item label="Select Cinema Hall" value={null} />
						<Picker.Item label="Silverbird" value="silverbird" />
						<Picker.Item label="Genesis" value="genesis" />
					</Picker>
				</View>

				{/* DATE */}
				<Text style={TicketBookingStyles.selectorLabel}>Select a date</Text>
				<Text style={TicketBookingStyles.dateMonth}>| {next7Days.month} |</Text>
				<View style={TicketBookingStyles.dateRow}>
					{next7Days.dates.map((date, index) => (
						<Pressable
							key={index}
							style={[TicketBookingStyles.dateBox, selectedDate === index && TicketBookingStyles.selectedBox]}
							onPress={() => setSelectedDate(index)}
						>
							<Text style={TicketBookingStyles.dateText}>{date.day}</Text>
							<Text style={TicketBookingStyles.dateText} >{date.date}</Text>
						</Pressable>
					))}
				</View>

				{/* TIME */}
				<Text style={TicketBookingStyles.selectorLabel}>Available Time</Text>
				<View style={TicketBookingStyles.timeRow}>
					{times.map((time, index) => (
						<Pressable
							key={index}
							style={[TicketBookingStyles.timeBox, selectedTime === index && TicketBookingStyles.selectedBox]}
							onPress={() => setSelectedTime(index)}>
							<Text style={TicketBookingStyles.timeText}>{time}</Text>
						</Pressable>
					))}
				</View>

				{/* SEAT SELECTION */}
				<Text style={TicketBookingStyles.seatSelectorLabel}>Select Seat</Text>
				<View style={TicketBookingStyles.legendContainer}>
					<View style={TicketBookingStyles.legendItem}>
						<View style={TicketBookingStyles.seat} />
						<Text style={TicketBookingStyles.legendLabel}>Available</Text>
					</View>
					<View style={TicketBookingStyles.legendItem}>
						<View style={TicketBookingStyles.seat}>
							<Icon name="close" size={17} color="lightgray" style={{margin: 0}}/>
						</View>
						<Text style={TicketBookingStyles.legendLabel}>Unavailable</Text>
					</View>
					<View style={TicketBookingStyles.legendItem}>
						<View style={[TicketBookingStyles.seat, TicketBookingStyles.seatSelected]} />
						<Text style={TicketBookingStyles.legendLabel}>Selected</Text>
					</View>
				</View>

				{/* CINEMA VIEW */}
				<View style={TicketBookingStyles.screen} />
				<Text style={TicketBookingStyles.screenLabel}>Screen</Text>

				{seatRows.map(row => (
					<View key={row} style={TicketBookingStyles.seatRow}>
						<Text style={TicketBookingStyles.rowLabel}>{row}</Text>

						{[...Array(8)].map((_, colIdx) => {
							const seatId = `${row}${colIdx + 1}`;
							if ((colIdx == 0 || colIdx == 7) && (row === "A" || row === "H")) {
								return <View key={seatId} style={[TicketBookingStyles.seat, TicketBookingStyles.seatBlank]} />;
							}
							if (seatStatus[seatId] === 2) {
								return (
									<View key={seatId} style={TicketBookingStyles.seat}>
										<Icon name="close" size={17} color="lightgray" />
									</View>
								);
							}
							const isSelected = selectedSeats.has(seatId);
							return (
								<Pressable
									key={seatId}
									style={[
										TicketBookingStyles.seat,
										isSelected && TicketBookingStyles.seatSelected
									]}
									onPress={() => handleSeatPress(seatId)}
								/>
							);
						})}

						<Text style={TicketBookingStyles.rowLabel}>{row}</Text>
					</View>
				))}

				<View style={TicketBookingStyles.bottomPanel}>
					<View style={TicketBookingStyles.summaryBox}>
						<Text style={TicketBookingStyles.summaryText}>SEAT</Text>
						<Text style={TicketBookingStyles.selectedSeats}>{Array.from(selectedSeats).join(', ')}</Text>
					</View>
					<View style={TicketBookingStyles.summaryBox}>
					<Text style={TicketBookingStyles.summaryText}>SUB-TOTAL</Text>
					<Text style={TicketBookingStyles.subtotal}>
						₦{selectedSeats.length * seatPrice}
					</Text>
					</View>
				</View>

				<View style={TicketBookingStyles.actionButtons}>
					<Pressable style={TicketBookingStyles.cancelButton}>
					<Text style={TicketBookingStyles.cancelText}>Cancel</Text>
					</Pressable>
					<Pressable style={TicketBookingStyles.proceedButton}>
					<Text style={TicketBookingStyles.proceedText}>Proceed</Text>
					</Pressable>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const TicketBookingStyles = StyleSheet.create({
	container: {
		flex: 1, 
		backgroundColor: 'black', 
	},
	scrollContainer: {
		padding: 20
	},
	headerButton: {
		position: 'absolute',
		top: 20,
		left: 15,
		zIndex: 100,
		height: 20,
	},
	title: {
		backgroundColor: 'black',
		color: 'white', 
		fontSize: 18, 
		fontWeight: 'bold', 
		textAlign: 'center',
		paddingVertical: 15
	},
	description: {
		color: 'lightgray',
		fontSize: 13
	},
	selectorLabel: {
		marginTop: 9,
		color: 'lightgray'
	},

	dropdownWrapper: {
		height: 40,
		paddingHorizontal: 10,
		paddingVertical: 0,
		borderWidth: 1,
		borderColor: '#555',
		borderRadius: 10,
		backgroundColor: 'white',
		justifyContent: 'center',
		marginBottom: 10
	},
	picker: {
		color: 'gray',
		fontSize: 16,
		width: '100%',
	},

	dateRow: {
		flexDirection: 'row',
		flexWrap: 'nowrap',
		gap: 8
	},
	dateBox: {
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 2,
		borderRadius: 8,
		marginRight: 8,
		marginBottom: 8
	},
	dateMonth: {
		color: 'gray',
		fontSize: 12,
		paddingHorizontal: 5
	},
	dateText: {
		color: '#fff',
		fontSize: 12,
		textAlign: 'center'
	},

	timeRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
		marginTop: 8
	},
	timeBox: {
		width: 80,
		borderWidth: 0.5,
		borderColor: "lightgray",
		paddingVertical: 10,
		paddingHorizontal: 10,
		borderRadius: 10,
		marginBottom: 5
	},
	timeText: {
		color: '#fff',
		textAlign: 'center',
	},
	selectedBox: {
		backgroundColor: '#00f',
	},

	seatSelectorLabel: {
		marginTop: 15,
		fontSize: 14,
		color: 'lightgray',
		textAlign: 'center'
	},	
	legendContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginVertical: 10,
	},
	legendItem: {
		flexDirection: 'row', 
		alignItems: 'center'
	},
	legendLabel: {
		color: 'gray', 
		marginLeft: 5
	},
	seat: {
		backgroundColor: '#444',
		width: 20, 
		height: 20, 
		borderRadius: 4,
		padding: 1
	},
	seatBlank: {
		backgroundColor: "black"
	},
	seatSelected: {
		backgroundColor: "lightgray"
	},


	screenLabel: {
		textAlign: 'center', 
		color: '#888',
		marginTop: 5,
		marginBottom: 20
	},
	screen: {
		height: 15,
		backgroundColor: '#444',
		marginHorizontal: 40,
		borderRadius: 50,
		marginTop: 20,
	},
	seatRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 4,
		gap: 5
	},
	// seat: {
	// 	width: 20,
	// 	height: 20,
	// 	margin: 4,
	// 	borderRadius: 4,
	// },
	rowLabel: {color: '#888', width: 16, textAlign: 'center'},
	bottomPanel: {
		backgroundColor: '#111',
		borderRadius: 8,
		padding: 16,
		marginTop: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	summaryBox: {},
	summaryText: {color: '#AAA', fontSize: 12},
	selectedSeats: {color: 'white', marginTop: 4},
	subtotal: {color: 'white', marginTop: 4},
	actionButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
	},
	cancelButton: {
		flex: 1,
		backgroundColor: 'white',
		padding: 12,
		marginRight: 10,
		borderRadius: 6,
		alignItems: 'center',
	},
	cancelText: {color: 'black', fontWeight: 'bold'},
	proceedButton: {
		flex: 1,
		backgroundColor: '#555',
		padding: 12,
		borderRadius: 6,
		alignItems: 'center',
	},
	proceedText: {color: 'white', fontWeight: 'bold'},
});