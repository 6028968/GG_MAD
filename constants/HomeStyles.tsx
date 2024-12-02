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
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        paddingTop: 5,
        borderRadius: 15,
        // elevation: 2, 
        borderWidth: 3,
        borderColor: Colors.light.primary,
    },
    weatherIcon:
    {
        width: 50,
        height: 50,
        marginTop: -15,
        // marginBottom: 5,
    },
    text: 
    {
        fontSize: 18,
        textAlign: "left",
    },
    tempContainer:
    {
        backgroundColor: "rgba(171, 211, 174, 0.9)",
        borderBottomRightRadius: 7,
        borderBottomLeftRadius: 7,
        padding: 5,
        width: "100%",
        alignItems: "center"
    },
    dagen:
    {
        fontSize: 16,
        color: "white",
    },
    dayText:
    {
        fontSize: 24,
        marginBottom: 0,
        color: Colors.light.text,
        // fontWeight: "bold",
    },
    scrollViewContent: 
    {
        flexGrow: 1,
        paddingBottom: 65,
        margin: 10,
    },
    infoSectionContainer: 
    {
        padding: 20,
        borderWidth: 3,
        borderColor: Colors.light.primary,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    toggleContainer: 
    {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 12.5,
    },
    toggleButtonLeft:
    {
        flex: 1,
        paddingVertical: 5,
        paddingTop: 10,
        alignItems: "center",
        borderWidth: 3,
        borderColor: Colors.light.primary,
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        backgroundColor: "white",
    },
    toggleButtonRight:
    {
        flex: 1,
        paddingVertical: 5,
        paddingTop: 10,
        alignItems: "center",
        borderWidth: 3,
        borderColor: Colors.light.primary,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: "white",
    },
    activeButton: 
    {
        backgroundColor: Colors.light.primary,
    },
    toggleText: 
    {
        color: Colors.light.text,
        fontWeight: "400",
        fontSize: 28,
    },
    activeText: 
    {
        color: "white",
        fontWeight: "400",
        fontSize: 28,
    },
    itemContainer: 
    {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 1,
    },
    iconContainer: 
    {
        // backgroundColor: Colors.light.primary,
        backgroundColor: "rgba(171, 211, 174, 0.9)",
        height: 80,
        width: 80,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    labelContainer: 
    {
        flex: 1,
        justifyContent: "center",
        paddingLeft: 10,
        backgroundColor: "white",
        height: 80,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 3,
        borderColor: "rgba(171, 211, 174, 1)",
    },
    itemLabel: 
    {
        // fontWeight: "bold",
        fontSize: 25,
        color: Colors.light.text,
    },
    plusButton: 
    {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    listContainer: 
    {
        flex: 1,
    },
    dottedItem: 
    {
        height: 80,
        borderRadius: 20,
        borderWidth: 3,
        borderStyle: "dashed",
        // borderColor: "rgba(171, 211, 174, 0.5)",
        borderColor: "rgba(211, 211, 211, 0.5)",
        marginBottom: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    modalOverlay: 
    {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    outerModalContainer: 
    {
        padding: 5, 
        backgroundColor: "white", 
        borderRadius: 10, 
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 }, 
        shadowOpacity: 0.3,
        shadowRadius: 10, 
    },
    
    modalContainer: 
    {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        // alignItems: "center",
        borderWidth: 3,
        borderColor: "rgba(171, 211, 174, 1)",
    },
    
    modalTitle: 
    {
        fontSize: 28,
        // fontWeight: "bold",
        color: Colors.light.text,
        marginBottom: 15,
        fontFamily: "Akaya",
        textAlign: "center",
    },
    inputText:
    {
        color: "rgba(128, 128, 128, 0.75)",
        fontWeight: "bold",
        // textAlign: "left",
        fontSize: 16,
    },
    input: 
    {
        width: "100%",
        // justifyContent: "center",
        height: 50,
        borderColor: Colors.light.primary,
        borderWidth: 2,
        borderRadius: 25,
        marginBottom: 15,
        paddingHorizontal: 10,
        textAlign: "center",
        // color: "rgba(128, 128, 128, 0.5)",
        fontSize: 16,
    },
    buttonContainer: 
    {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
    },
    button: 
    {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5,
        alignItems: "center",
        borderRadius: 25,
    },
    addButton:
    {
        backgroundColor: Colors.light.text, 
    },
    cancelButton:
    {
        backgroundColor: Colors.light.primary,
    },
    buttonText: 
    {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
