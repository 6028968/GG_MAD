import { StyleSheet, Dimensions } from "react-native";
import Colors from "./Colors";

const { width } = Dimensions.get("window")

export const homeStyles = StyleSheet.create({
    container: 
    {
        justifyContent: "center",
        alignItems: "center",
    },
    weerContainer:
    {
        paddingVertical: 10, 
    },
    item: 
    {
        flexDirection: "column",
        alignItems: "center",
        marginHorizontal: 10, 
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        paddingTop: 5,
        borderRadius: 5,
        elevation: 2, 
    },
    weatherIcon:
    {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
    text: 
    {
        fontSize: 18,
        textAlign: "left",
    },
    tempContainer:
    {
        backgroundColor: Colors.light.primary,
        borderBottomRightRadius: 2,
        borderBottomLeftRadius: 2,
        padding: 5,
    },
    dagen:
    {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
    dayText:
    {
        fontSize: 18,
        marginBottom: 5,
        color: "grey",
        fontWeight: "bold",
    }
});