import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { homeStyles } from "@/constants/HomeStyles";
import Background from "@/components/Background";
import ExpandableMenu from "@/components/MenuDownUnder";
import { useFonts } from "expo-font";
import { plantStyles } from "@/constants/PlantStyles";
import { Sensor } from "@/assets/interfaces/customInterfaces";

const sensorIcon = require("@/assets/images/icons/sensor.png");

const Sensoren: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [sensoren, setSensoren] = useState<Sensor[]>([]);
    const [error, setError] = useState<string | null>(null);

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
            }
        };

        const fetchSensorData = async () => {
            try {
                const response = await fetch("http://localhost:3000/fetch-data");
                if (!response.ok) {
                    throw new Error(`Fout bij het ophalen van de sensorgegevens: ${response.statusText}`);
                }
                const data = await response.json();
                setSensoren(Object.values(data.sensoren));
            } catch (error) {
                console.error("Fout bij het ophalen van sensorgegevens:", error);
                setError("Kan sensorgegevens niet ophalen.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
        fetchSensorData();
    }, []);

    if (!fontsLoaded || loading) {
        return <ActivityIndicator size="large" />;
    }

    if (error) {
        return (
            <Background>
                <View style={plantStyles.container}>
                    <View style={[homeStyles.infoSectionContainer, plantStyles.articlesParent]}>
                        <Text style={plantStyles.errorText}>{error}</Text>
                    </View>
                </View>
            </Background>
        );
    }

    return (
        <Background>
            <View style={stylessensor.mainContainer}>
                <FlatList
                    data={sensoren}
                    style={stylessensor.flatList}
                    keyExtractor={(item) => item.sensorID.toString()}
                    renderItem={({ item }) => (
                        <View style={[homeStyles.infoSectionContainer, plantStyles.articlesParent, { marginHorizontal: 10, marginBottom: 5}]}>
                            <View>
                                <Text>Sensor {item.sensorID}</Text>
                                <Image source={sensorIcon} style={stylessensor.sensorIcon} />
                            </View>
                            <Text style={stylessensor.sensorTitle}>{item.deviceNaam}</Text>
                            <Text style={stylessensor.sensorInfo}>Locatie: {item.locatie}</Text>
                            <Text style={stylessensor.sensorInfo}>Grondvochtigheid: {item.grondvochtigheid}</Text>
                            <Text style={stylessensor.sensorInfo}>Actief: {item.actief ? "Ja" : "Nee"}</Text>
                        </View>
                    )}
                />
            </View>
            <ExpandableMenu />
        </Background>
    );
};

const stylessensor = StyleSheet.create({
    mainContainer:
    {
        flex: 1,
    },
    flatList:
    {   
        paddingVertical: 45,
    },
    sensorCard: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    sensorTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    sensorIcon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    sensorInfo: {
        fontSize: 14,
        color: "#555",
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
    }, 
});

export default Sensoren;
