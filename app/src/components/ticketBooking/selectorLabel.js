import { View, Text, StyleSheet } from 'react-native';

const SelectorLabel = ({label}) => {
    return (
        <View style={SelectorLabelStyles.container}>
            <View style={SelectorLabelStyles.line} />
            <Text style={SelectorLabelStyles.label}>{label}</Text>
            <View style={SelectorLabelStyles.line} />
        </View>
    )
}

const SelectorLabelStyles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 10,
        paddingTop: 15
    },
    label: {
        textAlign: 'center', 
        color:"#555",
        paddingHorizontal: 10
    },
    line: {
        flex: 1, 
        height: 0.5, 
        backgroundColor: '#555'
    }
})

export default SelectorLabel