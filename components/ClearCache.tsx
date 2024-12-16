import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { homeStyles } from "@/constants/HomeStyles";
import { Alert } from "react-native";

const ClearStorageButton: React.FC = () => {
    const router = useRouter();
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

    const handleConfirm = async () => {
        try {
            await AsyncStorage.clear();
            setIsConfirmModalVisible(false);
            Alert.alert("Succes", "De database is gewist! Je wordt uitgelogd.", [
                {
                    text: "OK",
                    onPress: () => {
                        router.replace("/");
                    },
                },
            ]);
        } catch (error) {
            console.error("Fout bij het leegmaken van storage:", error);
            Alert.alert("Fout", "Er is een fout opgetreden bij het wissen van de database. Probeer opnieuw.");
        }
    };

    return (
        <>
            <TouchableOpacity onPress={() => setIsConfirmModalVisible(true)}>
                <Text style={styles.text}>Database wissen</Text>
            </TouchableOpacity>

            {/* Modal om database te wissen */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isConfirmModalVisible}
                onRequestClose={() => setIsConfirmModalVisible(false)}
            >
                <View style={homeStyles.modalOverlay}>
                    <View style={homeStyles.outerModalContainer}>
                        <View style={homeStyles.modalContainer}>
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    zIndex: 1000,
                                }}
                                onPress={() => setIsConfirmModalVisible(false)}
                            >
                                <MaterialCommunityIcons name="close" size={30} color="darkgray" />
                            </TouchableOpacity>
                            <Text style={homeStyles.modalTitle}>Database Wissen</Text>
                            <Text style={[homeStyles.inputText, { textAlign: "center", marginTop: 15 }]}>
                                Weet je zeker dat je de database wilt wissen? Dit kan niet ongedaan worden.
                            </Text>
                            <View style={{ flexDirection: "row", marginTop: 20 }}>
                                <TouchableOpacity
                                    style={[homeStyles.button, homeStyles.cancelButton, { flex: 1, marginRight: 10 }]}
                                    onPress={() => setIsConfirmModalVisible(false)}
                                >
                                    <Text style={{ fontFamily: "Akaya", color: "white", fontSize: 18 }}>Annuleren</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[homeStyles.button, homeStyles.addButton, { flex: 1, marginLeft: 10 }]}
                                    onPress={handleConfirm}
                                >
                                    <Text style={{ fontFamily: "Akaya", color: "white", fontSize: 18 }}>Wissen</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    text: {
        color: "red",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default ClearStorageButton;
