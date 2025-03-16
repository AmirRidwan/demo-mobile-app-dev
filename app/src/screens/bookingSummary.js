import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BookingSummary = ({ navigation }) => {
    const handleProceed = () => {
        navigation.navigate('Payment');
    };

    return (
        <SafeAreaView>
            <Pressable style={BookingSummaryStyles.headerButton} onPress={() => { navigation.goBack() }}>
                <Icon name="arrow-back" size={24} color="white" />
            </Pressable>	
            <Text style={BookingSummaryStyles.title}>Booking Summary</Text>

            <ScrollView style={BookingSummaryStyles.card}>

                    <View style={BookingSummaryStyles.row}>
                    <View style={BookingSummaryStyles.imagePlaceholder} />
                    <View style={BookingSummaryStyles.movieDetails}>
                        <Text style={BookingSummaryStyles.movieTitle}>Venom: Let There Be Carnage</Text>
                        <Text style={BookingSummaryStyles.genre}>Action, Adventure, Sci-fi</Text>
                        <Text style={BookingSummaryStyles.meta}>1h 37m</Text>
                        <Text style={BookingSummaryStyles.meta}>English, IMDb 3D</Text>
                        <Text style={BookingSummaryStyles.ticketType}>Classic Tickets</Text>
                    </View>
                    </View>

                    <View style={BookingSummaryStyles.dashedLine} />

                    <View style={BookingSummaryStyles.infoBlock}>
                    <Text style={BookingSummaryStyles.cinema}>Genesis Deluxe Lagos · Maryland mall</Text>
                    <View style={BookingSummaryStyles.infoRow}>
                        <Text style={BookingSummaryStyles.label}>Date</Text>
                        <Text style={BookingSummaryStyles.label}>Seat</Text>
                        <Text style={BookingSummaryStyles.label}>Start</Text>
                        <Text style={BookingSummaryStyles.label}>End</Text>
                    </View>
                    <View style={BookingSummaryStyles.infoRow}>
                        <Text style={BookingSummaryStyles.value}>Nov 20, 2021</Text>
                        <Text style={BookingSummaryStyles.value}>F4, F5</Text>
                        <Text style={BookingSummaryStyles.value}>5:40PM</Text>
                        <Text style={BookingSummaryStyles.value}>7:20PM</Text>
                    </View>
                    </View>

                    <View style={BookingSummaryStyles.section}>
                    <Text style={BookingSummaryStyles.sectionTitle}>Tickets</Text>
                    <Text style={BookingSummaryStyles.priceText}>Classic tickets [x2]</Text>
                    <Text style={BookingSummaryStyles.amount}>₦5,000</Text>
                    </View>

                    <View style={BookingSummaryStyles.section}>
                    <Text style={BookingSummaryStyles.sectionTitle}>Food & Beverage</Text>
                    <Text style={BookingSummaryStyles.priceText}>Fresh XL Combo [x2]</Text>
                    <Text style={BookingSummaryStyles.amount}>₦5,400</Text>
                    </View>

                    <View style={BookingSummaryStyles.section}>
                    <Text style={BookingSummaryStyles.sectionTitle}>Charges</Text>
                    <Text style={BookingSummaryStyles.priceText}>Service charge</Text>
                    <Text style={BookingSummaryStyles.amount}>₦50</Text>
                    </View>

                    <View style={BookingSummaryStyles.section}>
                    <Text style={BookingSummaryStyles.sectionTitle}>Promo Code</Text>
                    <View style={BookingSummaryStyles.promoBox}>
                        <Text style={BookingSummaryStyles.promoPlaceholder}> </Text>
                    </View>
                    </View>

                    <View style={BookingSummaryStyles.totalBlock}>
                    <Text style={BookingSummaryStyles.totalLabel}>Total Amount Payable</Text>
                    <Text style={BookingSummaryStyles.totalAmount}>₦10,450</Text>
                    </View>

                <TouchableOpacity style={BookingSummaryStyles.button} onPress={handleProceed}>
                    <Text style={BookingSummaryStyles.buttonText}>Proceed to payment</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const BookingSummaryStyles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#000' },
    heading: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
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
    card: {
        backgroundColor: '#1c1c1c',
        padding: 16,
    },
    row: { flexDirection: 'row' },
    imagePlaceholder: {
        width: 80,
        height: 100,
        backgroundColor: '#555',
        borderRadius: 8,
    },
    movieDetails: {
        marginLeft: 12,
        flex: 1,
    },
    movieTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    genre: { color: '#aaa', fontSize: 13 },
    meta: { color: '#aaa', fontSize: 12 },
    ticketType: { color: '#aaa', fontSize: 12, marginTop: 4 },

    dashedLine: {
        borderStyle: 'dashed',
        borderColor: '#444',
        borderWidth: 0.5,
        marginVertical: 16,
    },

    infoBlock: { marginBottom: 16 },
    cinema: { color: '#fff', fontWeight: 'bold', marginBottom: 8 },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: { color: '#999', fontSize: 12 },
    value: { color: '#fff', fontSize: 14 },

    section: {
        marginBottom: 12,
    },
    sectionTitle: { color: '#999', fontSize: 13, marginBottom: 4 },
    priceText: { color: '#fff', fontSize: 14 },
    amount: { color: '#fff', textAlign: 'right', marginTop: -20 },

    promoBox: {
        height: 35,
        backgroundColor: '#333',
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    promoPlaceholder: { color: '#aaa' },

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

    button: {
        marginTop: 20,
        backgroundColor: '#888',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default BookingSummary;
