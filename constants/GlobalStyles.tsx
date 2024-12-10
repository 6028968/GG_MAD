import { StyleSheet, Dimensions } from "react-native";
import Colors from "./Colors";
import Instellingen from "@/app/instellingen";

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
    backgroundInloggen:
    {
        flex: 1,
        width: '100%',
        height: '100%',
        position: "absolute",
        justifyContent: "center",
        backgroundColor: "#DDF5DE",
    },
    layoutContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: width * 0.05,
        backgroundColor: "#DDF5DE",
    },
    layoutMessage: {
        fontSize: width * 0.100,
        color: "white",
        marginBottom: height * 0.02,
        textAlign: "center",
    },
    subTitle:
    {
        fontSize: 25,
        color: Colors.light.text,
    },
    instellingenInput:
    {
        paddingLeft: 20,  
    },
    gevaarTekst:
    {
        color: "red",
        fontSize: 18,
        fontWeight: "bold",
    },
    scrollViewContent: 
    {
        flexGrow: 1,
        paddingBottom: 50,
    },
    button: 
    {
        height: 45,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.light.text,
        alignSelf: "flex-end", 
        paddingHorizontal: 20,
        marginTop: 10,
        // Android
        elevation: 5,
        // iOS
        shadowColor: "gray",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    buttonTekst:
    {
        color: "white",
        fontSize: 20,
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
