import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ClearStorageButton: React.FC = () => {
    const clearStorage = async () => {
        try {
            await AsyncStorage.clear();
            console.log("AsyncStorage is succesvol leeggemaakt!");
            alert("Storage is leeggemaakt!"); // Optionele feedback aan de gebruiker
        } catch (error) {
            console.error("Fout bij het leegmaken van storage:", error);
            alert("Fout bij het leegmaken van storage. Probeer opnieuw.");
        }
    };

    return (
        <TouchableOpacity onPress={clearStorage} style={styles.button}>
            <Text style={styles.text}>Clear Storage</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#ff6666",
        padding: 12,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: "center",
    },
    text: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default ClearStorageButton;
