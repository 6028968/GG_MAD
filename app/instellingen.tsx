import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TextInput, TouchableOpacity, Alert, ScrollView, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { homeStyles } from "@/constants/HomeStyles";
import Background from "@/components/Background";
import ExpandableMenu from "@/components/MenuDownUnder";
import { useFonts } from "expo-font";
import { plantStyles } from "@/constants/PlantStyles";
import bcrypt from "bcryptjs";
import { LoginStyles } from "@/constants/LoginStyles";
import { GlobalStyles } from "@/constants/GlobalStyles";
import ClearStorageButton from "@/components/ClearCache";
import { router } from "expo-router";
import ProtectedRoute from "@/components/ProtectedRoute";
import CustomSwitch from "@/components/CustomSwitch";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const Instellingen: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [switchValue, setSwitchValue] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);   
    const [isEmailFocused, setIsEmailFocused] = useState(false);  
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [isEmailErrorModalVisible, setIsEmailErrorModalVisible] = useState(false);

    const [fontsLoaded] = useFonts({
        "Afacad": require("../assets/fonts/Afacad-Regular.ttf"),
        "Akaya": require("../assets/fonts/AkayaKanadaka-Regular.ttf"),
    });

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };    

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedAuth = await AsyncStorage.getItem("8JUhZ1hcFU1xFzYwf8CeWeNzYpf5ArUb");
                if (storedAuth) {
                    const { user } = JSON.parse(storedAuth);
                    setUser(user);
                    if (user.role === "admin") {
                        setIsAdmin(true);
                    }
                }
            } catch (error) {
                console.error("Fout bij het ophalen van de gebruiker:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const deleteAccount = async () => {
        try {
            if (!user) return;

            const storedUsers = await AsyncStorage.getItem("users");
            const users = storedUsers ? JSON.parse(storedUsers) : [];

            const updatedUsers = users.filter((u: any) => u.username !== user.username);

            await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
            await AsyncStorage.removeItem("8JUhZ1hcFU1xFzYwf8CeWeNzYpf5ArUb");

            Alert.alert("Account verwijderd", "Je account is succesvol verwijderd.");
            
            router.replace("/");
        } catch (error) {
            console.error("Fout bij het verwijderen van het account:", error);
            Alert.alert("Fout", "Er is iets misgegaan. Probeer opnieuw.");
        }
    };

    const handleUpdate = async () => 
        {
            try 
            {
                if (!user) return;
        
                if (password.trim() && confirmPassword.trim() && password !== confirmPassword) 
                {
                    setIsErrorModalVisible(true);
                    return;
                }
        
                if (email.trim() && !isValidEmail(email.trim())) 
                {
                    setIsEmailErrorModalVisible(true);
                    return;
                }
        
                const storedUsers = await AsyncStorage.getItem("users");
                const users = storedUsers ? JSON.parse(storedUsers) : [];
        
                const updatedUsers = users.map((u: any) => 
                {
                    if (u.username === user.username && u.email === user.email) 
                    { 
                        return {
                            ...u,
                            username: username.trim() || u.username, 
                            email: email.trim() || u.email,
                            password: password.trim()
                                ? bcrypt.hashSync(password, 10)
                                : u.password,
                        };
                    }
                    return u;
                });
        
                await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
        
                const updatedUser = {
                    ...user,
                    username: username.trim() || user.username,
                    email: email.trim() || user.email,
                };
        
                await AsyncStorage.setItem(
                    "8JUhZ1hcFU1xFzYwf8CeWeNzYpf5ArUb",
                    JSON.stringify({ user: updatedUser })
                );
        
                setUser(updatedUser);
        
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
        
                setIsSuccessModalVisible(true);
            } 
            catch (error) 
            {
                console.error("Fout bij het updaten van de gebruiker:", error);
                Alert.alert("Fout", "Er is iets misgegaan. Probeer opnieuw.");
            }
        };
        
        
    if (!fontsLoaded || loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <ProtectedRoute>
            <Background>
                <ScrollView contentContainerStyle={GlobalStyles.scrollViewContent}>
                    <View style={plantStyles.container}>
                        <View style={[homeStyles.infoSectionContainer, plantStyles.articlesParent]}>
                            <Text style={[plantStyles.articleTitle, plantStyles.title, { fontFamily: "Akaya" }]}>
                                Instellingen
                            </Text>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Gebruikersnaam:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>
                                    {capitalizeFirstLetter(user?.username || "Onbekend")}
                                </Text>
                            </View>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Account aangemaakt:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>
                                    {user?.aangemaakt || "Onbekend"}
                                </Text>
                            </View>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Gebruikersrol:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>
                                    {user?.role || "Onbekend"}
                                </Text>
                            </View>
                        </View>
                        <View style={[homeStyles.infoSectionContainer, plantStyles.articlesParent]}>
                            <Text style={[plantStyles.articleTitle, plantStyles.title, { fontFamily: "Akaya", marginBottom: 15 }]}>
                                Accountgegevens
                            </Text>
                            <View>
                                <Text style={[GlobalStyles.subTitle, { fontFamily: "Akaya" }]}>Gebruikersnaam</Text>
                                <TextInput
                                    style={[LoginStyles.input,
                                        isUsernameFocused && LoginStyles.inputFocused, GlobalStyles.instellingenInput, { fontFamily: "Afacad", textAlign: "left"  }]}
                                    placeholder={user?.username || "Gebruikersnaam"}
                                    placeholderTextColor="rgba(203, 203, 203, 0.5)"
                                    value={username}
                                    onChangeText={setUsername}
                                />
                            </View>
                            <View>
                                <Text style={[GlobalStyles.subTitle, { fontFamily: "Akaya" }]}>E-mailadres</Text>
                                <TextInput
                                    style={[
                                        LoginStyles.input,
                                        isEmailFocused && LoginStyles.inputFocused, GlobalStyles.instellingenInput,
                                        { fontFamily: "Afacad", textAlign: "left" },
                                    ]}
                                    placeholder={user?.email || "E-mailadres"}
                                    placeholderTextColor="rgba(203, 203, 203, 0.5)"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                            <View>
                                <Text style={[GlobalStyles.subTitle, { fontFamily: "Akaya" }]}>Wachtwoord</Text>
                                <TextInput
                                    style={[
                                        LoginStyles.input,
                                        isPasswordFocused && LoginStyles.inputFocused, GlobalStyles.instellingenInput,
                                        { fontFamily: 'Afacad', textAlign: "left"  }
                                    ]}
                                    placeholderTextColor="rgba(203, 203, 203, 0.5)"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                            <View>
                                <Text style={[GlobalStyles.subTitle, { fontFamily: "Akaya" }]}>Herhaal wachtwoord</Text>
                                <TextInput
                                    style={[
                                        LoginStyles.input,
                                        isConfirmPasswordFocused && LoginStyles.inputFocused, GlobalStyles.instellingenInput,
                                        { fontFamily: "Afacad", textAlign: "left"  },
                                    ]}
                                    placeholderTextColor="rgba(203, 203, 203, 0.5)"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </View>
                            <TouchableOpacity style={[GlobalStyles.button]} onPress={handleUpdate}>
                                <Text style={[GlobalStyles.buttonTekst, { fontFamily: "Akaya" }]}>Wijzigen</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[homeStyles.infoSectionContainer, plantStyles.articlesParent]}>
                            <View style={plantStyles.borderContainer}>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Meldingen ontvangen:</Text>
                                    <CustomSwitch value={switchValue} onValueChange={setSwitchValue} />
                                </View>
                            </View>
                            <View style={plantStyles.articleItems}>
                                <TouchableOpacity style={[]} onPress={deleteAccount}>
                                    <Text style={GlobalStyles.gevaarTekst}>Verwijder account</Text>
                                </TouchableOpacity>
                                {isAdmin ? (<ClearStorageButton />) : ("")}
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <ExpandableMenu />

                {/* Toon gegevens succesvol verwerkt modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isSuccessModalVisible}
                    onRequestClose={() => setIsSuccessModalVisible(false)}
                >
                    <View style={homeStyles.modalOverlay}>
                        <View style={homeStyles.outerModalContainer}>
                            <View style={homeStyles.modalContainer}>
                                <TouchableOpacity
                                    style={{
                                        position: "absolute",
                                        top: 10,
                                        right: 10,
                                        zIndex: 1000,
                                    }}
                                    onPress={() => setIsSuccessModalVisible(false)}
                                >
                                    <MaterialCommunityIcons name="close" size={30} color="darkgray" />
                                </TouchableOpacity>
                                <Text style={homeStyles.modalTitle}>Succes!</Text>
                                <Text style={[homeStyles.inputText, { textAlign: "center", marginTop: 15 }]}>
                                    Je gegevens zijn succesvol bijgewerkt.
                                </Text>
                                <TouchableOpacity
                                    style={[homeStyles.button, homeStyles.addButton, { alignSelf: "center", marginTop: 20 }]}
                                    onPress={() => setIsSuccessModalVisible(false)}
                                >
                                    <Text style={{ fontFamily: "Akaya", color: "white", fontSize: 18, paddingHorizontal: 20 }}>
                                        OKE
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Toon wachtwoorden komen niet overeen modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isErrorModalVisible}
                    onRequestClose={() => setIsErrorModalVisible(false)}
                >
                    <View style={homeStyles.modalOverlay}>
                        <View style={homeStyles.outerModalContainer}>
                            <View style={homeStyles.modalContainer}>
                                <TouchableOpacity
                                    style={{
                                        position: "absolute",
                                        top: 10,
                                        right: 10,
                                        zIndex: 1000,
                                    }}
                                    onPress={() => setIsErrorModalVisible(false)}
                                >
                                    <MaterialCommunityIcons name="close" size={30} color="darkgray" />
                                </TouchableOpacity>
                                <Text style={homeStyles.modalTitle}>Fout!</Text>
                                <Text style={[homeStyles.inputText, { textAlign: "center", marginTop: 15 }]}>
                                    De wachtwoorden komen niet overeen. Probeer opnieuw.
                                </Text>
                                <TouchableOpacity
                                    style={[homeStyles.button, homeStyles.addButton, { alignSelf: "center", marginTop: 20 }]}
                                    onPress={() => setIsErrorModalVisible(false)}
                                >
                                    <Text style={{ fontFamily: "Akaya", color: "white", fontSize: 18, paddingHorizontal: 20 }}>
                                        OKE
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Toon e-mail ongeldig formats modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isEmailErrorModalVisible}
                    onRequestClose={() => setIsEmailErrorModalVisible(false)}
                >
                    <View style={homeStyles.modalOverlay}>
                        <View style={homeStyles.outerModalContainer}>
                            <View style={homeStyles.modalContainer}>
                                <TouchableOpacity
                                    style={{
                                        position: "absolute",
                                        top: 10,
                                        right: 10,
                                        zIndex: 1000,
                                    }}
                                    onPress={() => setIsEmailErrorModalVisible(false)}
                                >
                                    <MaterialCommunityIcons name="close" size={30} color="darkgray" />
                                </TouchableOpacity>
                                <Text style={homeStyles.modalTitle}>Fout!</Text>
                                <Text style={[homeStyles.inputText, { textAlign: "center", marginTop: 15 }]}>
                                    Het ingevoerde e-mailadres is ongeldig. Probeer opnieuw.
                                </Text>
                                <TouchableOpacity
                                    style={[homeStyles.button, homeStyles.addButton, { alignSelf: "center", marginTop: 20 }]}
                                    onPress={() => setIsEmailErrorModalVisible(false)}
                                >
                                    <Text style={{ fontFamily: "Akaya", color: "white", fontSize: 18, paddingHorizontal: 20 }}>
                                        OKE
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>


            </Background>
        </ProtectedRoute>
    );
};

export default Instellingen;