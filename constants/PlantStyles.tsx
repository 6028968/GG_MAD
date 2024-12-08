import { StyleSheet, Dimensions } from "react-native";
import Colors from "./Colors";

const { width } = Dimensions.get("window");
const margin = 5; 
const itemWidth = (width / 5) - (margin * 3);

export const plantStyles = StyleSheet.create({
    container: {
        gap: 8,
        marginTop: 40,
        marginHorizontal: 8,
        flex: 1,
    },
    articlesParent:
    {
        gap: 8,
        padding: 25,
    },
    borderContainer:
    {
        gap: 8,
        padding: 10,
        borderBottomWidth: 3,
        borderColor: Colors.light.primary,
    },
    paddingView:
    {
        gap: 8,
        padding: 10,
    },
    title: {
        fontSize: 40,
        color: Colors.light.text,
    },
    subtitle:
    {
        fontSize: 40,
        color: "rgba(171, 211, 174, 0.75)",
    },
    errorText: {
        color: "red",
        fontSize: 18,
    },
    articleTitle:
    {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderBottomWidth: 3,
        borderColor: Colors.light.primary,
        // paddingBottom: 12,
    },
    articleItems:
    {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    tweedeItem:
    {
        color: "#9C9C9C",
        fontWeight: "bold",
    },
    switchContainer: {
        width: 50, 
        height: 25, 
        borderRadius: 15, 
        justifyContent: "center",
        padding: 3, 
    },
    switchOn: {
        backgroundColor: "rgba(171, 211, 174, 0.5)", 
    },
    switchOff: {
        backgroundColor: "lightgray", 
    },
    thumb: {
        width: 20, 
        height: 20, 
        borderRadius: 12, 
    },
    thumbOn: {
        backgroundColor: "#2e564f", 
        alignSelf: "flex-end", 
    },
    thumbOff: {
        backgroundColor: "rgba(46, 86, 81, 0.25)", 
        alignSelf: "flex-start", 
    },
    teksten:
    {
        fontSize: 20,
        color: "darkgray",
    }
});