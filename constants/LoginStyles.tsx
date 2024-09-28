import { StyleSheet, Dimensions } from "react-native";
import Colors from "./Colors";

const { width } = Dimensions.get("window");

export const LoginStyles = StyleSheet.create({
    title: 
    {
        fontSize: 50,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
        color: Colors.light.primary,
        textShadowColor: Colors.light.primary,
    },
    input: 
    {
        height: 60,
        borderColor: Colors.light.primary,
        borderWidth: 3,
        marginBottom: 12,
        paddingHorizontal: 10,
        borderRadius: 25,
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        color: "rgba(171, 211, 174, 1)",
        fontSize: 25,
        textAlign: "center",
    },
    inputFocused: {
        borderColor: "green", // Verander randkleur naar groen wanneer gefocust
    },
    button: 
    {
        height: 60,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.primary,
        marginTop: 20,
    },
    buttonText: 
    {
        color: Colors.light.white,
        fontSize: 26,
    },
    error: 
    {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    formContainer: 
    {
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderRadius: 25,
        width: '90%',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, 
        alignSelf: "center",
        borderWidth: 3,
        borderColor: Colors.light.primary,
    },
});