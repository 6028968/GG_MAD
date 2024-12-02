import React, { useRef, useState } from "react";
import { View, TouchableOpacity, Animated, Dimensions, StyleSheet, Text } from "react-native";
import Colors from "@/constants/Colors";
import { useRouter, Href } from "expo-router";
import { useFonts } from "expo-font";
import ClearStorageButton from "@/components/CLEARCACHE"; // Moet weggehaald worden zodra in productie gaat!!!

const { height } = Dimensions.get("window");

const ExpandableMenu: React.FC = () => 
{
    const router = useRouter();
    const animation = useRef(new Animated.Value(0)).current;
    const [isOpen, setIsOpen] = useState(false);

    const [fontsLoaded] = useFonts({
        "Afacad": require("../assets/fonts/Afacad-Regular.ttf"),
        "Akaya": require("../assets/fonts/AkayaKanadaka-Regular.ttf"),
    });

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
        outputRange: [40, height * 0.6], // Verhoogde hoogte om alle knoppen te kunnen weergeven
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
                <TouchableOpacity onPress={() => navigateToPage("/home")}>
                    <Text style={[styles.menuItemText, { fontFamily: "Akaya" }]}>Home</Text>
                </TouchableOpacity>
            
                <TouchableOpacity onPress={() => navigateToPage("/planten")}>
                    <Text style={[styles.menuItemText, { fontFamily: "Akaya" }]}>Planten</Text>
                </TouchableOpacity>
            
                <TouchableOpacity onPress={() => navigateToPage("/")}>
                    <Text style={[styles.menuItemText, { fontFamily: "Akaya" }]}>Instellingen</Text>
                </TouchableOpacity>
            
                <TouchableOpacity onPress={() => navigateToPage("/")}>
                    <Text style={[styles.menuItemText, { fontFamily: "Akaya" }]}>Sensoren</Text>
                </TouchableOpacity>
            
                <TouchableOpacity onPress={() => navigateToPage("/")}>
                    <Text style={[styles.menuItemText, { fontFamily: "Akaya" }]}>Pompen</Text>
                </TouchableOpacity>
            
                <TouchableOpacity onPress={() => navigateToPage("/")}>
                    <Text style={[styles.menuItemText, { fontFamily: "Akaya" }]}>Data</Text>
                </TouchableOpacity>
            
                <TouchableOpacity onPress={() => navigateToPage("/")}>
                    <Text style={[styles.menuItemText, { fontFamily: "Akaya" }]}>Uitloggen</Text>
                </TouchableOpacity>
                <ClearStorageButton />
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
        backgroundColor: Colors.light.primary,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: "hidden",
    },
    greenBar: 
    {
        backgroundColor: Colors.light.primary,
        alignItems: "center",
        height: 40,
        justifyContent: "center",
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
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingVertical: 20,
    },
    menuItemText: 
    {
        color: Colors.light.text,
        fontSize: 32,
        // fontWeight: "bold",
        textAlign: "center",
        justifyContent: "center",
    },
});


export default ExpandableMenu;
