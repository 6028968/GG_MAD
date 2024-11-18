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
import { homeStyles } from "@/constants/HomeStyles"

const InfoSection: React.FC<{ toggle: string }> = ({ toggle }) => 
    {
        const [leftItems, setLeftItems] = useState<string[]>([]);
        const [rightItems, setRightItems] = useState<string[]>([]);
        const MAX_ITEMS = 7;
        const [isModalVisible, setModalVisible] = useState(false);
        const [newItemName, setNewItemName] = useState("");
        const router = useRouter();

        const [fontsLoaded] = useFonts({
            "Afacad": require("../assets/fonts/Afacad-Regular.ttf"),
            "Akaya": require("../assets/fonts/AkayaKanadaka-Regular.ttf"),
        });

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
            <View style={homeStyles.infoSectionContainer}>
                {toggle === "Links" && (
                    <TouchableOpacity
                        style={homeStyles.itemContainer}
                        onPress={() => router.push(`/plant/1`)}
                    >
                        <View style={homeStyles.iconContainer}>
                            <MaterialCommunityIcons name="apple" size={24} color="white" />
                        </View>
                        <View style={homeStyles.labelContainer}>
                            <Text style={[homeStyles.itemLabel, { fontFamily: "akaya" }]}>
                                Appel
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
    
                {toggle === "Rechts" && (
                    <TouchableOpacity
                        style={homeStyles.itemContainer}
                        onPress={() => router.push(`/plant/2`)}
                    >
                        <View style={homeStyles.iconContainer}>
                            <MaterialCommunityIcons name="food" size={24} color="white" />
                        </View>
                        <View style={homeStyles.labelContainer}>
                            <Text style={[homeStyles.itemLabel,{ fontFamily: "akaya" }]}>Peer</Text>
                        </View>
                    </TouchableOpacity>
                )}
    
                <View style={homeStyles.listContainer}>
                    {[...Array(MAX_ITEMS)].map((_, index) => {
                        const currentItems = getCurrentItems();
                    
                        if (currentItems[index]) 
                        {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => router.push(`/plant/${currentItems[index]}`)} // Dit navigeert naar de specifieke plantpagina
                                    style={homeStyles.itemContainer}
                                >
                                    <View style={homeStyles.iconContainer}>
                                        <MaterialCommunityIcons name="food" size={24} color="white" />
                                    </View>
                                    <View style={homeStyles.labelContainer}>
                                        <Text style={[homeStyles.itemLabel, { fontFamily: "akaya" }]}>
                                            {currentItems[index]}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                            );
                        } 
                        else if (index === currentItems.length) 
                        {
                            return (
                                <TouchableOpacity key={index} onPress={handleAddItem} style={homeStyles.dottedItem}>
                                    <MaterialCommunityIcons name="plus" size={60} color="rgba(171, 211, 174, 1)" />
                                </TouchableOpacity>
                            );
                        } 
                        else 
                        {
                            return (
                                <View key={index} style={homeStyles.dottedItem} />
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
                    <View style={homeStyles.modalOverlay}>
                        <View style={homeStyles.outerModalContainer}>
                            <View style={homeStyles.modalContainer}>
                                <Text style={homeStyles.modalTitle}>Vul een plant in</Text>
                                <View>
                                    <Text style={homeStyles.inputText}>Plant naam:</Text>
                                    <TextInput
                                        style={homeStyles.input}
                                        value={newItemName}
                                        onChangeText={setNewItemName}
                                        placeholder=""
                                    />
                                </View>
                                <View style={homeStyles.buttonContainer}>
                                    <TouchableOpacity style={[homeStyles.button, homeStyles.addButton]} onPress={handleSaveItem}>
                                        <Text style={{fontFamily: "Akaya", color: "white"}}>Toevoegen</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[homeStyles.button, homeStyles.cancelButton]} onPress={() => setModalVisible(false)}>
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
                        <ScrollView contentContainerStyle={homeStyles.scrollViewContent}>
                            <WeatherForecast />
        
                            <View style={homeStyles.toggleContainer}>
                                <TouchableOpacity
                                    style={[homeStyles.toggleButtonLeft, toggle === "Links" && homeStyles.activeButton]}
                                    onPress={() => setToggle("Links")}
                                >
                                    <Text style={[homeStyles.toggleText, toggle === "Links" && homeStyles.activeText, { fontFamily: "akaya" }]}>Links</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[homeStyles.toggleButtonRight, toggle === "Rechts" && homeStyles.activeButton]}
                                    onPress={() => setToggle("Rechts")}
                                >
                                    <Text style={[homeStyles.toggleText, toggle === "Rechts" && homeStyles.activeText, { fontFamily: "akaya" }]}>Rechts</Text>
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

