import { StyleSheet, Dimensions } from "react-native";
import Colors from "./Colors";

const { width } = Dimensions.get('window');

export const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    contentContainer: {
        flexGrow: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: "absolute",
    },
    layoutContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#000",
        padding: 20,
    },
    layoutMessage: {
        fontSize: 18,
        color: "white",
        marginBottom: 20,
        textAlign: "center",
    },
});

export const HeaderStyles = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
        // marginVertical: 10,
        // paddingLeft: 20,
    },
    logoutButton: {
        marginRight: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        // backgroundColor: Colors.light.primary,
        backgroundColor: "white",
        borderRadius: 5,
        marginLeft: 10,
        borderColor: Colors.light.primary,
        borderWidth: 3,
    },
    logoutButtonText: {
        // color: Colors.light.white,
        color: Colors.light.primary,
        fontSize: 16,
    },
});