import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { LoginStyles } from "@/constants/LoginStyles";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from "bcryptjs";

interface ValidationErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

interface User {
    username: string;
    email: string;
    password: string;
    role: string;
}

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<ValidationErrors>({});
    const router = useRouter();

    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

    const [fontsLoaded] = useFonts({
        Afacad: require("../assets/fonts/Afacad-Regular.ttf"),
        Akaya: require("../assets/fonts/AkayaKanadaka-Regular.ttf"),
    });

    const handleRegister = async () => {
        const validationErrors: ValidationErrors = {};
    
        if (!username.trim()) {
            validationErrors.username = "Gebruikersnaam is verplicht.";
        }
        if (!email.trim()) {
            validationErrors.email = "E-mailadres is verplicht.";
        }
        if (!password.trim()) {
            validationErrors.password = "Wachtwoord is verplicht.";
        }
        if (!confirmPassword.trim()) {
            validationErrors.confirmPassword = "Herhaal wachtwoord is verplicht.";
        }
    
        if (password.trim() && confirmPassword.trim() && password !== confirmPassword) {
            validationErrors.confirmPassword = "Wachtwoorden komen niet overeen.";
        }
    
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    
        const storedUsers = await AsyncStorage.getItem("users");
        let users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    
        const usernameExists = users.some((user) => user.username === username);
        const emailExists = users.some((user) => user.email === email);
    
        if (usernameExists) {
            setErrors({ username: "Gebruikersnaam is al in gebruik." });
            return;
        }
    
        if (emailExists) {
            setErrors({ email: "E-mailadres is al in gebruik." });
            return;
        }
    
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
    
        const newUser: User = {
            username,
            email,
            password: hashedPassword,
            role: "gebruiker",
        };
    
        users.push(newUser);
        await AsyncStorage.setItem("users", JSON.stringify(users));
    
        router.push("/");
    };    

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={GlobalStyles.container}>
            <View style={GlobalStyles.backgroundInloggen}>
                <View style={LoginStyles.parentFormContainer}>
                    <View style={LoginStyles.formContainer}>
                        <Text style={[LoginStyles.title, { fontFamily: "Akaya" }]}>
                            Registreren
                        </Text>

                        <TextInput
                            style={[
                                LoginStyles.input,
                                isUsernameFocused && LoginStyles.inputFocused,
                                { fontFamily: "Afacad" },
                            ]}
                            placeholder={isUsernameFocused ? "" : "Gebruikersnaam"}
                            placeholderTextColor="rgba(203, 203, 203, 0.5)"
                            value={username}
                            onChangeText={setUsername}
                            onFocus={() => setIsUsernameFocused(true)}
                            onBlur={() => setIsUsernameFocused(false)}
                            selectionColor="rgb(46, 86, 81)"
                        />
                        {errors.username && (
                            <Text style={LoginStyles.error}>{errors.username}</Text>
                        )}

                        <TextInput
                            style={[
                                LoginStyles.input,
                                isEmailFocused && LoginStyles.inputFocused,
                                { fontFamily: "Afacad" },
                            ]}
                            placeholder={isEmailFocused ? "" : "E-mailadres"}
                            placeholderTextColor="rgba(203, 203, 203, 0.5)"
                            value={email}
                            onChangeText={setEmail}
                            onFocus={() => setIsEmailFocused(true)}
                            onBlur={() => setIsEmailFocused(false)}
                            selectionColor="rgb(46, 86, 81)"
                        />
                        {errors.email && (
                            <Text style={LoginStyles.error}>{errors.email}</Text>
                        )}

                        <TextInput
                            style={[
                                LoginStyles.input,
                                isPasswordFocused && LoginStyles.inputFocused,
                                { fontFamily: "Afacad" },
                            ]}
                            placeholder={isPasswordFocused ? "" : "Wachtwoord"}
                            placeholderTextColor="rgba(203, 203, 203, 0.5)"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            selectionColor="rgb(46, 86, 81)"
                        />
                        {errors.password && (
                            <Text style={LoginStyles.error}>{errors.password}</Text>
                        )}

                        <TextInput
                            style={[
                                LoginStyles.input,
                                isConfirmPasswordFocused && LoginStyles.inputFocused,
                                { fontFamily: "Afacad" },
                            ]}
                            placeholder={isConfirmPasswordFocused ? "" : "Herhaal wachtwoord"}
                            placeholderTextColor="rgba(203, 203, 203, 0.5)"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            onFocus={() => setIsConfirmPasswordFocused(true)}
                            onBlur={() => setIsConfirmPasswordFocused(false)}
                            selectionColor="rgb(46, 86, 81)"
                        />
                        {errors.confirmPassword && (
                            <Text style={LoginStyles.error}>{errors.confirmPassword}</Text>
                        )}

                        <TouchableOpacity
                            style={LoginStyles.button}
                            onPress={handleRegister}
                        >
                            <Text style={[LoginStyles.buttonText, { fontFamily: "Akaya" }]}>
                                Registreren
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={LoginStyles.registerButton}
                            onPress={() => router.push("/")}
                        >
                            <Text style={[LoginStyles.buttonText, { fontFamily: "Akaya" }]}>
                                Terug
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
