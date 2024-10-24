import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { LoginStyles } from "@/constants/LoginStyles";
import { useRouter } from "expo-router";
import { useFonts } from 'expo-font';

interface ValidationErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function RegisterScreen() 
{
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<ValidationErrors>({}); 
    const router = useRouter();

    // Focus states voor invoervelden
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

    const [fontsLoaded] = useFonts({
        'Afacad': require('../assets/fonts/Afacad-Regular.ttf'), 
        'Akaya': require('../assets/fonts/AkayaKanadaka-Regular.ttf'), 
    });

    const handleRegister = () => 
    {
        const validationErrors: ValidationErrors = {};  
        
        if (!username.trim()) 
        {
            validationErrors.username = "Gebruikersnaam is verplicht.";
        }
        if (!email.trim()) 
        {
            validationErrors.email = "E-mailadres is verplicht.";
        }
        if (!password.trim()) 
        {
            validationErrors.password = "Wachtwoord is verplicht.";
        }
        if (!confirmPassword.trim()) 
        {
            validationErrors.confirmPassword = "Herhaal wachtwoord is verplicht.";
        }

        if (password.trim() && confirmPassword.trim() && password !== confirmPassword) 
        {
            validationErrors.confirmPassword = "Wachtwoorden komen niet overeen.";
        }

        if (Object.keys(validationErrors).length > 0) 
        {
            setErrors(validationErrors);
            return;
        }

        setErrors({}); 
        router.push("/");  
    };

    return (
        <View style={GlobalStyles.container}>
            <View style={GlobalStyles.backgroundInloggen}>
                <View style={LoginStyles.parentFormContainer}>
                    <View style={LoginStyles.formContainer}>
                        <Text style={[LoginStyles.title, { fontFamily: 'Akaya' }]}>Registreren</Text>

                        <TextInput
                            style={[
                                LoginStyles.input,
                                isUsernameFocused && LoginStyles.inputFocused,
                                { fontFamily: "Afacad"}
                            ]}
                            placeholder={isUsernameFocused ? "" : "Gebruikersnaam"}  // Placeholder dynamisch op focus
                            placeholderTextColor="rgba(203, 203, 203, 0.5)"
                            value={username}
                            onChangeText={setUsername}
                            onFocus={() => setIsUsernameFocused(true)}
                            onBlur={() => setIsUsernameFocused(false)}  // Geen waarde veranderen
                            selectionColor="rgb(46, 86, 81)"
                        />
                        {errors.username && <Text style={LoginStyles.error}>{errors.username}</Text>}

                        <TextInput
                            style={[
                                LoginStyles.input,
                                isEmailFocused && LoginStyles.inputFocused,
                                { fontFamily: 'Afacad' }
                            ]}
                            placeholder={isEmailFocused ? "" : "E-mailadres"}  // Placeholder dynamisch op focus
                            placeholderTextColor="rgba(203, 203, 203, 0.5)"
                            value={email}
                            onChangeText={setEmail}
                            onFocus={() => setIsEmailFocused(true)}
                            onBlur={() => setIsEmailFocused(false)}  // Geen waarde veranderen
                            selectionColor="rgb(46, 86, 81)"
                        />
                        {errors.email && <Text style={LoginStyles.error}>{errors.email}</Text>}

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
                            onBlur={() => setIsPasswordFocused(false)}  // Geen waarde veranderen
                            selectionColor="rgb(46, 86, 81)"
                        />
                        {errors.password && <Text style={LoginStyles.error}>{errors.password}</Text>}

                        <TextInput
                            style={[
                                LoginStyles.input,
                                isConfirmPasswordFocused && LoginStyles.inputFocused,
                                { fontFamily: 'Afacad' }
                            ]}
                            placeholder={isConfirmPasswordFocused ? "" : "Herhaal wachtwoord"}  // Placeholder dynamisch op focus
                            placeholderTextColor="rgba(203, 203, 203, 0.5)"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            onFocus={() => setIsConfirmPasswordFocused(true)}
                            onBlur={() => setIsConfirmPasswordFocused(false)}  // Geen waarde veranderen
                            selectionColor="rgb(46, 86, 81)"
                        />
                        {errors.confirmPassword && <Text style={LoginStyles.error}>{errors.confirmPassword}</Text>}

                        <TouchableOpacity 
                            style={LoginStyles.button} 
                            onPress={handleRegister}
                        >
                            <Text style={[LoginStyles.buttonText, { fontFamily: 'Akaya' }]}>Registreren</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={LoginStyles.registerButton} 
                            onPress={() => router.push("/")}
                        >
                            <Text style={[LoginStyles.buttonText, { fontFamily: 'Akaya' }]}>Terug</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
