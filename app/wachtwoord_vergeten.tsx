import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";  
import { GlobalStyles } from "@/constants/GlobalStyles";
import { LoginStyles } from "@/constants/LoginStyles";
import * as Font from "expo-font";

export default function ForgotPasswordScreen() 
{
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");  
    const [fontsLoaded, setFontsLoaded] = useState(false);
    
    const [isEmailFocused, setIsEmailFocused] = useState(false);

    const router = useRouter();  

    useEffect(() => 
    {
        const loadFonts = async () => 
        {
            await Font.loadAsync({
                "AkayaKanadaka-Regular": require("@/assets/fonts/AkayaKanadaka-Regular.ttf"),
                "Afacad-Regular": require("@/assets/fonts/Afacad-Regular.ttf"),
            });
            setFontsLoaded(true);
        };

        loadFonts();
    }, []);

    const handlePasswordReset = () => 
    {
        if (email.trim() === "") 
        {
            setErrorMessage("Vul een geldig e-mailadres in."); 
            return;
        }

        setErrorMessage("");
        router.push("/wachtwoord_bevesteging");
    };

    if (!fontsLoaded) 
    {
        return <View />;
    }

    return (
        <View style={GlobalStyles.container}>
            <View style={GlobalStyles.backgroundInloggen}>
                <View style={LoginStyles.parentFormContainer}>
                    <View style={LoginStyles.formContainer}>
                        <Text style={LoginStyles.vergetenTitle}>Wachtwoord vergeten</Text>

                        <TextInput
                            style={[
                                LoginStyles.input,
                                isEmailFocused && LoginStyles.inputFocused, { height: 55} 
                            ]}
                            placeholder={isEmailFocused ? "" : "E-mailadres"} 
                            placeholderTextColor="rgba(203, 203, 203, 0.5)"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            onFocus={() => setIsEmailFocused(true)} 
                            onBlur={() => setIsEmailFocused(false)}  
                            selectionColor="rgb(46, 86, 81)"
                        />
                        {errorMessage ? <Text style={LoginStyles.error}>{errorMessage}</Text> : null}
                        
                        <TouchableOpacity 
                            style={LoginStyles.button} 
                            onPress={handlePasswordReset}
                        >
                            <Text style={LoginStyles.buttonText}>Verstuur</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={LoginStyles.registerButton} 
                            onPress={() => router.push("/")}
                        >
                            <Text style={LoginStyles.buttonText}>Terug</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
