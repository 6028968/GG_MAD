import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Modal, TextInput, TextStyle, StyleProp } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { homeStyles } from "@/constants/HomeStyles";
import Background from "@/components/Background";
import ExpandableMenu from "@/components/MenuDownUnder";
import { Plant } from "@/assets/types/plantTypes"
import { plantStyles } from "@/constants/PlantStyles"
import ProtectedRoute from "@/components/ProtectedRoute";
import CustomSwitch from "@/components/CustomSwitch";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DynamicWidthInputProps } from "@/assets/interfaces/customInterfaces"; 

const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const DynamicWidthInput: React.FC<DynamicWidthInputProps> = ({ value, onChangeText, style }) =>
{
    const [textWidth, setTextWidth] = useState(0);

    return (
        <View>
            <Text
                style={[style, { position: "absolute", opacity: 0, zIndex: -1 }]}
                onLayout={(event) =>
                {
                    const { width } = event.nativeEvent.layout;
                    setTextWidth(width);
                }}
            >
                {value}
            </Text>

            <TextInput
                style={[style, { width: textWidth || 200 }]}
                value={String(value)}
                onChangeText={onChangeText}
            />
        </View>
    );
};

const PlantDetail: React.FC = () => {
    const { id } = useLocalSearchParams();
    const [plant, setPlant] = useState<Plant | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [isLimitModalVisible, setLimitModalVisible] = useState(false);
    const [fullSide, setFullSide] = useState<"Links" | "Rechts" | null>(null);
    const [textWidth, setTextWidth] = useState(0);
    const [editedKant, setEditedKant] = useState<string | null>(null);
    const [originalKant, setOriginalKant] = useState<"Links" | "Rechts" | null>(null);

    const toggleEditMode = () => {
        if (!isEditable) {
            setOriginalKant(plant?.kant || null);
            setEditedKant(plant?.kant || null); 
        } else {
            saveChanges();
        }
        setIsEditable((prev) => !prev);
    };

    const updateField = async (field: keyof Plant, value: string) => {
        if (!plant) return;
    
        if (field === "kant" && value !== plant.kant) {
            try {
                const savedPlants = await AsyncStorage.getItem("plants");
                const parsedPlants: Plant[] = savedPlants ? JSON.parse(savedPlants) : [];
    
                const plantsOnNewSide = parsedPlants.filter(
                    (p) => p.kant === value && p.aanwezig && p.id !== plant.id
                );
    
                if (plantsOnNewSide.length >= 8) {
                    setFullSide(value as "Links" | "Rechts");
                    setLimitModalVisible(true);
                    return;
                }
    
                setPlant({ ...plant, [field]: value as "Links" | "Rechts" });
            } catch (error) {
                console.error("Fout bij het controleren van de kant:", error);
            }
        } else {
            setPlant({ ...plant, [field]: value });
        }
    };

    const saveChanges = async () => {
        if (!plant) return;
    
        if (editedKant !== plant.kant) {
            try {
                const savedPlants = await AsyncStorage.getItem("plants");
                const parsedPlants: Plant[] = savedPlants ? JSON.parse(savedPlants) : [];
    
                const plantsOnNewSide = parsedPlants.filter(
                    (p) => p.kant === editedKant && p.aanwezig && p.id !== plant.id
                );
    
                if (plantsOnNewSide.length >= 8) {
                    setFullSide(editedKant as "Links" | "Rechts");
                    setLimitModalVisible(true);
                    setEditedKant(originalKant);
                    return;
                }
    
                const updatedPlant = { ...plant, kant: editedKant as "Links" | "Rechts" };
                setPlant(updatedPlant);
    
                const updatedPlants = parsedPlants.map((p) =>
                    p.id === plant.id ? updatedPlant : p
                );
    
                await AsyncStorage.setItem("plants", JSON.stringify(updatedPlants));
                setOriginalKant(editedKant as "Links" | "Rechts");
            } catch (error) {
                console.error("Fout bij het opslaan van wijzigingen:", error);
            }
        }
    
        setIsEditable(false);
    };
    
    

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
                        <View style={[plantStyles.articleTitle, { position: "relative" }]}>
                            <Text
                                style={[plantStyles.title, { fontFamily: "Akaya" }]}
                                onLayout={(event) => {
                                    const { width } = event.nativeEvent.layout;
                                    setTextWidth(width);
                                }}
                            >
                                {isEditable ? (
                                    <DynamicWidthInput
                                        value={plant?.naam || ""}
                                        onChangeText={(value) => updateField("naam", value)}
                                        style={[plantStyles.title, { fontFamily: "Akaya", color: "orange" }]}
                                    />
                                ) : (
                                    capitalizeFirstLetter(plant?.naam || "")
                                )}
                            </Text>
                            <Text
                                style={[plantStyles.subtitle, { fontFamily: "Afacad", position: "relative" }]}
                                onLayout={(event) => {
                                    const { width } = event.nativeEvent.layout;
                                    setTextWidth(width);
                                }}
                            >
                                {""}
                                {isEditable ? (
                                    <DynamicWidthInput
                                    value={plant?.soort || ""}
                                    onChangeText={(value) => updateField("soort", value)}
                                    style={[plantStyles.subtitle, { fontFamily: "Afacad", color: "orange" }]}
                                />
                                ) : (
                                    plant?.soort
                                )}
                            </Text>
                            {isAdmin && (
                                <TouchableOpacity
                                    onPress={toggleEditMode}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="cog"
                                        size={40}
                                        color={isEditable ? "orange" : "#2E5651"}
                                    />
                                </TouchableOpacity>
                            )}
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
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(String(plant?.dagenInKas || ""))}
                                                onChangeText={(value) => updateField("dagenInKas", value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(String(plant.dagenInKas))
                                        )}
                                            
                                    </Text>
                                </View>
                                <View style={[plantStyles.articleItems, { position: "relative" }]}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Kant:</Text>
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(editedKant || "")}
                                                onChangeText={(value) => setEditedKant(value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(plant.kant)
                                        )}
                                    </Text>
                                </View>
                            </View>
                            <View style={plantStyles.paddingView}>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Totaal Geplant:</Text>
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(String(plant?.totaalGeplant || ""))}
                                                onChangeText={(value: any) => updateField("totaalGeplant", value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(String(plant.totaalGeplant))
                                        )}
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Mislukte Oogst:</Text>
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(String(plant?.mislukteOogst || ""))}
                                                onChangeText={(value: any) => updateField("totaalGeplant", value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(String(plant.mislukteOogst))
                                        )}
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Succesvolle Oogst:</Text>
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(String(plant?.succesvolleOogst || ""))}
                                                onChangeText={(value) => updateField("dagenInKas", value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(String(plant.succesvolleOogst))
                                        )}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={[homeStyles.infoSectionContainer, plantStyles.articlesParent]}>
                            <View style={plantStyles.borderContainer}>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Naam:</Text>
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(String(plant?.naam || ""))}
                                                onChangeText={(value) => updateField("dagenInKas", value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(String(plant.naam))
                                        )}
                                            
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Wetenschappelijke Naam:</Text>
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(String(plant?.wetenschappelijkeNaam || ""))}
                                                onChangeText={(value) => updateField("dagenInKas", value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(String(plant.wetenschappelijkeNaam))
                                        )}
                                            
                                    </Text>
                                </View>
                            </View>
                            <View style={plantStyles.borderContainer}>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Zonlicht:</Text>
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(String(plant?.zonlicht || ""))}
                                                onChangeText={(value) => updateField("dagenInKas", value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(String(plant.zonlicht))
                                        )}
                                            
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Irrigatie Frequentie:</Text>
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(String(plant?.irrigatieFrequentie || ""))}
                                                onChangeText={(value) => updateField("dagenInKas", value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(String(plant.irrigatieFrequentie))
                                        )}
                                            
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Laatste Irrigratie:</Text>
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(String(plant?.laatsteIrrigratie || ""))}
                                                onChangeText={(value) => updateField("dagenInKas", value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(String(plant.laatsteIrrigratie))
                                        )}
                                            
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Aankomende Irrigratie:</Text>
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(String(plant?.aankomendeIrrigratie || ""))}
                                                onChangeText={(value) => updateField("dagenInKas", value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(String(plant.aankomendeIrrigratie))
                                        )}
                                            
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Laatste Bemesting:</Text>
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(String(plant?.laatsteBemesting || ""))}
                                                onChangeText={(value) => updateField("dagenInKas", value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(String(plant.laatsteBemesting))
                                        )}
                                            
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Aankomende Bemesting:</Text>
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(String(plant?.aankomendeBemesting || ""))}
                                                onChangeText={(value) => updateField("dagenInKas", value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(String(plant.aankomendeBemesting))
                                        )}
                                            
                                    </Text>
                                </View>
                            </View>
                            <View style={plantStyles.paddingView}>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Meest Succesvolle Maand:</Text>
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(String(plant?.meestSuccesvolleMaand || ""))}
                                                onChangeText={(value) => updateField("dagenInKas", value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(String(plant.meestSuccesvolleMaand))
                                        )}
                                            
                                    </Text>
                                </View>
                                <View style={plantStyles.articleItems}>
                                    <Text style={[plantStyles.teksten, { fontFamily: "Afacad" }]}>Meest Succesvolle Seizoen:</Text>
                                    <Text 
                                        style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad" }]}
                                        onLayout={(event) => {
                                            const { width } = event.nativeEvent.layout;
                                            setTextWidth(width)
                                        }}
                                    >
                                        {isEditable ? (
                                            <DynamicWidthInput
                                                value={capitalizeFirstLetter(String(plant?.meestSuccesvolleSeizoen || ""))}
                                                onChangeText={(value) => updateField("dagenInKas", value)}
                                                style={[plantStyles.teksten, plantStyles.tweedeItem, { fontFamily: "Afacad", color: "orange" }]}
                                            />
                                        ) : (
                                            capitalizeFirstLetter(String(plant.meestSuccesvolleSeizoen))
                                        )}
                                            
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                <ExpandableMenu />

                {/* Plant teovoegen modal */}
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
                                    De {fullSide === "Links" ? "linkerkant" : "rechterkant"} zit vol. 
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
