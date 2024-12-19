import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { LoginStyles } from "@/constants/LoginStyles";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from "bcryptjs";
import { User, ValidationErrors } from "@/assets/interfaces/customInterfaces";
import { homeStyles } from "@/constants/HomeStyles";

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isModalVisible, setModalVisible] = useState(false);
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
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.(nl|com)$/;
            if (!emailRegex.test(email)) {
                validationErrors.email = "Voer een geldig e-mailadres in.";
            }
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
    
        const formatDate = (date: Date): string => {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };
    
        const newUser: User = {
            username,
            email,
            password: hashedPassword,
            role: "gebruiker",
            aangemaakt: formatDate(new Date()),
            notificatie: false
        };
    
        users.push(newUser);
        await AsyncStorage.setItem("users", JSON.stringify(users));
    
        setModalVisible(true);
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
                                { fontFamily: "Afacad", height: 55 },
                            ]}
                            placeholder={isUsernameFocused ? "" : "Gebruikersnaam"}
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
                                isEmailFocused && LoginStyles.inputFocused,
                                { fontFamily: "Afacad", height: 55 },
                            ]}
                            placeholder={isEmailFocused ? "" : "E-mailadres"}
                            placeholderTextColor="rgba(203, 203, 203, 0.5)"
                            value={email}
                            onChangeText={setEmail}
                            onFocus={() => setIsEmailFocused(true)}
                            onBlur={() => setIsEmailFocused(false)}
                            selectionColor="rgb(46, 86, 81)"
                        />

                        <TextInput
                            style={[
                                LoginStyles.input,
                                isPasswordFocused && LoginStyles.inputFocused,
                                { fontFamily: "Afacad", height: 55 },
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

                        <TextInput
                            style={[
                                LoginStyles.input,
                                isConfirmPasswordFocused && LoginStyles.inputFocused,
                                { fontFamily: "Afacad", height: 55 },
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
                        {errors.username && (
                            <Text style={LoginStyles.error}>{errors.username}</Text>
                        )}
                        {errors.email && (
                            <Text style={LoginStyles.error}>{errors.email}</Text>
                        )}
                        {errors.password && (
                            <Text style={LoginStyles.error}>{errors.password}</Text>
                        )}
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

            {/* Modal voor bevestiging van succes */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={homeStyles.modalOverlay}>
                    <View style={homeStyles.outerModalContainer}>
                        <View style={homeStyles.modalContainer}>
                            <Text style={homeStyles.modalTitle}>
                                Registratie voltooid!
                            </Text>
                            <TouchableOpacity
                                style={[homeStyles.button, homeStyles.addButton, { flex: 1, alignSelf: "center", paddingHorizontal: 20  }]}
                                onPress={() => {
                                    setModalVisible(false);
                                    router.push("/");
                                }}
                            >
                                <Text style={{ fontFamily: "Akaya", color: "white", fontSize: 20 }}>
                                    Inloggen
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
