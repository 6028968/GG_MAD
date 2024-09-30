import { StyleSheet, Dimensions } from "react-native";
import Colors from "./Colors";

const { width } = Dimensions.get("window");
const margin = 5; 
const itemWidth = (width / 5) - (margin * 3);

export const homeStyles = StyleSheet.create({
    container: 
    {
        justifyContent: "center",
        alignItems: "center",
    },
    weerContainer:
    {
        marginTop: 20,
        paddingVertical: 10, 
    },
    item: 
    {
        width: itemWidth,
        flexDirection: "column",
        alignItems: "center",
        marginHorizontal: margin,
        // backgroundColor: "rgba(255, 255, 255, 0.75)",
        backgroundColor: "white",
        paddingTop: 5,
        borderRadius: 5,
        elevation: 2, 
        borderWidth: 3,
        borderColor: Colors.light.primary,
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
        // backgroundColor: Colors.light.primary,
        borderBottomRightRadius: 2,
        borderBottomLeftRadius: 2,
        padding: 2,
    },
    dagen:
    {
        fontSize: 14,
        fontWeight: "bold",
        // color: "white",
        color: Colors.light.secundairLight,
    },
    dayText:
    {
        fontSize: 18,
        marginBottom: 0,
        color: "grey",
        fontWeight: "bold",
    },
    // scrollViewContent: 
    // {
    //     flexGrow: 1,
    //     paddingBottom: 40,
    //     // backgroundColor: "white",
    //     margin: 10,
    // },
    // infoSectionContainer: 
    // {
    //     padding: 20,
    //     borderWidth: 3,
    //     borderColor: Colors.light.primary,
    //     borderRadius: 20,
    // },
    // plantenContainer:
    // {
    //     backgroundColor: "white",
    //     // backgroundColor: "rgba(255, 255, 255, 0.75)",
    //     marginBottom: 25,
    //     borderRadius: 20,
    // },
    // toggleContainer: 
    // {
    //     flexDirection: "row",
    //     justifyContent: "center",
    //     marginBottom: 20,
    // },
    // toggleButton: 
    // {
    //     flex: 1,
    //     paddingVertical: 15,
    //     alignItems: "center",
    //     borderWidth: 3,
    //     borderColor: Colors.light.primary,
    // },
    // activeButton: 
    // {
    //     backgroundColor: Colors.light.primary,
    // },
    // toggleText: 
    // {
    //     color: Colors.light.primary,
    //     fontWeight: "bold",
    //     fontSize: 20,
    // },
    // activeText: 
    // {
    //     color: "white",
    //     fontSize: 20,
    // },
    // itemContainer: 
    // {
    //     flexDirection: "row",
    //     alignItems: "center",
    //     marginBottom: 20,
    // },
    // iconContainer: 
    // {
    //     backgroundColor: "black",
    //     // padding: 10,
    //     height: 60,
    //     width: 60,
    //     borderTopLeftRadius: 10,
    //     borderBottomLeftRadius: 10,
    // },
    // labelContainer: 
    // {
    //     flex: 1,
    //     backgroundColor: "#e0e0e0",
    //     // padding: 15,
    //     height: 60,
    //     borderTopRightRadius: 10,
    //     borderBottomRightRadius: 10,
    // },
    // itemLabel: 
    // {
    //     fontWeight: "bold",
    // },
    // plusButton: 
    // {
    //     alignSelf: "center",
    //     marginBottom: 20,
    //     borderWidth: 1,
    //     borderColor: "black",
    //     borderRadius: 50,
    //     width: 50,
    //     height: 50,
    //     alignItems: "center",
    //     justifyContent: "center",
    // },
    // listContainer: 
    // {
    //     flex: 1,
    // },
    // dottedItem: 
    // {
    //     height: 60,
    //     backgroundColor: "#e0e0e0",
    //     borderRadius: 10,
    //     borderWidth: 1,
    //     borderStyle: "dashed",
    //     borderColor: "#777",
    //     // marginBottom: 10,
    // },
});
