import React from "react";
import {
    FlatList,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import plants from "@/assets/data/plants.json"; // JSON-data importeren

type PlantItem = {
    id: number;
    naam: string;
    soort: string;
    wetenschappelijkeNaam: string;
    aanwezig: boolean;
};


const PlantItemComponent: React.FC<PlantItem> = ({ id, naam, soort, wetenschappelijkeNaam, aanwezig }) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            style={[styles.plantItem, aanwezig ? styles.activeItem : styles.inactiveItem]} // Gebruik aanwezig om stijl aan te passen
            onPress={() => router.push(`/plant/${id}`)}
        >
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="apple" size={24} color="#4C8C4A" />
            </View>
            <View>
                <Text style={styles.plantName}>{naam}</Text>
                <Text style={styles.plantDetails}>{wetenschappelijkeNaam}</Text>
            </View>
        </TouchableOpacity>
    );
};


const PlantList: React.FC = () => {
    return (
        <ProtectedRoute>
            <View style={styles.container}>
                <Text style={styles.title}>Alle Planten</Text>
                <FlatList
    data={plants}
    renderItem={({ item }) => (
        <PlantItemComponent
            id={item.id}
            naam={item.naam}
            soort={item.soort}
            wetenschappelijkeNaam={item.wetenschappelijkeNaam}
            aanwezig={item.aanwezig} // Voeg aanwezig toe
        />
    )}
    keyExtractor={(item) => item.id.toString()}
/>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerButton}>
                        <Text style={styles.footerButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton}>
                        <MaterialCommunityIcons
                            name="cog"
                            size={24}
                            color="#4C8C4A"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton}>
                        <MaterialCommunityIcons
                            name="magnify"
                            size={24}
                            color="#4C8C4A"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </ProtectedRoute>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F9EE",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
        fontFamily: "Akaya",
        color: "#4C8C4A",
    },
    list: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 12,
        padding: 10,
    },
    plantItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        padding: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 40,
        height: 40,
        backgroundColor: "#E7F5E9",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    plantName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4C8C4A",
    },
    plantDetails: {
        fontSize: 14,
        color: "#7B7B7B",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    footerButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#E7F5E9",
        justifyContent: "center",
        alignItems: "center",
    },
    footerButtonText: {
        fontSize: 24,
        color: "#4C8C4A",
        fontWeight: "bold",
    },
    activeItem: {
        borderColor: "#4C8C4A",
    },
    inactiveItem: {
        borderColor: "#FF6F61",
        opacity: 0.6,
    },
});

export default PlantList;
