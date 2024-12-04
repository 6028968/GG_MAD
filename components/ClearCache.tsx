import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const ClearStorageButton: React.FC = () => {
    const router = useRouter();

    const clearStorage = async () => {
        try {
            await AsyncStorage.clear();
            Alert.alert("Succes", "De storage is gewist! Je wordt uitgelogd.", [
                {
                    text: "OK",
                    onPress: () => {
                        router.replace("/"); 
                    },
                },
            ]);
        } catch (error) {
            console.error("Fout bij het leegmaken van storage:", error);
            Alert.alert("Fout", "Er is een fout opgetreden bij het wissen van de storage. Probeer opnieuw.");
        }
    };

    return (
        <TouchableOpacity onPress={clearStorage}>
            <Text style={styles.text}>Database wissen</Text>
        </TouchableOpacity>
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
