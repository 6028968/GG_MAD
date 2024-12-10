import { PlantItem } from "@/assets/types/plantTypes";
import { homeStyles } from "@/constants/HomeStyles";
import { plantenStyles } from "@/constants/PlantenStyles";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { TouchableOpacity, View, Image, Text } from "react-native";

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

const PlantItemComponent: React.FC<{ 
    plant: PlantItem | null;
    showDeleteButton?: boolean;
    onDelete?: (id: number) => void; }> = ({ plant, showDeleteButton, onDelete }) => {
    const router = useRouter();

    if (!plant) {
        return <View style={[plantenStyles.placeholderItem]} />;
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
                plant.aanwezig ? plantenStyles.activeItem : plantenStyles.inactiveItem,
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
                        plantenStyles.plantDetails,
                        { fontFamily: "Afacad", color: "darkgray" },
                    ]}
                >
                    {plant.soort}
                </Text>
                {showDeleteButton && (
                <TouchableOpacity
                    style={plantenStyles.deleteButton}
                    onPress={() => onDelete && onDelete(plant.id)}
                >
                    <Image
                        source={require("@/assets/images/icons/cross.png")}
                        style={{ width: 30, height: 30 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}
            </View>
        </TouchableOpacity>
    );
};

export default PlantItemComponent;