import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { LoginStyles } from "@/constants/LoginStyles";

export default function PasswordResetConfirmationScreen() 
{
    const router = useRouter(); 

    const handleBack = () => 
    {
        router.push("/");  
    };

    return (
        <View style={GlobalStyles.container}>
            <View style={GlobalStyles.backgroundInloggen}>
                <View style={LoginStyles.parentFormContainer}>
                    <View style={LoginStyles.formContainer}>
                        <Text style={LoginStyles.message}>
                            Er is een mail verstuurd om je wachtwoord te kunnen veranderen
                        </Text>

                        <TouchableOpacity 
                            style={LoginStyles.button} 
                            onPress={handleBack}
                        >
                            <Text style={LoginStyles.buttonText}>Terug</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
