import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { homeStyles } from "@/constants/HomeStyles";
import Background from "@/components/Background";
import ExpandableMenu from "@/components/MenuDownUnder";
import { useFonts } from "expo-font";
import { plantStyles } from "@/constants/PlantStyles";
import { Pomp } from "@/assets/interfaces/customInterfaces";
import { sensorStyles } from "@/constants/SensorStyles";
import { CustomSwitchProps } from "@/assets/types/customTypes";

const pompIcon = require("@/assets/images/icons/pump.png");

const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onValueChange }) => {
    return (
        <TouchableOpacity
            style={[
                plantStyles.switchContainer,
                value ? plantStyles.switchOn : plantStyles.switchOff,
            ]}
            onPress={() => onValueChange(!value)}
            activeOpacity={0.8}
        >
            <View
                style={[
                    plantStyles.thumb,
                    value ? plantStyles.thumbOn : plantStyles.thumbOff,
                ]}
            />
        </TouchableOpacity>
    );
};

const Pompen: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [pompen, setPompen] = useState<Pomp[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [switchValues, setSwitchValues] = useState<{ [key: number]: boolean }>({});

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

    const handleSwitchChange = (pompID: number, newValue: boolean) => {
        setSwitchValues((prevValues) => ({
            ...prevValues,
            [pompID]: newValue,
        }));
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
                                { marginHorizontal: 10, marginBottom: 15, paddingTop: 10, paddingBottom: 0 },
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
                                        onValueChange={(newValue) =>
                                            handleSwitchChange(item.pompID, newValue)
                                        }
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
                                        {item.actief ? "Ja" : "Nee"}
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
    );
};

export const pompStyles = StyleSheet.create({
    pompIcon: {
        width: 40,
        height: 40,
        marginHorizontal: 10,
    },
});

export default Pompen;
