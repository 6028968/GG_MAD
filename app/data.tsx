import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { homeStyles } from "@/constants/HomeStyles";
import Background from "@/components/Background";
import ExpandableMenu from "@/components/MenuDownUnder";
import { useFonts } from "expo-font";
import { styles } from "@/constants/PlantStyles";

const Data: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const [fontsLoaded] = useFonts({
        "Afacad": require("../assets/fonts/Afacad-Regular.ttf"),
        "Akaya": require("../assets/fonts/AkayaKanadaka-Regular.ttf"),
    });

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const storedAuth = await AsyncStorage.getItem("8JUhZ1hcFU1xFzYwf8CeWeNzYpf5ArUb");
                if (storedAuth) {
                    const { user } = JSON.parse(storedAuth);
                    if (user.role === "admin") {
                        setIsAdmin(true);
                    }
                }
            } catch (error) {
                console.error("Fout bij het ophalen van de gebruikersrol:", error);
            } finally {
                setLoading(false); 
            }
        };

        fetchUserRole();
    }, []);

    if (!fontsLoaded || loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <Background>
            <View style={styles.container}>
                <View style={[homeStyles.infoSectionContainer, styles.articlesParent]}>
                    <Text style={styles.title}>
                        {isAdmin ? "Beheerdersinstellingen" : "Gebruikersinstellingen"}
                    </Text>
                </View>
                <ExpandableMenu />
            </View>
        </Background>
    );
};

export default Data;
