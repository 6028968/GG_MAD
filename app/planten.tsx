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
import { styles } from "@/constants/PlantenStyles"

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
        return <View style={[styles.placeholderItem]} />;
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
                plant.aanwezig ? styles.activeItem : styles.inactiveItem,
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
                        styles.plantDetails,
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
    const [scrollPosition, setScrollPosition] = useState(0);

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
                <View style={styles.container}>
                    <Text style={styles.title}>Alle Planten</Text>
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
                    <View style={styles.scrollbarTrack}>
                        <View style={[styles.scrollbarThumb, { top: scrollPosition }]} />
                    </View>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerButton}>
                        <Text style={styles.footerButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton}>
                        <MaterialCommunityIcons
                            name="cog"
                            size={50}
                            color={Colors.light.primary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton}>
                        <MaterialCommunityIcons
                            name="magnify"
                            size={50}
                            color={Colors.light.primary}
                        />
                    </TouchableOpacity>
                </View>
                <ExpandableMenu />
            </Background>
        </ProtectedRoute>
    );
};

export default PlantList;
