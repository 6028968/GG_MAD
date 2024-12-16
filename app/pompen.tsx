import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, Image, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { homeStyles } from "@/constants/HomeStyles";
import Background from "@/components/Background";
import ExpandableMenu from "@/components/MenuDownUnder";
import { useFonts } from "expo-font";
import { plantStyles } from "@/constants/PlantStyles";
import { Pomp } from "@/assets/interfaces/customInterfaces";
import { sensorStyles } from "@/constants/SensorStyles";
import { pompStyles } from "@/constants/PompStyles";
import ProtectedRoute from "@/components/ProtectedRoute";
import CustomSwitch from "@/components/CustomSwitch";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const pompIcon = require("@/assets/images/icons/pump.png");

const Pompen: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [pompen, setPompen] = useState<Pomp[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [switchValues, setSwitchValues] = useState<{ [key: number]: boolean }>({});
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

useEffect(() => {
    const fetchNotificationSettings = async () => {
        const storedValue = await AsyncStorage.getItem("notificationsEnabled");
        setNotificationsEnabled(JSON.parse(storedValue || "false"));
    };
    fetchNotificationSettings();
}, []);

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

        const fetchPompData = async () => 
            {
                try 
                {
                    const response = await fetch("http://localhost:3000/fetch-data");
                    if (!response.ok) 
                    {
                        throw new Error(`Fout bij het ophalen van de pompgegevens: ${response.statusText}`);
                    }
                    const data = await response.json();
                    const pompen = Object.values(data.pompen) as Pomp[];
                    setPompen(pompen);
            
                    const initialSwitchValues = pompen.reduce<Record<number, boolean>>((acc, pomp) => 
                    {
                        acc[pomp.pompID] = false; 
                        return acc;
                    }, {});
                    setSwitchValues(initialSwitchValues);
                } 
                catch (error) 
                {
                    console.error("Fout bij het ophalen van pompgegevens:", error);
                    setError("Kan pompgegevens niet ophalen.");
                } 
                finally 
                {
                    setLoading(false);
                }
            };

        fetchUserRole();
        fetchPompData();
    }, []);

    const sendNotification = async (message: string) => {
        if (Platform.OS === "web") {
            console.log(`Melding: ${message}`);
        } else {
            if (Device.isDevice) {
                const { status } = await Notifications.requestPermissionsAsync();
                if (status !== "granted") {
                    console.log("Toestemming geweigerd voor notificaties!");
                    return;
                }
    
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Melding",
                        body: message,
                    },
                    trigger: null, // Direct versturen
                });
            } else {
                console.log("Notificaties werken niet op een simulator.");
            }
        }
    };

    // const handleSwitchChange = (pompID: number, newValue: boolean) => {
    //     setSwitchValues((prevValues) => ({
    //         ...prevValues,
    //         [pompID]: newValue,
    //     }));
    // };

    // const handleSwitchChange = async (pompID: number, newValue: boolean) => {
    //     setSwitchValues((prevValues) => ({
    //         ...prevValues,
    //         [pompID]: newValue,
    //     }));
    
    //     try {
    //         // Controleer of meldingen zijn ingeschakeld
    //         const notificationsEnabled = await AsyncStorage.getItem("notificationsEnabled");
    //         if (JSON.parse(notificationsEnabled || "false") && newValue) {
    //             const pompNaam = pompID === 1 ? "Links" : "Rechts";
    //             console.log(`Notificatie: Pomp ${pompNaam} is aangezet.`);
    //         }
    //     } catch (error) {
    //         console.error("Fout bij het versturen van notificaties:", error);
    //     }
    // };
    const handleSwitchChange = async (pompID: number, newValue: boolean) => {
        setSwitchValues((prevValues) => ({
            ...prevValues,
            [pompID]: newValue,
        }));
    
        if (notificationsEnabled && newValue) {
            const pompNaam = pompID === 1 ? "Links" : "Rechts";
            sendNotification(`Pomp ${pompNaam} is aangezet.`);
        }
        else
        {
            const pompNaam = pompID === 1 ? "Links" : "Rechts";
            sendNotification(`Pomp ${pompNaam} is uitgezet.`)
        }
    };
    
    
    
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
        <ProtectedRoute>
            <Background>
                <View style={sensorStyles.mainContainer}>
                    <FlatList
                        data={pompen}
                        style={sensorStyles.flatList}
                        keyExtractor={(item) => item.pompID.toString()}
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
                                    <Image source={pompIcon} style={pompStyles.pompIcon} />
                                    <Text style={sensorStyles.title}>Pomp {item.pompID === 1 ? "Links" : "Rechts"}</Text>
                                </View>
                                <View style={[plantStyles.articlesParent, { gap: 10, paddingHorizontal: 5, paddingTop: 5 }]}>
                                    {isAdmin ? 
                                    (
                                        <View style={plantStyles.articleItems}>
                                            <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Pomp Aanzetten:</Text>
                                            <CustomSwitch
                                                value={switchValues[item.pompID] || false}
                                                onValueChange={(newValue) => handleSwitchChange(item.pompID, newValue)}
                                            />
                                        </View>
                                    ) : ("")}
                                    <View style={plantStyles.articleItems}>
                                        <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Actief:</Text>
                                        <Text
                                            style={[
                                                plantStyles.teksten,
                                                plantStyles.tweedeItem,
                                                { fontFamily: "Afacad" },
                                            ]}
                                        >
                                            {switchValues[item.pompID] ? "Ja" : "Nee"}
                                        </Text>
                                    </View>
                                    <View style={plantStyles.articleItems}>
                                        <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Foutmelding:</Text>
                                        <Text
                                            style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" },]}
                                        >
                                            {item.foutmelding == null ? "n.v.t." : item.foutmelding}
                                        </Text>
                                    </View>
                                    <View style={plantStyles.articleItems}>
                                        <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Uptime:</Text>
                                        <Text
                                            style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" },]}
                                        >
                                            {item.uptime}%
                                        </Text>
                                    </View>
                                    <View style={plantStyles.articleItems}>
                                        <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Waterverbruik:</Text>
                                        <Text
                                            style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" },]}
                                        >
                                            {item.waterverbruikPerDagInLiters}L per dag
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

export default Pompen;