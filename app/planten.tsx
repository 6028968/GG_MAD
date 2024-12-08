import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet, Image, Alert, Modal, TextInput, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PlantItem } from "@/assets/types/plantTypes"
import { homeStyles } from "@/constants/HomeStyles"
import Background from "@/components/Background"; 
import ExpandableMenu from "../components/MenuDownUnder"; 
import Colors from "@/constants/Colors";
import { useFonts } from "expo-font";
import { plantenStyles } from "@/constants/PlantenStyles"
import DropDownPicker from "react-native-dropdown-picker";
import CustomSwitch from "@/components/CustomSwitch";

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

const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const getIcon = (soort: string, aanwezig: boolean): any => {
    const lowerSoort = soort.toLowerCase();
    const status = aanwezig ? "available" : "unavailable";

    if (iconMap[lowerSoort]) {
        return iconMap[lowerSoort][status];
    }
};

const PlantItemComponent: React.FC<{ plant: PlantItem | null }> = ({ plant }) => {
    const router = useRouter();

    if (!plant) {
        return <View style={[plantenStyles.placeholderItem]} />;
    }

    const [fontsLoaded] = useFonts({
        "Afacad": require("../assets/fonts/Afacad-Regular.ttf"),
        "Akaya": require("../assets/fonts/AkayaKanadaka-Regular.ttf"),
    });

    const textColor = plant.aanwezig ? "rgb(46, 86, 81)" : "lightgray";
    const borderColor = plant.aanwezig ? "rgba(171, 211, 174, 1)" : "lightgray";
    const iconColorBox = plant.aanwezig ? "rgba(171, 211, 174, 1)" : "lightgray";

    return (
        <TouchableOpacity
            style={[
                homeStyles.itemContainer,
                plant.aanwezig ? plantenStyles.activeItem : plantenStyles.inactiveItem,
            ]}
            onPress={() => router.push(`/plant/${plant.id}`)}
        >
            <View
                style={[
                    [homeStyles.iconContainer, {backgroundColor: iconColorBox}]
                ]}
            >
                <Image
                    source={getIcon(plant.soort, plant.aanwezig)}
                    style={{ width: 50, height: 50 }}
                    resizeMode="contain"
                />
            </View>
            <View style={[homeStyles.labelContainer, { borderColor: borderColor }]}>
                <Text
                    style={[
                        homeStyles.itemLabel,
                        { fontFamily: "Akaya", color: textColor },
                    ]}
                >
                    {capitalizeFirstLetter(plant.naam)}
                </Text>
                <Text
                    style={[
                        plantenStyles.plantDetails,
                        { fontFamily: "Afacad", color: textColor },
                    ]}
                >
                    {plant.soort}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const PlantList: React.FC = () => {
    const [plants, setPlants] = useState<(PlantItem | null)[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newPlantName, setNewPlantName] = useState("");
    const [newPlantType, setNewPlantType] = useState("Fruit");
    const [newPlantLocation, setNewPlantLocation] = useState<"links" | "rechts">("links");
    const [isPlantPresent, setIsPlantPresent] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLimitModalVisible, setLimitModalVisible] = useState(false);
    const [fullSide, setFullSide] = useState<"links" | "rechts" | null>(null);

    useEffect(() => {
        const loadPlants = async () => {
            try {
                const savedPlants = await AsyncStorage.getItem("plants");
                const parsedPlants: PlantItem[] = savedPlants ? JSON.parse(savedPlants) : [];
                const totalItems = 20;
                const placeholders = Array(totalItems - parsedPlants.length).fill(null);
                const updatedPlants = [...parsedPlants, ...placeholders]; 
                setPlants(updatedPlants);
            } catch (error) {
                console.error("Fout bij het laden van planten:", error);
            }
        };

        loadPlants();
    }, []);

    const handleAddPlant = async () => 
        {
            if (!newPlantName.trim()) 
            {
                Alert.alert("Fout", "Voer een geldige naam in.");
                return;
            }
        
            try 
            {
                const savedPlants = await AsyncStorage.getItem("plants");
                const existingPlants: PlantItem[] = savedPlants ? JSON.parse(savedPlants) : [];
        
                if (isPlantPresent) 
                {
                    const plantsOnSide = existingPlants.filter(
                        (plant) => plant.kant === newPlantLocation && plant.aanwezig
                    );
        
                    if (plantsOnSide.length >= 8) 
                    {
                        setFullSide(newPlantLocation);
                        setLimitModalVisible(true);
                        return;
                    }
                }
        
                const newPlant: PlantItem = 
                {
                    id: Date.now(),
                    naam: newPlantName,
                    soort: newPlantType,
                    aanwezig: isPlantPresent,
                    kant: newPlantLocation,
                };
        
                const updatedPlants = [...existingPlants, newPlant];
                await AsyncStorage.setItem("plants", JSON.stringify(updatedPlants));
        
                setPlants(updatedPlants);
        
                setNewPlantName("");
                setNewPlantType("Fruit");
                setNewPlantLocation("links");
                setIsPlantPresent(true);
                setModalVisible(false);
            } 
            catch (error) 
            {
                console.error("Fout bij het toevoegen van de plant:", error);
                Alert.alert("Fout", "Kon de plant niet toevoegen. Probeer opnieuw.");
            }
        };
        

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const viewHeight = event.nativeEvent.layoutMeasurement.height;

        const scrollHeight = contentHeight - viewHeight;
        const position = (offsetY / scrollHeight) * (viewHeight - 50);
        setScrollPosition(position);
    };

    return (
        <ProtectedRoute>
            <Background>
                <View style={plantenStyles.container}>
                    <Text style={plantenStyles.title}>Alle Planten</Text>
                    <FlatList
                        data={plants}
                        renderItem={({ item }) => <PlantItemComponent plant={item} />}
                        keyExtractor={(item, index) => (item ? item.id.toString() : `placeholder-${index}`)}
                        contentContainerStyle={{
                            paddingVertical: 10,
                            paddingHorizontal: 5,
                        }}
                        showsVerticalScrollIndicator={false}
                        onScroll={handleScroll} 
                        scrollEventThrottle={16}
                    />
                    <View style={plantenStyles.scrollbarTrack}>
                        <View style={[plantenStyles.scrollbarThumb, { top: scrollPosition }]} />
                    </View>
                </View>
                <View style={plantenStyles.footer}>
                <TouchableOpacity
                        style={plantenStyles.footerButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={plantenStyles.footerButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={plantenStyles.footerButton}>
                        <MaterialCommunityIcons
                            name="cog"
                            size={50}
                            color={Colors.light.primary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={plantenStyles.footerButton}>
                        <MaterialCommunityIcons
                            name="magnify"
                            size={50}
                            color={Colors.light.primary}
                        />
                    </TouchableOpacity>
                </View>
                <ExpandableMenu />

                {/* Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={homeStyles.modalOverlay}>
                        <View style={homeStyles.outerModalContainer}>
                            <View style={homeStyles.modalContainer}>
                                <Text style={homeStyles.modalTitle}>Plant Toevoegen</Text>
                                <View>
                                    <Text style={homeStyles.inputText}>Plant Naam:</Text>
                                    <TextInput
                                        style={homeStyles.input}
                                        value={newPlantName}
                                        onChangeText={setNewPlantName}
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
                                        value={newPlantType} 
                                        setValue={setNewPlantType}
                                        items={[
                                            { label: "Fruit", value: "Fruit" },
                                            { label: "Groente", value: "Groente" },
                                            { label: "Kruiden", value: "Kruiden" },
                                            { label: "Schimmel", value: "Schimmel" },
                                            { label: "Overig", value: "Overig" },
                                        ]}
                                        placeholder="Selecteer een soort"
                                        style={[homeStyles.input, { height: 10, borderBottomWidth: 2, borderWidth: 0, marginBottom: 0, borderRadius: 0 }]}
                                        dropDownContainerStyle={{
                                            zIndex: 2000,
                                            elevation: 2000,
                                            position: "absolute",
                                        }}
                                        textStyle={{
                                            // textAlign: "center",
                                            fontSize: 16,
                                        }}
                                        placeholderStyle={{
                                            textAlign: "center",
                                        }}
                                        listItemLabelStyle={{
                                            textAlign: "center",
                                        }}
                                        // listItemContainerStyle={{
                                        //     height: 35, 
                                        // }}
                                        selectedItemLabelStyle={{
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    />
                                </View>
                                <View style={{ marginVertical: 10, flexDirection: "row", justifyContent: "space-between" }}>
                                    <View>
                                        <Text style={[homeStyles.inputText, { marginBottom: 5 }]}>Locatie:</Text>
                                        <View style={{ flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
                                            <TouchableOpacity
                                                style={[
                                                    plantenStyles.bulletButton,
                                                    newPlantLocation === "links" && plantenStyles.activeBullet,
                                                ]}
                                                onPress={() => setNewPlantLocation("links")}
                                            >
                                                <View style={plantenStyles.bulletCircle}>
                                                    {newPlantLocation === "links" && <View style={plantenStyles.activeCircle} />}
                                                </View>
                                                <Text style={[plantenStyles.bulletText, { fontFamily: "Akaya", color: "rgb(46, 86, 81)" }]}>
                                                    Links
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[
                                                    plantenStyles.bulletButton,
                                                    newPlantLocation === "rechts" && plantenStyles.activeBullet,
                                                ]}
                                                onPress={() => setNewPlantLocation("rechts")}
                                            >
                                                <View style={plantenStyles.bulletCircle}>
                                                    {newPlantLocation === "rechts" && <View style={plantenStyles.activeCircle} />}
                                                </View>
                                                <Text style={[plantenStyles.bulletText, { fontFamily: "Akaya", color: "rgb(46, 86, 81)" }]}>
                                                    Rechts
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <Text style={[homeStyles.inputText, { marginBottom: 5 }]}>Aanwezig:</Text>
                                    <CustomSwitch
                                        value={isPlantPresent}
                                        onValueChange={async (value) => {
                                            if (value) {
                                                const savedPlants = await AsyncStorage.getItem("plants");
                                                const existingPlants: PlantItem[] = savedPlants ? JSON.parse(savedPlants) : [];
                                            
                                                const plantsOnSide = existingPlants.filter(
                                                    (plant) => plant.kant === newPlantLocation && plant.aanwezig
                                                );
                                            
                                                if (plantsOnSide.length >= 8) {
                                                    setFullSide(newPlantLocation);
                                                    setLimitModalVisible(true);
                                                    return;
                                                }
                                            }
                                            setIsPlantPresent(value);
                                        }}
                                    />
                                </View>
                                <View style={homeStyles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[homeStyles.button, homeStyles.addButton]}
                                        onPress={handleAddPlant}
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
                                    style={[homeStyles.button, homeStyles.addButton, { flex: 1, alignSelf: "center", paddingHorizontal: 40}]}
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

export default PlantList;
