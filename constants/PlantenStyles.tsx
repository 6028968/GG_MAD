import { StyleSheet, Dimensions } from "react-native";
import Colors from "./Colors";

const { width } = Dimensions.get("window");
const margin = 5; 
const itemWidth = (width / 5) - (margin * 3);

export const styles = StyleSheet.create({
    container: {
        padding: 25,
        borderWidth: 3,
        borderColor: Colors.light.primary,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        marginTop: 40,
        marginHorizontal: 10,
        flex: 1,
    },
    title: {
        fontSize: 40,
        marginBottom: 30,
        fontFamily: "Akaya",
        color: Colors.light.text,
        borderBottomWidth: 3,
        borderColor: Colors.light.primary,
    },
    placeholderItem: {
        height: 80,
        borderRadius: 20,
        borderWidth: 3,
        borderStyle: "dashed",
        borderColor: "rgba(211, 211, 211, 0.5)",
        marginBottom: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    plantDetails: {
        fontSize: 16,
        color: "#7B7B7B",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 35,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    footerButton: {
        width: 75,
        height: 75,
        borderRadius: 40,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: Colors.light.primary,

    },
    footerButtonText: {
        fontSize: 50,
        color: Colors.light.primary,
        fontWeight: "bold",
    },
    activeItem: {
        borderColor: "#4C8C4A",
    },
    inactiveItem: {
        opacity: 0.8,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        borderColor: "lightgray", 
    },    
    scrollbarTrack: {
        position: "absolute",
        top: 115,
        right: 7.5,
        bottom: 12,
        width: 15,
        borderRadius: 10,
        borderColor: Colors.light.primary,
        borderWidth: 2.5,
    },
    scrollbarThumb: {
        width: 10,
        height: 50,
        backgroundColor: Colors.light.text,
        borderRadius: 10,
        position: "absolute",
    },
});