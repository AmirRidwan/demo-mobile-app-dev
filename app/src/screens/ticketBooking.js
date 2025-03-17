import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { io } from 'socket.io-client';
import Snackbar from 'react-native-snackbar';

import SelectorLabel from '../components/ticketBooking/selectorLabel';

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
			month: months[date.getMonth()],
			year: date.getFullYear()
		};
	});

	return {
		dates,
		month: currentMonth,
	};
};


const apiLink = "http://10.0.2.2:3000"


export default TicketBooking = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { movieData } = route.params 

	const [locationList, setLocationList] = useState({})
	const [cinemaList, setCinemaList] = useState([])
	const [timeList, setTimeList] = useState([])

	const [selectedLocation, setSelectedLocation] = useState(null);
	const [selectedCinema, setSelectedCinema] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);
	const [selectedSeats, setSelectedSeats] = useState(new Set());


	const [movieId, setMovieId] = useState("")
	const [seatPrice, setSeatPrice] = useState(2500);

	const next7Days = getNext7Days()
	const seatRows = 'ABCDEFGH'.split('');

	const hasMovieData = useMemo(() => {
		return (
			movieData &&
			movieId &&
			selectedCinema &&
			selectedDate &&
			selectedTime &&
			selectedSeats.size > 0 &&
			seatPrice
		);
	}, [movieData, movieId, selectedCinema, selectedDate, selectedTime, selectedSeats, seatPrice]);

	const [seatStatus, setSeatStatus] = useState({})
	const [socket, setSocket] = useState(null);

	// GET ALL CINEMA LOCATIONS (STATE AND CINEMA PLACE)
	const getCinemaLocations = () => {
		fetch(`${apiLink}/movie/cinemaList`, {
			method: "GET",
		})
		.then((res) => res.json())
		.then((data) => {
			setLocationList(data.locations)
			setCinemaList(Object.values(data.locations).flat())
		})
		.catch((error) => {
			console.error("Error fetching locations:", error);
			Snackbar.show({ text: 'An error has occured, please check back later', duration: Snackbar.LENGTH_SHORT,});
		});
	}

	// GET AVAILABLE SHOWTIMES CALLED AFTER DATE IS SELECTED
	const getAvailableTime = () => {
		fetch(`${apiLink}/movie/movieTimes?id=${movieData.id}&date=${selectedDate}`, {
			method: "GET",
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

	// CONNECT WEBSOCKET TO GET LIVE SEAT SELECTIONS
	const getLiveSeatData = (time) => {

		setMovieId(`${movieData.id}-${selectedCinema}-${selectedDate.date}-${time}`.toLowerCase().replace(/\s+/g, ''))
		const newSocket = io('http://10.0.2.2:3000', {
			transports: ['websocket'],
			timeout: 5000,
		});
	
		setSocket(newSocket);
	
		newSocket.on('connect', () => {
			console.log('Connected to server');
			newSocket.emit('join_movie', `${movieData.id}-${selectedCinema}-${selectedDate.date}-${time}`.toLowerCase().replace(/\s+/g, ''));
		});
	
		newSocket.on('seat_status', (seats) => {
			console.log('Seat Status Update:', seats);
			setSeatStatus({...seats});
		});
	
		newSocket.on('disconnect', () => {
			console.log('Disconnected from server');
		});
	
		newSocket.on('connect_error', (err) => {
			console.log('Connection Error:', err.message);
		});
	
		return () => newSocket.disconnect();
	}

	const disconnectSocket = () => {
		socket.disconnect()
		setSocket(null)
	}

	const handleSeatPress = (seatId) => {
		setSelectedSeats((prevSelected) => {
			const updated = new Set(prevSelected);
			if (updated.has(seatId)) {
				// DESELECT
				updated.delete(seatId);
				socket.emit('deselect_seat', {movieId, seatId} );
				setSeatStatus((prev) => {
					const newStatus = { ...prev };
					delete newStatus[seatId];
					return newStatus;
				});
			} else {
				// SELECT
				updated.add(seatId);
				socket.emit('select_seat', {movieId, seatId} );
				setSeatStatus((prev) => ({
					...prev,
					[seatId]: 1,
				}));
			}
			return updated;
		});
	};

	const cancelSeatSelection = () => {
		if (socket !== null) {
			selectedSeats.forEach(seatId => {
				socket.emit('deselect_seat', { movieId, seatId });
			});
			disconnectSocket()
		}
	}


	
	const scrollViewRef = useRef();

	useEffect(() => {
		getCinemaLocations()
		if (hasMovieData) {
			getLiveSeatData(selectedTime)
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			if (hasMovieData) {
				getLiveSeatData(selectedTime);
			}
		}, [hasMovieData, selectedTime])
	);


	return (
		<SafeAreaView style={TicketBookingStyles.container}>	
			<Pressable style={TicketBookingStyles.headerButton} onPress={() => { cancelSeatSelection(); navigation.goBack() }}>
				<Icon name="arrow-back" size={24} color="white" />
			</Pressable>	
			<Text style={TicketBookingStyles.title}>Ticket Booking</Text>
	

			<ScrollView
				ref={scrollViewRef}
				style={TicketBookingStyles.scrollContainer}
				onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
			>
				<Text style={TicketBookingStyles.description}>Where would you like to see the movie? Kindly select as appropriate</Text>

				{/* SEAT TIER??? */}
				<View style={TicketBookingStyles.seatTierContainer}>
					<View style={TicketBookingStyles.seatTier}>
						<Text style={TicketBookingStyles.tierTextIndicate}>Tickets from</Text>
						<Text style={TicketBookingStyles.tierText}>NGN 2000 - NGN 5000</Text>
					</View>
					<View style={TicketBookingStyles.seatTier}>
						<Text style={TicketBookingStyles.tierTextIndicate}>Tickets from</Text>
						<Text style={TicketBookingStyles.tierText}>NGN 1500 - NGN 4500</Text>
					</View>
				</View>

				{/* LOCATION */}
				<SelectorLabel label={"Location"} />
				<View style={TicketBookingStyles.dropdownWrapper}>
					<Picker 
						selectedValue={selectedLocation} 
						style={TicketBookingStyles.picker} 
						onValueChange={(state) => {setSelectedLocation(state); setSelectedCinema(null); setSelectedDate(null); setSelectedTime(null); setCinemaList(locationList[state])}}
					>
						<Picker.Item label="Select Location" value={null} />
						{ Object.keys(locationList).map((states, index) => (<Picker.Item key={index} label={states} value={states} />)) }
					</Picker>
				</View>

				{/* HALL */}
				<SelectorLabel label={"Cinema Location"} />
				<View style={TicketBookingStyles.dropdownWrapper}>
					<Picker 
						selectedValue={selectedCinema} 
						style={TicketBookingStyles.picker} 
						onValueChange={itemValue => {setSelectedCinema(itemValue); setSelectedDate(null); setSelectedTime(null); cancelSeatSelection()}}
					>
						<Picker.Item label="Select Cinema Hall" value={null} />
						{ cinemaList.map((cinema, index) => (<Picker.Item key={index} label={cinema} value={cinema} />)) }
					</Picker>
				</View>

				{/* DATE */}
				{ selectedCinema && ( <>
					<SelectorLabel label={"Date"} />
					<Text style={TicketBookingStyles.dateMonth}>• {next7Days.month} •</Text>
					<View style={TicketBookingStyles.dateRow}>
						{next7Days.dates.map((date, index) => (
							<Pressable
								key={index}
								style={[TicketBookingStyles.dateBox, selectedDate?.date === date.date && TicketBookingStyles.selectedBox]}
								onPress={() => {setSelectedDate(date); getAvailableTime(date); setSelectedTime(null); cancelSeatSelection()}}
							>
								<Text style={TicketBookingStyles.dateText}>{date.day}</Text>
								<Text style={TicketBookingStyles.dateText}>{date.date}</Text>
							</Pressable>
						))}
					</View>
				</>)}
				

				{/* TIME */}
				{selectedDate && ( <>
					<SelectorLabel label={"Available Time"} />

					<View style={TicketBookingStyles.timeRow}>
						{Array.isArray(timeList) && timeList.length > 0 ? (
							timeList.map((time, index) => (
							<Pressable
								key={index}
								style={[ TicketBookingStyles.timeBox, selectedTime === time && TicketBookingStyles.selectedBox]}
								onPress={() => { setSelectedTime(time); cancelSeatSelection(); getLiveSeatData(time)}}
							>
								<Text style={TicketBookingStyles.timeText}>{time}</Text>
							</Pressable>
							))
						) : ( <Text style={TicketBookingStyles.noTimeText}>No available times.</Text>)
						}
					</View>
				</>)}

				{/* SEAT SELECTION */}
				{ selectedTime && ( <>
					{/* TITLE AND LEGEND */}
					<SelectorLabel label={"Select Seat"} />
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
							<View style={[TicketBookingStyles.seat, TicketBookingStyles.userSeatSelected]} />
							<Text style={TicketBookingStyles.legendLabel}>Selected</Text>
						</View>
						<View style={TicketBookingStyles.legendItem}>
							<View style={[TicketBookingStyles.seat, TicketBookingStyles.seatSelected]} />
							<Text style={TicketBookingStyles.legendLabel}>Booked</Text>
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

								{/* NO SEATS ON A1 A8 H1 H8 */}
								if ((colIdx == 0 || colIdx == 7) && (row === "A" || row === "H")) {
									return <View key={seatId} style={[TicketBookingStyles.seat, TicketBookingStyles.seatBlank]} />;
								}

								{/* USER SELECTED SEATS, IF LOCAL VARIABLE HAS SEAT ID MEANS THIS USER SELECTED AND CAN EDIT, ELSE ITS OTHER USERS BOOKED */}
								if (seatStatus[seatId] == 1) {
									return (
										<Pressable
											key={seatId}
											style={[TicketBookingStyles.seat,  (selectedSeats.has(seatId) ? TicketBookingStyles.userSeatSelected : TicketBookingStyles.seatSelected )]}
											onPress={() => selectedSeats.has(seatId) ? handleSeatPress(seatId) : null}
										/>
									);
								}

								{/* UNAVAILABLE SEATS - ALREADY BOUGHT / MAINTENANCE */}
								if (seatStatus[seatId] == 2) {
									return (
										<View key={seatId} style={TicketBookingStyles.seat}>
											<Icon name="close" size={17} color="lightgray" />
										</View>
									);
								}

								{/* AVAILABLE SEATS */}
								return (
									<Pressable
										key={seatId}
										style={[TicketBookingStyles.seat]}
										onPress={() => handleSeatPress(seatId)}
									/>
								);
							})}

							<Text style={TicketBookingStyles.rowLabel}>{row}</Text>
						</View>
					))}

					{/* BOOKING INFO */}
					<View style={TicketBookingStyles.bookingInfoContainer}>
						<View style={TicketBookingStyles.summaryBox}>
							<Text style={TicketBookingStyles.summaryText}>SEAT</Text>
							<Text style={TicketBookingStyles.selectedSeats}>
								{ Array.from(selectedSeats).sort((a, b) => {
									const [rowA, colA] = [a.charAt(0), parseInt(a.slice(1))];
									const [rowB, colB] = [b.charAt(0), parseInt(b.slice(1))];

									if (rowA < rowB) return -1;
									if (rowA > rowB) return 1;

									return colA - colB;
								}).join(', ')}
							</Text>					
						</View>
						<View style={TicketBookingStyles.summaryBox}>
						<Text style={TicketBookingStyles.summaryText}>SUB-TOTAL</Text>
						<Text style={TicketBookingStyles.subtotal}>₦ {(selectedSeats.size * seatPrice) || 0}</Text>
						</View>
					</View>

					
				</>)}
			</ScrollView>

			{/* CANCEL AND PROCEED */}
			<View style={TicketBookingStyles.actionButtons}>
				<Pressable style={TicketBookingStyles.cancelButton} onPress={() => { cancelSeatSelection(); navigation.goBack() }}>
					<Text style={TicketBookingStyles.cancelText}>Cancel</Text>
				</Pressable>
				<Pressable 
					style={[TicketBookingStyles.proceedButton, (!hasMovieData && TicketBookingStyles.disabledButton)]} 
					disabled={!hasMovieData}
					onPress={() => {
						disconnectSocket()
						navigation.navigate('BookingSummary', { 
							movieData, 
							movieId, 
							cinema: selectedCinema, 
							date: selectedDate, 
							time: selectedTime, 
							seats: Array.from(selectedSeats), 
							subtotal: seatPrice 
						})}
					}
				>
					<Text style={[TicketBookingStyles.proceedText, (!hasMovieData && TicketBookingStyles.disabledText)]}>Proceed</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
};

const TicketBookingStyles = StyleSheet.create({
	container: {
		flex: 1, 
		backgroundColor: 'black', 
		paddingTop: 15
	},
	scrollContainer: {
		padding: 20,
		backgroundColor: "#111"
	},
	headerButton: {
		position: 'absolute',
		top: 30,
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

	seatTierContainer: {
		flexDirection: 'row',
		marginVertical: "10",
		justifyContent: "space-between",
		gap: 10
	},
	seatTier: {
		flex: 1,
		heigh: 200,
		borderRadius: 5,
		backgroundColor: "#555",
		padding: 10,
		paddingTop: 20
	},
	tierTextIndicate: {
		color: 'lightgray',
		fontSize: 8
	},
	tierText: {
		color: 'white'
	},

	dropdownWrapper: {
		height: 40,
		paddingHorizontal: 10,
		paddingVertical: 0,
		// borderWidth: 1,
		// borderColor: '#555',
		borderRadius: 10,
		backgroundColor: 'white',
		justifyContent: 'center',
		marginBottom: 10
	},
	picker: {
		color: 'black',
		fontSize: 16,
		width: '100%',
	},

	dateMonth: {
		color: 'gray',
		fontSize: 14,
		paddingHorizontal: 5,
		marginBottom: 10
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
		borderWidth: 1,
		borderColor: 'transparent',
		borderRadius: 8,
		marginRight: 8,
		marginBottom: 8
	},

	dateText: {
		color: '#fff',
		fontSize: 12,
		textAlign: 'center',
	},

	timeRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
		marginTop: 8,
		marginBottom: 25
	},
	timeBox: {
		width: 80,
		borderWidth: 1,
		borderColor: 'transparent',
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
		// backgroundColor: '#555',
		borderColor: "white"
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
		marginLeft: 5,
		fontSize: 12,
	},
	seat: {
		backgroundColor: '#444',
		width: 20, 
		height: 20, 
		borderRadius: 4,
		padding: 1,
		justifyContent: "center"
	},
	seatBlank: {
		backgroundColor: 'transparent'
	},
	userSeatSelected: {
		backgroundColor: "lightgray"
	},
	seatSelected: {
		backgroundColor: "red"
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
		justifyContent: 'space-between',
		alignItems: 'center',
		marginVertical: 7,
		gap: 5
	},
	rowLabel: {
		color: '#888', 
		textAlign: 'center'
	},
	bookingInfoContainer: {
		backgroundColor: '#111',
		borderRadius: 8,
		padding: 16,
		marginTop: 16,
		marginBottom: 40,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	summaryBox: {},
	summaryText: {
		color: '#AAA', 
		fontSize: 12
	},
	selectedSeats: {
		color: 'white', 
		marginTop: 4
	},
	subtotal: {
		color: 'white',
		marginTop: 4
	},
	actionButtons: {
		paddingHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
		marginBottom: 30
	},
	cancelButton: {
		flex: 1,
		backgroundColor: 'white',
		padding: 12,
		marginRight: 10,
		borderRadius: 6,
		alignItems: 'center',
	},
	cancelText: {
		color: 'black', 
		fontWeight: 'bold'
	},
	proceedButton: {
		flex: 1,
		backgroundColor: '#555',
		padding: 12,
		borderRadius: 6,
		alignItems: 'center',
	},
	proceedText: {
		color: 'white', 
		fontWeight: 'bold'
	},
	disabledButton: {
		backgroundColor: '#111',
	},
	disabledText: {
		color: 'gray', 
	},
});