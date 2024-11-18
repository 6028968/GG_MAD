import React, { useEffect } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import plants from "../../assets/data/plants.json"; 
import { GlobalStyles } from "@/constants/GlobalStyles";
import useFonts from "../../hooks/useFonts";
import ProtectedRoute from "../../components/ProtectedRoute";

const PlantDetailScreen: React.FC = () => {
    const { id } = useLocalSearchParams(); // Haalt ID op uit de URL
    const plant = plants.find((p) => p.id === parseInt(id as string, 10)); // Zoek plant op ID
    const navigation = useNavigation();
    const fontsLoaded = useFonts();

    useEffect(() => {
        if (plant) {
            navigation.setOptions({
                title: `${plant.naam} (${plant.soort})`,
            });
        } else {
            console.log("Plant not found with ID:", id);
        }
    }, [plant, navigation]);

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" />;
    }

    if (!plant) {
        return (
            <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>Plant not found.</Text>
            </View>
        );
    }

    return (
        <ProtectedRoute>
            <View style={styles.container}>
                <Text style={styles.title}>{plant.naam}</Text>
                <Text style={styles.subTitle}>{plant.wetenschappelijkeNaam}</Text>
                <Text style={styles.details}>Soort: {plant.soort}</Text>
                <Text style={styles.details}>Aanwezig: {plant.aanwezig ? "Ja" : "Nee"}</Text>
                <Text style={styles.details}>Dagen in kas: {plant.dagenInKas}</Text>
                <Text style={styles.details}>Zonlicht: {plant.zonlicht}</Text>
                <Text style={styles.details}>Irrigatiefrequentie: {plant.irrigatieFrequentie}</Text>
                <Text style={styles.details}>
                    Laatste irrigatie: {plant.laatsteIrrigratie}
                </Text>
                <Text style={styles.details}>
                    Aankomende irrigatie: {plant.aankomendeIrrigratie}
                </Text>
                <Text style={styles.details}>
                    Meest succesvolle seizoen: {plant.meestSuccesvolleSeizoen}
                </Text>
            </View>
        </ProtectedRoute>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F5F5F5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#4C8C4A",
    },
    subTitle: {
        fontSize: 18,
        fontStyle: "italic",
        marginBottom: 12,
        color: "#6A6A6A",
    },
    details: {
        fontSize: 16,
        marginBottom: 8,
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    notFoundText: {
        fontSize: 18,
        color: "red",
    },
});

export default PlantDetailScreen;
