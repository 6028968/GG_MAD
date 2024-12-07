import { StyleSheet, Dimensions } from "react-native";
import Colors from "./Colors";

const { width } = Dimensions.get("window");
const margin = 5; 
const itemWidth = (width / 5) - (margin * 3);

export const pompStyles = StyleSheet.create({
    pompIcon: {
        width: 40,
        height: 40,
        marginHorizontal: 10,
    },
});