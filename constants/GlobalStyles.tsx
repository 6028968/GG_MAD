import { StyleSheet, Dimensions } from "react-native";
import Colors from "./Colors";

const { width, height } = Dimensions.get('window');

export const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
        padding: width * 0.05,
    },
    layoutMessage: {
        fontSize: width * 0.045,
        color: "white",
        marginBottom: height * 0.02,
        textAlign: "center",
    },
});

export const HeaderStyles = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: height * 0.015 },
        shadowOpacity: 0.5,
        shadowRadius: width * 0.05,
        elevation: 20,
    },
    logoutButton: {
        marginRight: width * 0.025,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        backgroundColor: "white",
        borderRadius: 5,
        marginLeft: width * 0.025,
        borderColor: Colors.light.primary,
        borderWidth: 3,
    },
    logoutButtonText: {
        color: Colors.light.primary,
        fontSize: width * 0.04,
    },
});
