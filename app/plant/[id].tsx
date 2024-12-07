import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Switch, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { homeStyles } from "@/constants/HomeStyles";
import Background from "@/components/Background";
import { Directions } from "react-native-gesture-handler";
import ExpandableMenu from "@/components/MenuDownUnder";
import { useFonts } from "expo-font";
import { Plant } from "@/assets/types/plantTypes"
import { styles } from "@/constants/PlantStyles"
import { CustomSwitchProps } from "@/assets/types/customTypes";

const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onValueChange }) => {
    return (
        <TouchableOpacity
            style={[
                styles.switchContainer,
                value ? styles.switchOn : styles.switchOff,
            ]}
            onPress={() => onValueChange(!value)}
            activeOpacity={0.8}
        >
            <View
                style={[
                    styles.thumb,
                    value ? styles.thumbOn : styles.thumbOff,
                ]}
            />
        </TouchableOpacity>
    );
};

const PlantDetail: React.FC = () => {
    const { id } = useLocalSearchParams();
    const [plant, setPlant] = useState<Plant | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    const [fontsLoaded] = useFonts({
        "Afacad": require("../../assets/fonts/Afacad-Regular.ttf"),
        "Akaya": require("../../assets/fonts/AkayaKanadaka-Regular.ttf"),
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

        fetchUserRole();
    }, []);

    useEffect(() => {
        const loadPlant = async () => {
            try {
                const savedPlants = await AsyncStorage.getItem("plants");
                const parsedPlants: Plant[] = savedPlants ? JSON.parse(savedPlants) : [];
                const foundPlant = parsedPlants.find((plant) => plant.id === parseInt(id as string, 10));
                setPlant(foundPlant || null);
            } catch (error) {
                console.error("Error bij het laden van de plant:", error);
            } finally {
                setLoading(false);
            }
        };

        loadPlant();
    }, [id]);

    const toggleAanwezig = async () => {
        if (!plant) return;

        try {
            const newAanwezig = !plant.aanwezig;
            setPlant({ ...plant, aanwezig: newAanwezig });

            const savedPlants = await AsyncStorage.getItem("plants");
            const parsedPlants: Plant[] = savedPlants ? JSON.parse(savedPlants) : [];

            const updatedPlants = parsedPlants.map((p) =>
                p.id === plant.id ? { ...p, aanwezig: newAanwezig } : p
            );
            await AsyncStorage.setItem("plants", JSON.stringify(updatedPlants));

            router.push("/home");
        } catch (error) {
            console.error("Fout bij het updaten van de aanwezigheid:", error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    if (!plant) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Plant niet gevonden.</Text>
            </View>
        );
    }

    return (
        <Background>
            <View style={styles.container}>
                <View style={[homeStyles.infoSectionContainer, styles.articlesParent]}>
                    <View style={styles.articleTitle}>
                        <Text style={[styles.title, { fontFamily: "Akaya" }]}>{capitalizeFirstLetter(plant.naam)}</Text>
                        <Text style={[styles.subtitle, { fontFamily: "Afacad" }]}>| {plant.soort}</Text>
                    </View>
                    <View style={styles.borderContainer}>
                    <View style={styles.articleItems}>
                        <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Aanwezig:</Text>
                        {isAdmin ? (
                            <CustomSwitch value={plant.aanwezig} onValueChange={toggleAanwezig} />
                        ) : (
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>
                                {plant.aanwezig ? "Ja" : "Nee"}
                            </Text>
                        )}
                        </View>
                        <View style={styles.articleItems}>
                            <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Dagen in Kas:</Text>
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.dagenInKas}</Text>
                        </View>
                    </View>
                    <View style={styles.paddingView}>
                        <View style={styles.articleItems}>
                            <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Totaal Geplant:</Text>
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.totaalGeplant}</Text>
                        </View>
                        <View style={styles.articleItems}>
                            <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Mislukte Oogst:</Text>
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.mislukteOogst}</Text>
                        </View>
                        <View style={styles.articleItems}>
                            <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Succesvolle Oogst:</Text>
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.succesvolleOogst}</Text>
                        </View>
                    </View>
                </View>
                <View style={[homeStyles.infoSectionContainer, styles.articlesParent]}>
                    <View style={styles.borderContainer}>
                        <View style={styles.articleItems}>
                            <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Naam:</Text>
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>{capitalizeFirstLetter(plant.naam)}</Text>
                        </View>
                        <View style={styles.articleItems}>
                            <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Wetenschappelijke Naam:</Text>
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.wetenschappelijkeNaam}</Text>
                        </View>
                    </View>
                    <View style={styles.borderContainer}>
                        <View style={styles.articleItems}>
                            <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Zonlicht:</Text>
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.zonlicht}</Text>
                        </View>
                        <View style={styles.articleItems}>
                            <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Irrigatie Frequentie:</Text>
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.irrigatieFrequentie}</Text>
                        </View>
                        <View style={styles.articleItems}>
                            <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Laatste Irrigratie:</Text>
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.laatsteIrrigratie}</Text>
                        </View>
                        <View style={styles.articleItems}>
                            <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Aankomende Irrigratie:</Text>
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.aankomendeIrrigratie}</Text>
                        </View>
                        <View style={styles.articleItems}>
                            <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Laatste Bemesting:</Text>
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.laatsteBemesting}</Text>
                        </View>
                        <View style={styles.articleItems}>
                            <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Aankomende Bemesting:</Text>
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.aankomendeBemesting}</Text>
                        </View>
                    </View>
                    <View style={styles.paddingView}>
                        <View style={styles.articleItems}>
                            <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Meest Succesvolle Maand:</Text>
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.meestSuccesvolleMaand}</Text>
                        </View>
                        <View style={styles.articleItems}>
                            <Text style={[styles.teksten, { fontFamily: "Afacad" }]}>Meest Succesvolle Seizoen:</Text>
                            <Text style={[styles.teksten, styles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.meestSuccesvolleSeizoen}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <ExpandableMenu />
        </Background>
    );
};

export default PlantDetail;
