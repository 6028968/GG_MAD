import React, { useRef, useState } from "react";
import { View, TouchableOpacity, Animated, Dimensions, StyleSheet, Text } from "react-native";
import Colors from "@/constants/Colors";
import { useRouter, Href } from "expo-router";

const { height } = Dimensions.get("window");

const ExpandableMenu: React.FC = () => 
{
    const router = useRouter();
    const animation = useRef(new Animated.Value(0)).current;
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => 
    {
        Animated.timing(animation, {
            toValue: isOpen ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setIsOpen(!isOpen);
    };

    const menuHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [40, height * 0.5], // Verhoogde hoogte om alle knoppen te kunnen weergeven
    });

    const navigateToPage = (page: Href) => 
    {
        router.push(page);
    };

    return (
        <Animated.View style={[styles.menuContainer, { height: menuHeight }]}>
            <TouchableOpacity style={styles.greenBar} onPress={toggleMenu}>
                <View style={isOpen ? styles.triangleDown : styles.triangleUp} />
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.menuContent}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateToPage("/planten")}>
                            <Text style={styles.menuItemText}>Planten</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateToPage("/planten")}>
                            <Text style={styles.menuItemText}>Instellingen</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateToPage("/planten")}>
                            <Text style={styles.menuItemText}>Sensoren</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateToPage("/planten")}>
                            <Text style={styles.menuItemText}>Data</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateToPage("/planten")}>
                            <Text style={styles.menuItemText}>Pomp(en)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateToPage("/planten")}>
                            <Text style={styles.menuItemText}>Uitloggen</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    menuContainer: 
    {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        // backgroundColor: Colors.light.text,
        backgroundColor: "white",
        // backgroundColor: Colors.light.primary,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        overflow: "hidden",
    },
    greenBar: 
    {
        backgroundColor: Colors.light.primary,
        // backgroundColor: Colors.light.text,
        // backgroundColor: "white",
        alignItems: "center",
        height: 40,
        justifyContent: "center",
        // borderColor: Colors.light.primary,
        // borderWidth: 3,
        // borderBottomWidth: 0,
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
    menuContent: 
    {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    buttonRow: 
    {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    menuItem: 
    {
        flex: 1,
        marginHorizontal: 15,
        // backgroundColor: Colors.light.primary,
        backgroundColor: "white",
        paddingVertical: 29,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: Colors.light.primary,
    
        // Schaduw voor Android
        elevation: 8,
    
        // Schaduw voor iOS
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4, 
    },
    
    menuItemText: 
    {
        // color: "white",
        color: Colors.light.primary,
        fontSize: 22,
        fontWeight: "bold",
    },
});

export default ExpandableMenu;
