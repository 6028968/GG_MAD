import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Alert, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { homeStyles } from "@/constants/HomeStyles";
import Background from "@/components/Background";
import ExpandableMenu from "@/components/MenuDownUnder";
import { useFonts } from "expo-font";
import { Plant } from "@/assets/types/plantTypes"
import { plantStyles } from "@/constants/PlantStyles"
import ProtectedRoute from "@/components/ProtectedRoute";
import CustomSwitch from "@/components/CustomSwitch";

const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const PlantDetail: React.FC = () => {
    const { id } = useLocalSearchParams();
    const [plant, setPlant] = useState<Plant | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLimitModalVisible, setLimitModalVisible] = useState(false);
    const [fullSide, setFullSide] = useState<"links" | "rechts" | null>(null);


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
            const savedPlants = await AsyncStorage.getItem("plants");
            const parsedPlants: Plant[] = savedPlants ? JSON.parse(savedPlants) : [];
    
            const plantsOnSameSide = parsedPlants.filter(
                (p) => p.kant === plant.kant && p.aanwezig
            );
    
            if (!plant.aanwezig && plantsOnSameSide.length >= 8) {
                setFullSide(plant.kant);
                setLimitModalVisible(true);
                return;
            }
    
            const newAanwezig = !plant.aanwezig;
            setPlant({ ...plant, aanwezig: newAanwezig });
    
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
            <View style={plantStyles.container}>
                <Text style={plantStyles.errorText}>Plant niet gevonden.</Text>
            </View>
        );
    }

    return (
        <ProtectedRoute>
            <Background>
                <View style={plantStyles.container}>
                    <View style={[homeStyles.infoSectionContainer, plantStyles.articlesParent]}>
                        <View style={plantStyles.articleTitle}>
                            <Text style={[plantStyles.title, { fontFamily: "Akaya" }]}>{capitalizeFirstLetter(plant.naam)}</Text>
                            <Text style={[plantStyles.subtitle, { fontFamily: "Afacad" }]}>| {plant.soort}</Text>
                        </View>
                        <View style={plantStyles.borderContainer}>
                        <View style={plantStyles.articleItems}>
                            <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Aanwezig:</Text>
                            {isAdmin ? (
                                <CustomSwitch value={plant.aanwezig} onValueChange={toggleAanwezig} />
                            ) : (
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>
                                    {plant.aanwezig ? "Ja" : "Nee"}
                                </Text>
                            )}
                            </View>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Dagen in Kas:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.dagenInKas}</Text>
                            </View>
                        </View>
                        <View style={plantStyles.paddingView}>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Totaal Geplant:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.totaalGeplant}</Text>
                            </View>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Mislukte Oogst:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.mislukteOogst}</Text>
                            </View>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Succesvolle Oogst:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.succesvolleOogst}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[homeStyles.infoSectionContainer, plantStyles.articlesParent]}>
                        <View style={plantStyles.borderContainer}>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Naam:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>{capitalizeFirstLetter(plant.naam)}</Text>
                            </View>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Wetenschappelijke Naam:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.wetenschappelijkeNaam}</Text>
                            </View>
                        </View>
                        <View style={plantStyles.borderContainer}>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Zonlicht:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.zonlicht}</Text>
                            </View>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Irrigatie Frequentie:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.irrigatieFrequentie}</Text>
                            </View>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Laatste Irrigratie:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.laatsteIrrigratie}</Text>
                            </View>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Aankomende Irrigratie:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.aankomendeIrrigratie}</Text>
                            </View>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Laatste Bemesting:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.laatsteBemesting}</Text>
                            </View>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Aankomende Bemesting:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.aankomendeBemesting}</Text>
                            </View>
                        </View>
                        <View style={plantStyles.paddingView}>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Meest Succesvolle Maand:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.meestSuccesvolleMaand}</Text>
                            </View>
                            <View style={plantStyles.articleItems}>
                                <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Meest Succesvolle Seizoen:</Text>
                                <Text style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}>{plant.meestSuccesvolleSeizoen}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <ExpandableMenu />

                <Modal
    animationType="slide"
    transparent={true}
    visible={isLimitModalVisible}
    onRequestClose={() => setLimitModalVisible(false)}
>
    <View style={homeStyles.modalOverlay}>
        <View style={homeStyles.outerModalContainer}>
            <View style={homeStyles.modalContainer}>
                <Text style={homeStyles.modalTitle}>Kant Vol!</Text>
                <Text style={[homeStyles.inputText, { textAlign: "center", marginBottom: 15 }]}>
                    De {fullSide === "links" ? "linkerkant" : "rechterkant"} zit vol. 
                    Zet een plant op afwezig of kies de andere kant.
                </Text>
                <TouchableOpacity
                    style={[homeStyles.button, homeStyles.addButton, { flex: 1, alignSelf: "center", paddingHorizontal: 40 }]}
                    onPress={() => setLimitModalVisible(false)}
                >
                    <Text style={{ fontFamily: "Akaya", color: "white", fontSize: 20 }}>
                        OK
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

export default PlantDetail;
