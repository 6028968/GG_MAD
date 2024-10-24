import { StyleSheet, Dimensions } from "react-native";
import Colors from "./Colors";
import * as Font from "expo-font";

const { width } = Dimensions.get("window");

export const LoginStyles = StyleSheet.create({
    parentFormContainer:
    {
        backgroundColor: 'rgba(255, 255, 255, 0.75)', 
        padding: 10,
        borderRadius: 32,
        alignItems: 'center',
        alignSelf: "center",
        width: "90%",
    },
    formContainer: 
    {
        // backgroundColor: 'rgba(255, 255, 255, 0.5)',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderRadius: 25,
        width: '100%',
        alignSelf: "center",
        gap: 15,
        borderColor: Colors.light.primary,
        borderWidth: 3,
        // FUCKING SHADOW WERKT NIET SAMEN MET TRANSPARANTE BACKGROUND!@$%&$#
        // shadowColor: "black",
        // shadowOffset: { width: 1, height: 8 },
        // shadowOpacity: 0.2,
        // shadowRadius: 10, 
        // elevation: 10, 
    },
    
    title: 
    {
        fontSize: 50,
        textAlign: "center",
        color: Colors.light.text,
        textShadowColor: Colors.light.primary,
        fontFamily: "AkayaKanadaka-Regular",
        marginTop: 0,
        marginBottom: 0,
        lineHeight: 60,
    },
    
    vergetenTitle:
    {
        marginTop: 10,
        marginBottom: 0,
        lineHeight: 40,
        fontSize: 32,
        textAlign: "center",
        color: Colors.light.text,
        textShadowColor: Colors.light.primary,
        fontFamily: "AkayaKanadaka-Regular",
    },
    input: 
    {
        height: 55,
        borderColor: Colors.light.primary,
        borderWidth: 3,
        borderRadius: 30,
        // backgroundColor: "rgba(255, 255, 255, 1)",
        color: Colors.light.text,
        fontSize: 26,
        textAlign: "center",
        fontFamily: "Afacad-Regular"
    },
    inputFocused: {
        borderColor: Colors.light.text,
    },
    button: 
    {
        height: 55,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.text,
    },
    registerButton:
    {
        height: 55,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.secundair_button,
    },
    buttonText: 
    {
        color: Colors.light.white,
        fontSize: 32,
        fontFamily: "AkayaKanadaka-Regular",
        lineHeight: 45,
    },
    error: 
    {
        color: 'red',
        marginBottom: -10,
        marginTop: -10,
        textAlign: 'center',
    },
    forgotPassword: 
    {
        flexDirection: "row", 
        justifyContent: "center",
        marginTop: -10,
    },
    forgotPasswordText: 
    {
        fontSize: 18,
        color: Colors.light.gray,
        fontFamily: "Afacad-Regular",
    },
    clickHereText: 
    {
        fontSize: 18,
        // color: Colors.light.text,  
        color: "rgba(46, 86, 81, 0.75)",
        textDecorationLine: "underline",
        fontWeight: "bold",
        fontFamily: "Afacad-Regular", 
    },
    message:
    {
        color: "grey",
        textAlign: "center",
        // alignItems: "center",
        // justifyContent: "center",
        alignSelf: "center",
        fontSize: 20,
        marginTop: 15,
        width: "90%",
    },
});