import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, SafeAreaView, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

function getRoundedEndTime(startTimeStr, runtime) {
	const [time, modifier] = startTimeStr.split(/(AM|PM)/);
	let [hours, minutes] = time.split(':').map(Number);

	if (modifier === 'PM' && hours !== 12) hours += 12;
	if (modifier === 'AM' && hours === 12) hours = 0;

	const date = new Date();
	date.setHours(hours);
	date.setMinutes(minutes);

	date.setHours(date.getHours() + runtime.hour);
	date.setMinutes(date.getMinutes() + runtime.minute + 20); 

	const roundTo = 5; // or 10
	const rawMinutes = date.getMinutes();
	const roundedMinutes = Math.ceil(rawMinutes / roundTo) * roundTo;

	if (roundedMinutes >= 60) {
		date.setHours(date.getHours() + 1);
		date.setMinutes(roundedMinutes - 60);
	} else {
		date.setMinutes(roundedMinutes);
	}

	let finalHours = date.getHours();
	const finalMinutes = date.getMinutes().toString().padStart(2, '0');
	const finalModifier = finalHours >= 12 ? 'PM' : 'AM';

	finalHours = finalHours % 12 || 12;

	return `${finalHours}:${finalMinutes}${finalModifier}`;
}
const BookingSummary = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { movieData, movieId, cinema, date, time, seats, subtotal, paid } = route.params 

    const [ foodNBeverageSubtotal, setFoodNBeverageSubtotal] = useState(0)
    const [ serviceCharge, setServiceCharge] = useState(50)
    const [ discount, setDiscount] = useState(0)

    const [ promoCode, setPromoCode ] = useState("")

    return (
        <SafeAreaView style={BookingSummaryStyles.container}>
            <Pressable style={BookingSummaryStyles.headerButton} onPress={() => { navigation.goBack() }}>
                <Icon name="arrow-back" size={24} color="white" />
            </Pressable>	
            <Text style={BookingSummaryStyles.headerTitle}>Booking Summary</Text>

            <ScrollView style={BookingSummaryStyles.contentContainer}>

                <View style={BookingSummaryStyles.movieTicketContainer}>
                    <View style={BookingSummaryStyles.movieTicketMovieDetails}>
                        <View style={BookingSummaryStyles.movieImageContainer}>
                                <Image source={{ uri: movieData.poster }} style={BookingSummaryStyles.movieImage} resizeMode="cover"/>
                            </View>

                            <View style={BookingSummaryStyles.movieDetails}>
                                <Text style={BookingSummaryStyles.movieTitle}>{movieData.title}</Text>
                                <View style={BookingSummaryStyles.genreContainer}>
                                    { movieData.genre.map((genre) => {
                                        return (
                                            <View key={genre} style={BookingSummaryStyles.genreTag}>
                                                <Text style={BookingSummaryStyles.genreText}>{ genre }</Text>
                                            </View>
                                        )
                                    })}
                                </View>
                                <Text style={BookingSummaryStyles.meta}>{movieData.runtime.hour}h {movieData.runtime.minute}m</Text>
                                <Text style={BookingSummaryStyles.meta}>English, IMDb 3D</Text>
                                <Text style={BookingSummaryStyles.ticketType}>Classic Tickets</Text>
                            </View>
                    </View>

                    <View style={BookingSummaryStyles.ticketDivider}>
                        <View style={BookingSummaryStyles.circleLeft}>
                            <View style={BookingSummaryStyles.maskLeft} />
                        </View>

                        <View style={BookingSummaryStyles.dottedLine}>
                            {Array.from({ length: 50 }).map((_, i) => (
                            <View key={i} style={BookingSummaryStyles.dot} />
                            ))}
                        </View>

                        <View style={BookingSummaryStyles.circleRight}>
                            <View style={BookingSummaryStyles.maskRight} />
                        </View>
                    </View>

                    <View style={BookingSummaryStyles.movieTicketScheduleDeatils}>
                        <Text style={BookingSummaryStyles.scheduleLabel}>Cinema</Text>
                        <Text style={BookingSummaryStyles.scheduleInfo}>{cinema}</Text>

                        <View style={BookingSummaryStyles.infoRow}>
                            <View>
                                <Text style={BookingSummaryStyles.scheduleLabel}>Date</Text>
                                <Text style={BookingSummaryStyles.scheduleInfo}>{date.month} {date.date}, {date.year}</Text>
                            </View>
                            <View>
                                <Text style={BookingSummaryStyles.scheduleLabel}>Seat</Text>
                                <Text style={BookingSummaryStyles.scheduleInfo}>
                                    { Array.from(seats).sort((a, b) => {
                                        const [rowA, colA] = [a.charAt(0), parseInt(a.slice(1))];
                                        const [rowB, colB] = [b.charAt(0), parseInt(b.slice(1))];
    
                                        if (rowA < rowB) return -1;
                                        if (rowA > rowB) return 1;
    
                                        return colA - colB;
                                    }).join(', ')}
                                </Text>
                            </View>
                            <View>
                                <Text style={BookingSummaryStyles.scheduleLabel}>Start</Text>
                                <Text style={BookingSummaryStyles.scheduleInfo}>{time}</Text>
                            </View>
                            <View>
                                <Text style={BookingSummaryStyles.scheduleLabel}>End</Text>
                                <Text style={BookingSummaryStyles.scheduleInfo}>{getRoundedEndTime(time, movieData.runtime)}</Text>
                            </View>
                            
                        </View>
                    </View>
                </View>

                <View style={BookingSummaryStyles.priceDetailsContainer}>
                    <View style={BookingSummaryStyles.section}>

                        <Text style={BookingSummaryStyles.sectionTitle}>Tickets</Text>
                        <Text style={BookingSummaryStyles.priceText}>Classic tickets [x{seats.length}]</Text>
                        <Text style={BookingSummaryStyles.amount}>₦ {subtotal}</Text>
                    </View>

                    <View style={BookingSummaryStyles.section}>
                        <Text style={BookingSummaryStyles.sectionTitle}>Food & Beverage</Text>
                        {/* <Text style={BookingSummaryStyles.priceText}>Fresh XL Combo [x2]</Text> */}
                        <Text style={BookingSummaryStyles.amount}>₦ {foodNBeverageSubtotal}</Text>
                    </View>

                    <View style={BookingSummaryStyles.section}>
                        <Text style={BookingSummaryStyles.sectionTitle}>Charges</Text>
                        <Text style={BookingSummaryStyles.priceText}>Service charge</Text>
                        <Text style={BookingSummaryStyles.amount}>₦ {serviceCharge} </Text>
                    </View>

                    { !paid && (
                        <View style={BookingSummaryStyles.promoSection}>
                            <Text style={BookingSummaryStyles.sectionTitle}>Promo Code</Text>
                            <TextInput 
                                editable 
                                value={promoCode} 
                                numberOfLines={1} 
                                maxLength={10} 
                                onChangeText={text =>{ 
                                    setPromoCode(text); 
                                    text == "123456"? setDiscount(50) : setDiscount(0)
                                }}
                                style={BookingSummaryStyles.promoCodeBox}
                            />
                        </View>
                    )}

                    <View style={BookingSummaryStyles.totalBlock}>
                        <Text style={BookingSummaryStyles.totalLabel}>Total Amount { paid ? "Paid" : "Payable"}</Text>
                        <Text style={BookingSummaryStyles.totalAmount}>₦ {(subtotal+foodNBeverageSubtotal+serviceCharge)-discount}</Text>
                    </View>
                </View>
                
                

            </ScrollView>
            <View style={BookingSummaryStyles.buttonContainer}>
                {paid ? 
                    <Pressable style={BookingSummaryStyles.button} onPress={() => navigation.navigate('MainTabs', { screen: 'Home'})}>
                        <Text style={BookingSummaryStyles.buttonText}>Back to Home</Text>
                    </Pressable>
                    :
                    <Pressable style={BookingSummaryStyles.button} onPress={() => navigation.navigate('Payment', { movieData, movieId, cinema, date, time, seats, subtotal })}>
                        <Text style={BookingSummaryStyles.buttonText}>Proceed to payment</Text>
                    </Pressable>
                }
            </View>
        </SafeAreaView>
    );
};

const BookingSummaryStyles = StyleSheet.create({
    heading: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
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
		paddingBottom: 15,
        paddingTop: 45
	},
    container: {
        flex: 1, 
        backgroundColor: '#111',
    },
    contentContainer: {
        padding: 16,
        flexDirection: 'column',
        paddingBottom: 50
    },

    movieTicketContainer:{

    },
    movieTicketMovieDetails: {
        flexDirection: 'row',
        backgroundColor: 'black',
        margin: 5,
        marginBottom: 0,
        padding:10,
        paddingBottom: 30,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: "gray",
        borderRadius: 3
    },

    movieTicketScheduleDeatils: {
        backgroundColor: 'black',
        margin: 5,
        marginTop:0,
        padding:30,
        paddingTop: 20,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: "gray",
        borderRadius: 3
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

    row: { flexDirection: 'row' },

    movieDetails: {
        marginLeft: 12,
        flex: 1,
    },
    movieTitle: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    genreContainer: {
		flexDirection: 'row',
		marginVertical: 10,
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
    meta: { 
        color: '#aaa', 
        fontSize: 14 
    },
    ticketType: { color: '#aaa', fontSize: 12, marginTop: 4 },

    ticketDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -10,
        height: 20,
        backgroundColor: 'black',
        position: 'relative',
        overflow: 'visible',
    },
    circleLeft: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: 'gray',
        position: 'absolute',
        left: -15,
        zIndex: 2,
    },
    maskLeft: {
        width: 20,
        height: 50,
        top: -5,
        left: -2,
        backgroundColor: "#111"
    },

    circleRight: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: 'gray',
        position: 'absolute',
        right: -15,
        zIndex: 2,
    },
    maskRight: {
        width: 23,
        height: 50,
        top: -5,
        right: -20,
        backgroundColor: "#111"
    },

    dottedLine: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 0,
        paddingHorizontal: 12,
        zIndex: 1,
    },
    dot: {
        width: 5,
        height: 1,
        backgroundColor: 'lightgray',
        marginHorizontal: 2,
        borderRadius: 1,
    },

    scheduleLabel: {
        color:"gray",
        fontSize: 11
    },
    scheduleInfo: { 
        color: '#fff', 
        fontWeight: 'bold', 
        marginBottom: 8 
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    },



    priceDetailsContainer: {
        backgroundColor: 'black',
        margin: 5,
        padding: 20,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 3,    
        marginBottom: 40
    },
    section: {
        marginBottom: 12,
    },
    sectionTitle: { 
        color: '#fff', 
        fontSize: 14, 
        marginBottom: 4 
    },
    priceText: { 
        color: '#999', 
        fontSize: 12 
    },
    amount: { 
        color: '#fff', 
        textAlign: 'right', 
        marginTop: -20 
    },
    promoSection: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    promoCodeBox:{
        backgroundColor: '#555',
        width: 120,
        height: 35,
        borderRadius: 5,
        color: 'white',
        paddingVertical: 0,
        paddingHorizontal: 10
    },

    totalBlock: {
        marginTop: 12,
        borderTopColor: '#444',
        borderTopWidth: 1,
        paddingTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalLabel: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    totalAmount: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    buttonContainer: {
        paddingHorizontal: 10,
        backgroundColor: 'black',
        paddingBottom: 30
    },
    button: {
        marginTop: 20,
        backgroundColor: '#555',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonText: { 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 16 
    },
});

export default BookingSummary;
