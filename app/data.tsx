import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
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
import { Foutmelding, Wijziging } from "@/assets/interfaces/customInterfaces";
import { plantStyles } from "@/constants/PlantStyles";
import { sensorStyles } from "@/constants/SensorStyles";

const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const Data: React.FC = () => {
    // const [plants, setPlants] = useState<(PlantItem | null)[]>([]);
    // const [scrollPosition, setScrollPosition] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [foutmeldingen, setFoutmelding] = useState<Foutmelding[]>([]);
    const [wijzingen, setWijziging] = useState<Wijziging[]>([])
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isWijzigingenOpen, setIsWijzigingenOpen] = useState(false);

    const [fontsLoaded] = useFonts({
        "Afacad": require("../assets/fonts/Afacad-Regular.ttf"),
        "Akaya": require("../assets/fonts/AkayaKanadaka-Regular.ttf"),
    });

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const storedAuth = await AsyncStorage.getItem("8JUhZ1hcFU1xFzYwf8CeWeNzYpf5ArUb");
                if (storedAuth) {
                    const { user } = JSON.parse(storedAuth);
                    if (user.role === "admin") {
                        setIsAdmin(true);
                    }
                }
            } catch (error) {
                console.error("Fout bij het ophalen van de gebruikersrol:", error);
            }
        };

        const fetchFoutmeldingData = async () => 
            {
                try 
                {
                    const response = await fetch("http://localhost:3000/fetch-data");
                    if (!response.ok) 
                    {
                        throw new Error(`Fout bij het ophalen van de foutmeldingen: ${response.statusText}`);
                    }
                    const data = await response.json();
                    console.log("Ophalen JSON data:", data); 
                    setFoutmelding(data.logboek.foutmeldingen); 
                } 
                catch (error) 
                {
                    console.error("Fout bij het ophalen van foutmeldinggegevens:", error);
                    setError("Kan foutmeldingen niet ophalen.");
                } 
                finally 
                {
                    setLoading(false);
                }
            };         
            
            const fetchWijzingenData = async () => {
                try {
                    const response = await fetch("http://localhost:3000/fetch-data");
                    if (!response.ok) {
                        throw new Error(`Fout bij het ophalen van wijzigingen: ${response.statusText}`);
                    }
                    const data = await response.json();
                    setWijziging(data.logboek.wijzigingen); // Correct gebruik van setWijziging
                } 
                catch (error) {
                    console.error("Fout bij het ophalen van wijziginggegevens:", error);
                    setError("Kan wijzigingen niet ophalen.");
                } 
                finally {
                    setLoading(false);
                }
            };            

            fetchUserRole();
            fetchFoutmeldingData();
            fetchWijzingenData();
    }, []);

    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollHeight, setScrollHeight] = useState(0);
    
    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const viewHeight = event.nativeEvent.layoutMeasurement.height;
    
        const totalScrollableHeight = contentHeight - viewHeight;
        setScrollHeight(totalScrollableHeight);
    
        const position = (offsetY / totalScrollableHeight) * (viewHeight - 50);
        setScrollPosition(Math.max(0, position));
    };    

    return (
        // <ProtectedRoute>
        <Background>
            <View style={sensorStyles.mainContainer}>
                <View style={[homeStyles.infoSectionContainer, plantStyles.articlesParent, styles.uitklapbaarMenu]}>
                    <Text style={[plantenStyles.title, { margin: 0 }]}>Logboek</Text>
                    <TouchableOpacity
                        style={styles.subTitleMenu}
                        onPress={() => setIsOpen(!isOpen)}
                    >
                        <Text style={styles.uitklapMenuTitle}>Foutmeldingen</Text>
                        <View style={isOpen ? styles.triangleDown : styles.triangleUp} />
                    </TouchableOpacity>
                    {isOpen && (
                    <View style={styles.parentFlatlistContainer}>
                        <FlatList
                            data={foutmeldingen}
                            style={styles.binnenContainerFlatlist}
                            showsVerticalScrollIndicator={false}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                            keyExtractor={(item) => item.foutmeldingID.toString()}
                            renderItem={({ item, index }) => (
                                <View style={styles.binnenContainerParent}>
                                    <View
                                        style={[
                                            styles.binnenContainer,
                                            index === foutmeldingen.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 },
                                        ]}
                                    >
                                        <Text style={[styles.innerTitle, { fontFamily: "Afacad" }]}>{item.melding}</Text>
                                        <View style={styles.innerItem}>
                                            <Text style={[styles.eersteTekst, { fontFamily: "Afacad" }]}>Apparaat ID:</Text>
                                            <Text style={[styles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.apparaatID}</Text>
                                        </View>
                                        <View style={styles.innerItem}>
                                            <Text style={[styles.eersteTekst, { fontFamily: "Afacad" }]}>Tijdstip:</Text>
                                            <Text style={[styles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.tijdstip}</Text>
                                        </View>
                                        <View style={styles.innerItem}>
                                            <Text style={[styles.eersteTekst, { fontFamily: "Afacad" }]}>Foutcode:</Text>
                                            <Text style={[styles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.foutcode}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={
                                <View style={{ padding: 20 }}>
                                    <Text style={{ textAlign: "center" }}>Geen foutmeldingen gevonden.</Text>
                                </View>
                            }
                        />
                        <View style={styles.scrollbarTrack}>
                            <View style={[styles.scrollbarThumb, { top: scrollPosition }]} />
                        </View>
                    </View>
                    )}
                {/* </View> */}
                {/* <View style={[homeStyles.infoSectionContainer, plantStyles.articlesParent, styles.uitklapbaarMenu]}> */}
                <TouchableOpacity
    style={styles.subTitleMenu}
    onPress={() => setIsWijzigingenOpen(!isWijzigingenOpen)}
>
    <Text style={styles.uitklapMenuTitle}>Wijzigingen</Text>
    <View style={isWijzigingenOpen ? styles.triangleDown : styles.triangleUp} />
</TouchableOpacity>

                    {isOpen && (
                    <View style={styles.parentFlatlistContainer}>
                        <FlatList
    data={wijzingen}
    style={styles.binnenContainerFlatlist}
    showsVerticalScrollIndicator={false}
    keyExtractor={(item) => item.wijzigingID.toString()}
    renderItem={({ item, index }) => (
        <View style={styles.binnenContainerParent}>
            <View
                style={[
                    styles.binnenContainer,
                    index === wijzingen.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 },
                ]}
            >
                <Text style={[styles.innerTitle, { fontFamily: "Afacad" }]}>{item.wijziging}</Text>
                <View style={styles.innerItem}>
                    <Text style={[styles.eersteTekst, { fontFamily: "Afacad" }]}>Naam:</Text>
                    <Text style={[styles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.apparaat}</Text>
                </View>
                <View style={styles.innerItem}>
                    <Text style={[styles.eersteTekst, { fontFamily: "Afacad" }]}>Apparaat ID:</Text>
                    <Text style={[styles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.apparaatID}</Text>
                </View>
                <View style={styles.innerItem}>
                    <Text style={[styles.eersteTekst, { fontFamily: "Afacad" }]}>Tijdstip:</Text>
                    <Text style={[styles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.tijdstip}</Text>
                </View>
            </View>
        </View>
    )}
    ListEmptyComponent={
        <View style={{ padding: 20 }}>
            <Text style={{ textAlign: "center" }}>Geen wijzigingen gevonden.</Text>
        </View>
    }
/>

                        <View style={styles.scrollbarTrack}>
                            <View style={[styles.scrollbarThumb, { top: scrollPosition }]} />
                        </View>
                    </View>
                    )}
                </View>
            </View>
            <ExpandableMenu />
        </Background>
        // </ProtectedRoute>
    );
};

const styles = StyleSheet.create({
    uitklapbaarMenu:
    { 
        marginHorizontal: 10, 
        marginBottom: 15, 
        paddingTop: 10, 
        paddingBottom: 25, 
        gap: 0 
    },
    uitklapMenuTitle:
    { 
        fontSize: 20, 
        color: "white", 
        fontWeight: "bold", 
        marginRight: 10 
    },
    containerTitle:
    { 
        borderBottomWidth: 3, 
        borderColor: Colors.light.primary, 
    },
    parentFlatlistContainer:
    {
        flexDirection: "row", 
        flex: 1, 
        backgroundColor: "rgba(221, 245, 222, 0.5)"
        // backgroundColor: "red",
    },
    binnenContainerParent:
    {
        paddingVertical: 5, 
        paddingHorizontal: 15, 
    },
    binnenContainer:
    { 
        // backgroundColor: "rgba(221, 245, 222, 0.5)"
        borderBottomWidth: 3, 
        borderColor: Colors.light.primary, 
        gap: 1, 
        paddingBottom: 10
    },
    binnenContainerFlatlist:
    { 
        // backgroundColor: "white" 
        maxHeight: 250,
    },
    innerTitle:
    {
        fontWeight: "bold",
        fontSize: 20,
        color: "#353535"
    },
    innerItem:
    {
        flexDirection: "row",
        gap: 5,
    },
    eersteTekst:
    {
        fontSize: 20,
        color: "darkgray",
    },
    tweedeTekst:
    {
        fontWeight: "bold",
        fontSize: 20,
        color: "#9C9C9C",
    },
    triangleUp: 
    {
        width: 0,
        height: 0,
        borderLeftWidth: 13,
        borderRightWidth: 13,
        borderBottomWidth: 20,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: Colors.light.text, 
    },
    triangleDown: 
    {
        width: 0,
        height: 0,
        borderLeftWidth: 13,
        borderRightWidth: 13,
        borderTopWidth: 20,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: Colors.light.text,
    },
    subTitleMenu:
    { 
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: "#ABD3AE", 
        justifyContent: "space-between", 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderTopLeftRadius: 10, 
        borderTopRightRadius: 10, 
        marginTop: 20 
    },
    scrollbarTrack: {
        width: 12,
        height: 250,
        marginHorizontal: 15,
        backgroundColor: "white",
        borderRadius: 15,
        position: "relative",
        borderColor: Colors.light.primary,
        borderWidth: 2,
        margin: 10,
    },
    scrollbarThumb: {
        width: 8,
        height: 45,
        backgroundColor: Colors.light.text,
        borderRadius: 15,
        position: "absolute",
    },
    
    
});

export default Data;
