import React, { useState } from "react";
import { View, Text, TextInput, ImageBackground, TouchableOpacity } from "react-native";
import { useAuth } from "../components/AuthContext";
import Background from "@/components/Background";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { LoginStyles } from "@/constants/LoginStyles";

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const { login, errorMessage, clearError } = useAuth();

    const handleLogin = () => {
        clearError();
        login(username, password);
    };

    return (
        <View style={GlobalStyles.container}>
            <Background>
                <View style={LoginStyles.formContainer}>  
                    <Text style={LoginStyles.title}>Login</Text>
                    
                    <TextInput
                        style={[
                            LoginStyles.input,
                            isUsernameFocused && LoginStyles.inputFocused,
                        ]}
                        placeholder={isUsernameFocused ? "" : "Gebruikersnaam"}
                        placeholderTextColor="rgba(171, 211, 174, 1)"
                        value={username}
                        onChangeText={setUsername}
                        onFocus={() => {
                            clearError();
                            setIsUsernameFocused(true);
                        }}
                        onBlur={() => setIsUsernameFocused(false)}
                    />
                    <TextInput
                        style={[
                            LoginStyles.input,
                            isPasswordFocused && LoginStyles.inputFocused,
                        ]}
                        placeholder={isPasswordFocused ? "" : "Wachtwoord"}
                        placeholderTextColor="rgba(171, 211, 174, 1)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        onFocus={() => {
                            clearError();
                            setIsPasswordFocused(true);
                        }}
                        onBlur={() => setIsPasswordFocused(false)}
                    />
                    
                    {errorMessage ? <Text style={LoginStyles.error}>{errorMessage}</Text> : null}
                    
                    <TouchableOpacity 
                        style={LoginStyles.button} 
                        onPress={handleLogin}
                    >
                        <Text style={LoginStyles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </Background>
        </View>
    );
}
