import React, { useState } from "react";
import { Modal, TextInput, Button, Alert, ScrollView, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import ProtectedRoute from "../components/ProtectedRoute"; 
import Background from "@/components/Background"; 
import { useRouter } from "expo-router";
import WeatherForecast from "../components/WeatherForecast";
import ExpandableMenu from "../components/MenuDownUnder"; 
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import Colors from "@/constants/Colors";
import { useFonts } from 'expo-font';

const InfoSection: React.FC<{ toggle: string }> = ({ toggle }) => 
    {
        const [leftItems, setLeftItems] = useState<string[]>([]);
        const [rightItems, setRightItems] = useState<string[]>([]);
        const MAX_ITEMS = 7;
        const [isModalVisible, setModalVisible] = useState(false);
        const [newItemName, setNewItemName] = useState("");
    
        const handleAddItem = () => 
        {
            setModalVisible(true); 
        };
        
        const handleSaveItem = () => 
        {
            if (newItemName.trim() !== "")
            {
                if (toggle === "Links" && leftItems.length < MAX_ITEMS) 
                {
                    setLeftItems([...leftItems, newItemName]);
                } 
                else if (toggle === "Rechts" && rightItems.length < MAX_ITEMS) 
                {
                    setRightItems([...rightItems, newItemName]);
                }
                setNewItemName("");
                setModalVisible(false); 
            }
            else
            {
                Alert.alert("Error", "Please enter a valid item name.");
            }
        };        
    
        const getCurrentItems = () => {
            return toggle === "Links" ? leftItems : rightItems;
        };
    
        return (
            <View style={styles.infoSectionContainer}>
                {toggle === "Links" && (
                    <View style={styles.itemContainer}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="apple" size={24} color="white" />
                        </View>
                        <View style={styles.labelContainer}>
                            <Text style={styles.itemLabel}>Appel</Text>
                        </View>
                    </View>
                )}
    
                {toggle === "Rechts" && (
                    <View style={styles.itemContainer}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="food" size={24} color="white" />
                        </View>
                        <View style={styles.labelContainer}>
                            <Text style={styles.itemLabel}>Peer</Text>
                        </View>
                    </View>
                )}
    
                <View style={styles.listContainer}>
                    {[...Array(MAX_ITEMS)].map((_, index) => {
                        const currentItems = getCurrentItems();
                    
                        if (currentItems[index]) 
                        {
                            return (
                                <View key={index} style={styles.itemContainer}>
                                    <View style={styles.iconContainer}>
                                        <MaterialCommunityIcons name="food" size={24} color="white" />
                                    </View>
                                    <View style={styles.labelContainer}>
                                        <Text style={styles.itemLabel}>{currentItems[index]}</Text>
                                    </View>
                                </View>
                            );
                        } 
                        else if (index === currentItems.length) 
                        {
                            return (
                                <TouchableOpacity key={index} onPress={handleAddItem} style={styles.dottedItem}>
                                    <MaterialCommunityIcons name="plus" size={60} color="rgba(171, 211, 174, 1)" />
                                </TouchableOpacity>
                            );
                        } 
                        else 
                        {
                            return (
                                <View key={index} style={styles.dottedItem} />
                            );
                        }
                    })}
                </View>
    
                <Modal
    animationType="slide"
    transparent={true}
    visible={isModalVisible}
    onRequestClose={() => setModalVisible(false)}
>
    <View style={styles.modalOverlay}>
        <View style={styles.outerModalContainer}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Vul een plant in</Text>
                <View>
                    <Text style={styles.inputText}>Plant naam:</Text>
                    <TextInput
                        style={styles.input}
                        value={newItemName}
                        onChangeText={setNewItemName}
                        placeholder=""
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleSaveItem}>
                        <Text style={{fontFamily: "Akaya", color: "white"}}>Toevoegen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                        <Text style={{fontFamily: "Akaya", color: "white"}}>Annuleren</Text>
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
                        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                            <WeatherForecast />
        
                            <View style={styles.toggleContainer}>
                                <TouchableOpacity
                                    style={[styles.toggleButtonLeft, toggle === "Links" && styles.activeButton]}
                                    onPress={() => setToggle("Links")}
                                >
                                    <Text style={[styles.toggleText, toggle === "Links" && styles.activeText]}>Links</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.toggleButtonRight, toggle === "Rechts" && styles.activeButton]}
                                    onPress={() => setToggle("Rechts")}
                                >
                                    <Text style={[styles.toggleText, toggle === "Rechts" && styles.activeText]}>Rechts</Text>
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

const styles = StyleSheet.create({
    scrollViewContent: 
    {
        flexGrow: 1,
        paddingBottom: 65,
        margin: 10,
    },
    infoSectionContainer: 
    {
        padding: 20,
        borderWidth: 3,
        borderColor: Colors.light.primary,
        borderRadius: 20,
        backgroundColor: "white",
    },
    toggleContainer: 
    {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 12.5,
    },
    toggleButtonLeft:
    {
        flex: 1,
        paddingVertical: 15,
        alignItems: "center",
        borderWidth: 3,
        borderColor: Colors.light.primary,
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        backgroundColor: "white",
    },
    toggleButtonRight:
    {
        flex: 1,
        paddingVertical: 15,
        alignItems: "center",
        borderWidth: 3,
        borderColor: Colors.light.primary,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: "white",
    },
    activeButton: 
    {
        backgroundColor: Colors.light.primary,
    },
    toggleText: 
    {
        color: Colors.light.primary,
        fontWeight: "bold",
        fontSize: 20,
    },
    activeText: 
    {
        color: "white",
        fontSize: 20,
    },
    itemContainer: 
    {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 1,
    },
    iconContainer: 
    {
        backgroundColor: Colors.light.primary,
        height: 80,
        width: 80,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    labelContainer: 
    {
        flex: 1,
        justifyContent: "center",
        paddingLeft: 10,
        backgroundColor: "white",
        height: 80,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 3,
        borderColor: "rgba(171, 211, 174, 1)"
    },
    itemLabel: 
    {
        fontWeight: "bold",
        fontSize: 25,
        color: Colors.light.primary,
    },
    plusButton: 
    {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    listContainer: 
    {
        flex: 1,
    },
    dottedItem: 
    {
        height: 80,
        borderRadius: 20,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "rgba(171, 211, 174, 0.5)",
        marginBottom: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    modalOverlay: 
    {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    outerModalContainer: 
    {
        padding: 5, 
        backgroundColor: "white", 
        borderRadius: 5, 
        // Schaduw toevoegen
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 }, 
        shadowOpacity: 0.3,
        shadowRadius: 10, 
    },
    
    modalContainer: 
    {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 3,
        borderColor: "rgba(171, 211, 174, 1)", // Border kleur
    },
    

    modalTitle: 
    {
        fontSize: 22,
        // fontWeight: "bold",
        color: Colors.light.text,
        marginBottom: 15,
        fontFamily: "Akaya",
    },
    inputText:
    {
        color: "rgba(128, 128, 128, 0.75)",
        fontWeight: "bold",
    },
    input: 
    {
        width: "100%",
        height: 40,
        borderColor: Colors.light.primary,
        borderWidth: 2,
        borderRadius: 25,
        marginBottom: 15,
        paddingHorizontal: 10,
        textAlign: "center",
        // color: "rgba(128, 128, 128, 0.5)",
    },
    buttonContainer: 
    {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
    },
    button: 
    {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5,
        alignItems: "center",
        borderRadius: 25,
    },
    addButton:
    {
        backgroundColor: Colors.light.text, 
    },
    cancelButton:
    {
        backgroundColor: Colors.light.primary,
    },
    buttonText: 
    {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
