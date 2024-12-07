import { StyleSheet, Dimensions } from "react-native";
import Colors from "./Colors";

const { width } = Dimensions.get("window");
const margin = 5; 
const itemWidth = (width / 5) - (margin * 3);

export const sensorStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    flatList: {
        paddingVertical: 45,
    },
    titleView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 3,
        borderColor: Colors.light.primary,
    },
    iconRight: {
        flexDirection: "row-reverse", 
    },
    iconLeft: {
        flexDirection: "row", 
    },
    title: {
        fontSize: 40,
        fontFamily: "Akaya",
        color: Colors.light.text,
    },
    sensorTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    sensorIcon: {
        width: 40,
        height: 40,
        marginHorizontal: 10,
    },
    sensorInfo: {
        fontSize: 14,
        color: "#555",
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
    },
});