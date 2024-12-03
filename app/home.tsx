import React, { useEffect, useState } from "react";
import { Modal, TextInput, Button, Alert, ScrollView, View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import ProtectedRoute from "../components/ProtectedRoute"; 
import Background from "@/components/Background"; 
import { useRouter } from "expo-router";
import WeatherForecast from "../components/WeatherForecast";
import ExpandableMenu from "../components/MenuDownUnder"; 
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import Colors from "@/constants/Colors";
import { useFonts } from 'expo-font';
import { homeStyles } from "@/constants/HomeStyles"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Plant } from "@/assets/types/plantTypes";
import DropDownPicker from "react-native-dropdown-picker";
import AdminOnly from "@/components/AdminOnly";

const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const iconMap: Record<string, Record<string, any>> = {
    fruit: {
        available: require("@/assets/images/icons/soort/strawberry.png"),
        unavailable: require("@/assets/images/icons/soort/strawberry.png"),
    },
    groente: {
        available: require("@/assets/images/icons/soort/carrot.png"),
        unavailable: require("@/assets/images/icons/soort/carrot.png"),
    },
    overig: {
        available: require("@/assets/images/icons/soort/leaf.png"),
        unavailable: require("@/assets/images/icons/soort/leaf.png"),
    },
    schimmel: {
        available: require("@/assets/images/icons/soort/mushroom.png"),
        unavailable: require("@/assets/images/icons/soort/mushroom.png"),
    },
    kruiden: {
        available: require("@/assets/images/icons/soort/salt.png"),
        unavailable: require("@/assets/images/icons/soort/salt.png"),
    },
};

const getIcon = (soort: string, aanwezig: boolean): any => {
    const lowerSoort = soort.toLowerCase(); 
    const status = aanwezig ? "available" : "unavailable";

    if (iconMap[lowerSoort]) {
        return iconMap[lowerSoort][status];
    }
};

const InfoSection: React.FC<{ toggle: string }> = ({ toggle }) => {
    const [leftItems, setLeftItems] = useState<Plant[]>([]);
    const [rightItems, setRightItems] = useState<Plant[]>([]);
    const MAX_ITEMS = 8;
    const [isModalVisible, setModalVisible] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemSoort, setNewItemSoort] = useState("Fruit");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    const router = useRouter();

    const fillWithPlaceholders = (items: Plant[]): (Plant | "add" | null)[] => {
        if (items.length >= MAX_ITEMS) {
            return items;
        }
    
        const placeholders = Array(MAX_ITEMS - items.length - 1).fill(null); 
        return [...items, "add", ...placeholders]; 
    };

    const [fontsLoaded] = useFonts({
        "Afacad": require("../assets/fonts/Afacad-Regular.ttf"),
        "Akaya": require("../assets/fonts/AkayaKanadaka-Regular.ttf"),
    });

    const handleAddItem = () => {
        setModalVisible(true);
    };

    useEffect(() => {
        const loadPlants = async () => {
            try {
                const savedPlants = await AsyncStorage.getItem("plants");
                const parsedPlants: Plant[] = savedPlants ? JSON.parse(savedPlants) : [];
    
                const filteredPlants = parsedPlants.filter((plant) => plant.aanwezig);

                const leftSide = filteredPlants.filter((plant) => plant.kant === "links");
                const rightSide = filteredPlants.filter((plant) => plant.kant === "rechts");
    
                setLeftItems(leftSide);
                setRightItems(rightSide);
            } catch (error) {
                console.error("Failed to load plants:", error);
            }
        };
    
        loadPlants();
    }, []);

    const handleSaveItem = async () => {
        if (newItemName.trim() !== "" && newItemSoort.trim() !== "") {
            try {
                const savedPlants = await AsyncStorage.getItem("plants");
                const existingPlants: Plant[] = savedPlants ? JSON.parse(savedPlants) : [];
    
                const nextId = existingPlants.length > 0
                    ? Math.max(...existingPlants.map((plant) => plant.id)) + 1
                    : 1;
    
                const newPlant: Plant = {
                    id: nextId,
                    naam: newItemName,
                    soort: newItemSoort, 
                    aanwezig: true,
                    wetenschappelijkeNaam: "Lycopersicon esculentum",
                    dagenInKas: 0,
                    totaalGeplant: 0,
                    mislukteOogst: 0,
                    succesvolleOogst: 0,
                    zonlicht: "Onbekend",
                    irrigatieFrequentie: "Onbekend",
                    laatsteIrrigratie: "n.v.t.",
                    aankomendeIrrigratie: "n.v.t.",
                    laatsteBemesting: "n.v.t.",
                    aankomendeBemesting: "n.v.t.",
                    meestSuccesvolleMaand: "n.v.t.",
                    meestSuccesvolleSeizoen: "n.v.t.",
                    kant: toggle.toLowerCase() as "links" | "rechts",
                };
    
                const updatedPlants = [...existingPlants, newPlant];
                await AsyncStorage.setItem("plants", JSON.stringify(updatedPlants));
    
                if (newPlant.kant === "links") {
                    setLeftItems((prev) => [...prev, newPlant]);
                } else if (newPlant.kant === "rechts") {
                    setRightItems((prev) => [...prev, newPlant]);
                }
    
                setNewItemName("");
                setNewItemSoort("");
                setModalVisible(false);
            } catch (error) {
                console.error("Error bij het opslaan van de plant:", error);
                Alert.alert("Fout", "Er ging iets mis bij het opslaan. Probeer opnieuw.");
            }
        } else {
            Alert.alert("Fout", "Voer een geldige naam en soort in.");
        }
    };
    

    const getCurrentItems = (): (Plant | "add" | null)[] => {
        const items = toggle === "Links" ? leftItems : rightItems;
        return fillWithPlaceholders(items); // Zorgt voor placeholders en "+"-knop
    };

    return (
        <View style={homeStyles.infoSectionContainer}>
            <View style={homeStyles.listContainer}>
            {getCurrentItems().map((plant, index) =>
                plant === "add" ? (
                    // "+"-knop
                    <AdminOnly key={`add-button-${toggle}-${index}`}> {/* Unieke key hier */}
                        <TouchableOpacity
                            onPress={handleAddItem}
                            style={homeStyles.dottedItem}
                        >
                            <MaterialCommunityIcons name="plus" size={60} color="rgba(171, 211, 174, 1)" />
                        </TouchableOpacity>
                    </AdminOnly>
                ) : plant ? (
                    // Plant item
                    <TouchableOpacity
                        key={`plant-${plant.id}`} // Unieke key per plant
                        onPress={() => router.push(`/plant/${plant.id}`)}
                        style={homeStyles.itemContainer}
                    >
                        <View style={homeStyles.iconContainer}>
                            <Image
                                source={getIcon(plant.soort, plant.aanwezig)}
                                style={{ width: 50, height: 50 }}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={homeStyles.labelContainer}>
                            <Text style={[homeStyles.itemLabel, { fontFamily: "Akaya" }]}>
                                {capitalizeFirstLetter(plant.naam)}
                            </Text>
                            <Text>{plant.soort}</Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    // Placeholder
            <View key={`placeholder-${index}`} style={homeStyles.dottedItem} />
    )
)}
        </View>

            <Modal
    animationType="slide"
    transparent={true}
    visible={isModalVisible}
    onRequestClose={() => setModalVisible(false)}
>
    <View style={homeStyles.modalOverlay}>
        <View style={homeStyles.outerModalContainer}>
            <View style={homeStyles.modalContainer}>
                <Text style={homeStyles.modalTitle}>Vul een plant in</Text>
                <View>
                    <Text style={homeStyles.inputText}>Plant Naam:</Text>
                    <TextInput
                        style={homeStyles.input}
                        value={newItemName}
                        onChangeText={setNewItemName}
                        placeholder=""
                        selectionColor="rgb(46, 86, 81)"
                    />
                </View>
                <View
                    style={{
                        zIndex: 1000, 
                        elevation: 1000, // Voor Android
                        position: "relative",
                    }}
                >
                    <Text style={homeStyles.inputText}>Plant Soort:</Text>
                    <DropDownPicker
                        open={dropdownOpen}
                        setOpen={setDropdownOpen}
                        value={newItemSoort}
                        setValue={setNewItemSoort}
                        items={[
                            { label: "Fruit", value: "Fruit" },
                            { label: "Groente", value: "Groente" },
                            { label: "Kruiden", value: "Kruiden" },
                            { label: "Schimmel", value: "Schimmel" },
                            { label: "Overig", value: "Overig" },
                        ]}
                        placeholder="Selecteer een soort"
                        style={homeStyles.input}
                        dropDownContainerStyle={{
                            zIndex: 2000, 
                            elevation: 2000,
                            position: "absolute",
                        }}
                        textStyle={{
                            textAlign: "center", 
                            fontSize: 16, 
                        }}
                        placeholderStyle={{
                            textAlign: "center", 
                        }}
                        listItemLabelStyle={{
                            textAlign: "center", 
                        }}
                        selectedItemLabelStyle={{
                            fontWeight: "bold", 
                            textAlign: "center", 
                        }}
                    />
                </View>
                <View style={homeStyles.buttonContainer}>
                    <TouchableOpacity
                        style={[homeStyles.button, homeStyles.addButton]}
                        onPress={handleSaveItem}
                    >
                        <Text style={{ fontFamily: "Akaya", color: "white", fontSize: 20 }}>
                            Toevoegen
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[homeStyles.button, homeStyles.cancelButton]}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={{ fontFamily: "Akaya", color: "white", fontSize: 20 }}>
                            Annuleren
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
</Modal>

        </View>
    );
};

    const HomeScreen: React.FC = () => 
        {
            const [toggle, setToggle] = useState("Links");

            const [fontsLoaded] = useFonts({
                "Akaya": require("../assets/fonts/AkayaKanadaka-Regular.ttf"),
            });

            if (!fontsLoaded) 
            {
                return null;
            }
        
            return (
                <ProtectedRoute>
                    <Background>
                        <ScrollView contentContainerStyle={homeStyles.scrollViewContent}>
                            <WeatherForecast />
        
                            <View style={homeStyles.toggleContainer}>
                                <TouchableOpacity
                                    style={[homeStyles.toggleButtonLeft, toggle === "Links" && homeStyles.activeButton]}
                                    onPress={() => setToggle("Links")}
                                >
                                    <Text style={[homeStyles.toggleText, toggle === "Links" && homeStyles.activeText, { fontFamily: "Akaya" }]}>Links</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[homeStyles.toggleButtonRight, toggle === "Rechts" && homeStyles.activeButton]}
                                    onPress={() => setToggle("Rechts")}
                                >
                                    <Text style={[homeStyles.toggleText, toggle === "Rechts" && homeStyles.activeText, { fontFamily: "Akaya" }]}>Rechts</Text>
                                </TouchableOpacity>
                            </View>
        
                            <InfoSection toggle={toggle} />
                        </ScrollView>
                        <ExpandableMenu />
                    </Background>
                </ProtectedRoute>
            );
        };

export default HomeScreen;

