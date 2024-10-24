import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../components/AuthContext";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { LoginStyles } from "@/constants/LoginStyles";
import { useRouter } from "expo-router"; 
import { useFonts } from 'expo-font';

export default function LoginScreen() 
{
    const { login, errorMessage, clearError } = useAuth(); 
    const router = useRouter(); 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);      

    const [fontsLoaded] = useFonts({
        'Afacad': require('../assets/fonts/Afacad-Regular.ttf'), 
        'Akaya': require('../assets/fonts/AkayaKanadaka-Regular.ttf'), 
    });


    if (!fontsLoaded) {
        return null;        
    }

    const handleLogin = () => 
    {
        clearError();
        login(username, password); 
    };

    return (
        <View style={GlobalStyles.container}>
            <View style={GlobalStyles.backgroundInloggen}>
                <View style={LoginStyles.parentFormContainer}>
                    <View style={LoginStyles.formContainer}>
                        <Text style={[LoginStyles.title, { fontFamily: 'Akaya' }]}>Login</Text>

                        <TextInput
                            style={[
                                LoginStyles.input,
                                isUsernameFocused && LoginStyles.inputFocused,
                                { fontFamily: 'Afacad' } 
                            ]}
                            placeholder={isUsernameFocused ? "" : "Gebruikersnaam"}  // Placeholder dynamisch op focus
                            placeholderTextColor="rgba(203, 203, 203, 0.5)"
                            value={username}
                            onChangeText={setUsername}
                            onFocus={() => setIsUsernameFocused(true)}
                            onBlur={() => setIsUsernameFocused(false)}
                            selectionColor="rgb(46, 86, 81)"
                        />
                        
                        <TextInput
                            style={[
                                LoginStyles.input,
                                isPasswordFocused && LoginStyles.inputFocused,
                                { fontFamily: 'Afacad' }
                            ]}
                            placeholder={isPasswordFocused ? "" : "Wachtwoord"}  // Placeholder dynamisch op focus
                            placeholderTextColor="rgba(203, 203, 203, 0.5)"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            selectionColor="rgb(46, 86, 81)"
                        />

                        {errorMessage ? <Text style={LoginStyles.error}>{errorMessage}</Text> : null}

                        <TouchableOpacity 
                            style={LoginStyles.button} 
                            onPress={handleLogin}
                        >
                            <Text style={[LoginStyles.buttonText, { fontFamily: 'Akaya' }]}>Inloggen</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={LoginStyles.registerButton} 
                            onPress={() => router.push("/register")} 
                        >
                            <Text style={[LoginStyles.buttonText, { fontFamily: 'Akaya' }]}>Registreren</Text>
                        </TouchableOpacity>

                        <View style={LoginStyles.forgotPassword}>
                            <Text style={[LoginStyles.forgotPasswordText, { fontFamily: 'Afacad' }]}>Wachtwoord vergeten? </Text>
                            <TouchableOpacity onPress={() => router.push("/wachtwoord_vergeten")}>
                                <Text style={[LoginStyles.clickHereText, { fontFamily: "Afacad" }]}>Klik hier</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
