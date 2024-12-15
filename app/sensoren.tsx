import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { homeStyles } from "@/constants/HomeStyles";
import Background from "@/components/Background";
import ExpandableMenu from "@/components/MenuDownUnder";
import { useFonts } from "expo-font";
import { plantStyles } from "@/constants/PlantStyles";
import { Sensor } from "@/assets/interfaces/customInterfaces";
import { sensorStyles } from "@/constants/SensorStyles";
import ProtectedRoute from "@/components/ProtectedRoute";

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
                const storedAuth = await AsyncStorage.getItem("admin");
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


    const getGrondvochtigheidStatus = (value: number) => 
        {
            if (value > 520) 
            {
                return "Extreem droog";
            } 
            else if (value == 0)
            {
                return "n.v.t."
            }
            else if (value < 260) 
            {
                return "Extreem nat";
            } 
            else if (value >= 260 && value <= 346) 
            {
                return "Zeer nat";
            } 
            else if (value >= 347 && value <= 433) 
            {
                return "Nat";
            } 
            else if (value >= 434 && value <= 520) 
            {
                return "Droog";
            } 
            else 
            {
                return "Onbekend";
            }
        };

    return (
        <ProtectedRoute>
            <Background>
                <View style={sensorStyles.mainContainer}>
                    <FlatList
                        data={sensoren}
                        style={sensorStyles.flatList}
                        keyExtractor={(item) => item.sensorID.toString()}
                        renderItem={({ item, index }) => (
                        <View
                            style={[
                                homeStyles.infoSectionContainer,
                                plantStyles.articlesParent,
                                { marginHorizontal: 10, marginBottom: 10, paddingTop: 10, paddingBottom: 0 },
                            ]}
                        >
                            <View
                                style={[
                                    sensorStyles.titleView,
                                    { flexDirection: index % 2 === 0 ? "row-reverse" : "row" },
                                ]}
                            >
                                <Image source={sensorIcon} style={sensorStyles.sensorIcon} />
                                <Text style={sensorStyles.title}>Sensor {item.sensorID}</Text>
                            </View>
                            <View style={[plantStyles.articlesParent, { gap: 10, paddingHorizontal: 5, paddingTop: 5 }]}>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Actief:</Text>
                                    <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>
                                        {item.actief ? "Ja" : "Nee"}
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Naam:</Text>
                                    <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>
                                        {item.deviceNaam}
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Sensor ID:</Text>
                                    <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>
                                        {item.sensorID}
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Foutmelding:</Text>
                                    <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>
                                        {item.foutmelding == null ? "n.v.t." : item.foutmelding}
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Uptime:</Text>
                                    <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>
                                        {item.uptime}%
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Locatie:</Text>
                                    <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>
                                        {item.locatie}
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Grondvochtigheid:</Text>
                                    <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>
                                        {item.grondvochtigheid} ({getGrondvochtigheidStatus(item.grondvochtigheid)})
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Data Ontvangen:</Text>
                                    <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>
                                        {item.dataOntvangen}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        )}
                    />
                </View>
                <ExpandableMenu />
            </Background>
        </ProtectedRoute>
    );
};

export default Sensoren;
