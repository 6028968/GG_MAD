import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProtectedRoute from "../components/ProtectedRoute";
import PlantItemComponent from "@/components/PlantItemComponent"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PlantItem } from "@/assets/types/plantTypes"
import { homeStyles } from "@/constants/HomeStyles"
import Background from "@/components/Background"; 
import ExpandableMenu from "../components/MenuDownUnder"; 
import Colors from "@/constants/Colors";
import { plantenStyles } from "@/constants/PlantenStyles"
import DropDownPicker from "react-native-dropdown-picker";
import CustomSwitch from "@/components/CustomSwitch";

const PlantList: React.FC = () => {
    const [plants, setPlants] = useState<(PlantItem | null)[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newPlantName, setNewPlantName] = useState("");
    const [newPlantType, setNewPlantType] = useState("Fruit");
    const [newPlantLocation, setNewPlantLocation] = useState<"Links" | "Rechts">("Links");
    const [isPlantPresent, setIsPlantPresent] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLimitModalVisible, setLimitModalVisible] = useState(false);
    const [fullSide, setFullSide] = useState<"Links" | "Rechts" | null>(null);
    const [filterSoort, setFilterSoort] = useState<string | null>(null);
    const [filterKant, setFilterKant] = useState<"Links" | "Rechts" | null>(null);
    const [filterAanwezig, setFilterAanwezig] = useState<boolean | null>(null);
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [isScrollbarVisible, setScrollbarVisible] = useState(false);
    const [showDeleteButtons, setShowDeleteButtons] = useState(false);
    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
    const [plantToDelete, setPlantToDelete] = useState<number | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedAuth = await AsyncStorage.getItem("admin");
                if (storedAuth) {
                    const { user } = JSON.parse(storedAuth);
                    setUser(user);
                    if (user.role === "admin") {
                        setIsAdmin(true);
                    }
                }
            } catch (error) {
                console.error("Fout bij het ophalen van de gebruiker:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

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

    const filteredPlants = plants.filter((plant) => {
        if (!plant) return false;
    
        const matchSoort = filterSoort ? plant.soort === filterSoort : true;
        const matchKant = filterKant ? plant.kant === filterKant : true;
        const matchAanwezig = filterAanwezig !== null ? plant.aanwezig === filterAanwezig : true;
    
        return matchSoort && matchKant && matchAanwezig;
    });
    
    useEffect(() => {
        setScrollbarVisible(filteredPlants.length >= 7);
    }, [filteredPlants]);    

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
                setNewPlantLocation("Links");
                setIsPlantPresent(true);
                setModalVisible(false);
            } 
            catch (error) 
            {
                console.error("Fout bij het toevoegen van de plant:", error);
                Alert.alert("Fout", "Kon de plant niet toevoegen. Probeer opnieuw.");
            }
        };
        
    const handleDeletePlant = async (id: number) => 
        {
            try 
            {
                const updatedPlants = plants.filter((plant) => plant?.id !== id);
                setPlants(updatedPlants);

                const savedPlants = updatedPlants.filter(Boolean) as PlantItem[];
                await AsyncStorage.setItem("plants", JSON.stringify(savedPlants));
            } 
            catch (error) 
            {
                console.error("Fout bij het verwijderen van de plant:", error);
            }
        };

    const toggleDeleteMode = () => 
    {
        setShowDeleteButtons(!showDeleteButtons);
    };

    const confirmDeletePlant = (id: number) => 
    {
        setPlantToDelete(id);
        setConfirmModalVisible(true);
    };
    
    const handleConfirmDelete = async () => 
    {
        if (plantToDelete !== null) 
        {
            await handleDeletePlant(plantToDelete);
            setPlantToDelete(null);
        }
        setConfirmModalVisible(false);
    };
    
    const handleCancelDelete = () => 
    {
        setPlantToDelete(null);
        setConfirmModalVisible(false);
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const viewHeight = event.nativeEvent.layoutMeasurement.height;

        const scrollHeight = contentHeight - viewHeight;
        const position = (offsetY / scrollHeight) * (viewHeight - 50);
        setScrollPosition(position);
    };

    const CloseButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
        <TouchableOpacity
            style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 1000,
            }}
            onPress={onPress}
        >
            <MaterialCommunityIcons name="close" size={30} color="darkgray" />
        </TouchableOpacity>
    );    

    return (
        <ProtectedRoute>
            <Background>
                <View style={plantenStyles.container}>
                    <Text style={plantenStyles.title}>Alle Planten</Text>
                    <FlatList
                        data={filteredPlants}
                        renderItem={({ item }) => 
                            <PlantItemComponent 
                                plant={item} 
                                showDeleteButton={showDeleteButtons}
                                onDelete={confirmDeletePlant}
                            />}
                        keyExtractor={(item, index) => (item ? item.id.toString() : `placeholder-${index}`)}
                        contentContainerStyle={{
                            paddingVertical: 10,
                            paddingHorizontal: 5,
                        }}
                        showsVerticalScrollIndicator={false}
                        onScroll={handleScroll} 
                        scrollEventThrottle={16}
                    />
                    {isScrollbarVisible && (
                        <View style={plantenStyles.scrollbarTrack}>
                            <View style={[plantenStyles.scrollbarThumb, { top: scrollPosition }]} />
                        </View>
                    )}
                </View>
                {isAdmin ? (
                    <View style={plantenStyles.footer}>
                    <TouchableOpacity
                            style={plantenStyles.footerButton}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={plantenStyles.footerButtonText}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={plantenStyles.footerButton} onPress={toggleDeleteMode}>
                            <MaterialCommunityIcons
                                name="cog"
                                size={50}
                                color={Colors.light.primary}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={plantenStyles.footerButton} onPress={() => setFilterModalVisible(true)}>
                            <MaterialCommunityIcons name="magnify" size={50} color={Colors.light.primary} />
                        </TouchableOpacity>
                    </View>
                ) : (<View style={{marginBottom: 50}}></View>
                    
                )}
                    <ExpandableMenu />

                {/* Plant toeveoegen modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={homeStyles.modalOverlay}>
                        <View style={homeStyles.outerModalContainer}>
                            <View style={homeStyles.modalContainer}>
                                <CloseButton onPress={() => setModalVisible(false)} />
                                <Text style={homeStyles.modalTitle}>Plant Toevoegen</Text>
                                <View>
                                    <Text style={homeStyles.inputText}>Plant Naam:</Text>
                                    <TextInput
                                        style={[homeStyles.input, { textAlign: "left" }]}
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
                                <View style={{ marginVertical: 10, flexDirection: "row", justifyContent: "space-between" }}>
                                    <View>
                                        <Text style={[homeStyles.inputText, { marginBottom: 5 }]}>Locatie:</Text>
                                        <View style={{ flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
                                            <TouchableOpacity
                                                style={[
                                                    plantenStyles.bulletButton,
                                                    newPlantLocation === "Links" && plantenStyles.activeBullet,
                                                ]}
                                                onPress={() => setNewPlantLocation("Links")}
                                            >
                                                <View style={plantenStyles.bulletCircle}>
                                                    {newPlantLocation === "Links" && <View style={plantenStyles.activeCircle} />}
                                                </View>
                                                <Text style={[plantenStyles.bulletText, { fontFamily: "Afacad", color: "black", fontWeight: "regular"  }]}>
                                                    Links
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[
                                                    plantenStyles.bulletButton,
                                                    newPlantLocation === "Rechts" && plantenStyles.activeBullet,
                                                ]}
                                                onPress={() => setNewPlantLocation("Rechts")}
                                            >
                                                <View style={plantenStyles.bulletCircle}>
                                                    {newPlantLocation === "Rechts" && <View style={plantenStyles.activeCircle} />}
                                                </View>
                                                <Text style={[plantenStyles.bulletText, { fontFamily: "Afacad", color: "black", fontWeight: "regular" }]}>
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

                {/* Melding kant is vol modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isLimitModalVisible}
                    onRequestClose={() => setLimitModalVisible(false)}
                >
                    <View style={homeStyles.modalOverlay}>
                        <View style={homeStyles.outerModalContainer}>
                            <View style={homeStyles.modalContainer}>
                                <CloseButton onPress={() => setLimitModalVisible(false)} />
                                <Text style={homeStyles.modalTitle}>Kant Vol!</Text>
                                <Text style={[homeStyles.inputText, { textAlign: "center", marginBottom: 15 }]}>
                                    De {fullSide === "Links" ? "linkerkant" : "rechterkant"} zit vol. 
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

                {/* Filter modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isFilterModalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={homeStyles.modalOverlay}>
                        <View style={homeStyles.outerModalContainer}>
                            <View style={homeStyles.modalContainer}>
                                <CloseButton onPress={() => setFilterModalVisible(false)} />
                                <Text style={homeStyles.modalTitle}>Filters</Text>
                                <Text style={homeStyles.inputText}>Soort:</Text>
                                <DropDownPicker
                                    open={dropdownOpen}
                                    setOpen={setDropdownOpen}
                                    value={filterSoort}
                                    setValue={setFilterSoort}
                                    items={[
                                        { label: "Fruit", value: "Fruit" },
                                        { label: "Groente", value: "Groente" },
                                        { label: "Kruiden", value: "Kruiden" },
                                        { label: "Schimmel", value: "Schimmel" },
                                        { label: "Overig", value: "Overig" },
                                    ]}
                                    style={[homeStyles.input, { height: 10, borderBottomWidth: 2, borderWidth: 0, marginBottom: 0, borderRadius: 0 }]}
                                    placeholder="Selecteer een soort"
                                />
                                <View style={{ marginVertical: 10, flexDirection: "row", justifyContent: "space-between" }}>
                                    <View>
                                    <Text style={[homeStyles.inputText, { marginTop: 5 }]}>Kant:</Text>
                                        <View style={{ flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
                                            <TouchableOpacity
                                                style={[
                                                    plantenStyles.bulletButton,
                                                    filterKant === "Links" && plantenStyles.activeBullet,
                                                ]}
                                                onPress={() => setFilterKant("Links")}
                                            >
                                                <View style={plantenStyles.bulletCircle}>
                                                    {filterKant === "Links" && <View style={plantenStyles.activeCircle} />}
                                                </View>
                                                <Text style={[plantenStyles.bulletText, { fontFamily: "Afacad", color: "black", fontWeight: "regular" }]}>
                                                    Links
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[
                                                    plantenStyles.bulletButton,
                                                    filterKant === "Rechts" && plantenStyles.activeBullet,
                                                ]}
                                                onPress={() => setFilterKant("Rechts")}
                                            >
                                                <View style={plantenStyles.bulletCircle}>
                                                    {filterKant === "Rechts" && <View style={plantenStyles.activeCircle} />}
                                                </View>
                                                <Text style={[plantenStyles.bulletText, { fontFamily: "Afacad", color: "black", fontWeight: "regular" }]}>
                                                    Rechts
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>                                
                                <Text style={[homeStyles.inputText, { marginVertical: 5 }]}>Aanwezig:</Text>
                                <CustomSwitch
                                    value={filterAanwezig === true} 
                                    onValueChange={(value) => setFilterAanwezig(value)} 
                                />
                                <View style={homeStyles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[homeStyles.button, homeStyles.addButton]}
                                        onPress={() => setFilterModalVisible(false)}
                                    >
                                        <Text style={{ fontFamily: "Akaya", color: "white", fontSize: 20 }}>Toepassen</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[homeStyles.button, homeStyles.cancelButton]}
                                        onPress={() => {
                                            setFilterSoort(null); 
                                            setFilterKant(null); 
                                            setFilterAanwezig(null); 
                                            setFilterModalVisible(false); 
                                        }}
                                    >
                                        <Text style={{ fontFamily: "Akaya", color: "white", fontSize: 20 }}>Reset</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Delete plant modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isConfirmModalVisible}
                    onRequestClose={handleCancelDelete}
                >
                    <View style={homeStyles.modalOverlay}>
                        <View style={homeStyles.outerModalContainer}>
                            <View style={homeStyles.modalContainer}>
                                <CloseButton onPress={handleCancelDelete} />
                                <Text style={homeStyles.modalTitle}>Bevestiging</Text>
                                <Text style={[homeStyles.inputText, { textAlign: "center", marginBottom: 20 }]}>
                                    Weet je zeker dat je deze plant wilt verwijderen?
                                </Text>
                                <View style={homeStyles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[homeStyles.button, homeStyles.cancelButton]}
                                        onPress={handleCancelDelete}
                                    >
                                        <Text style={{ fontFamily: "Akaya", color: "white", fontSize: 18 }}>
                                            Annuleren
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[homeStyles.button, homeStyles.addButton]}
                                        onPress={handleConfirmDelete}
                                    >
                                        <Text style={{ fontFamily: "Akaya", color: "white", fontSize: 18 }}>
                                            Verwijderen
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </Background>
        </ProtectedRoute>
    );
};

export default PlantList;