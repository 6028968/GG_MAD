import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, Button } from "react-native";
import ProtectedRoute from "../components/ProtectedRoute";
import Background from "@/components/Background";
import { useRouter } from "expo-router";
import { GlobalStyles } from "@/constants/GlobalStyles";

const HomeScreen: React.FC = () => 
{
    const router = useRouter();

    return (
        <ProtectedRoute>
            <Background>
                <Button 
                    title="Overzicht" 
                    color="rgba(75, 0, 130, 1)" 
                    onPress={() => router.push("/overzicht")} 
                />
            </Background>
        </ProtectedRoute>
    );
};

export default HomeScreen;
