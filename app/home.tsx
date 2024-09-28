import React from "react";
import { View, Button, StyleSheet } from "react-native";
import ProtectedRoute from "../components/ProtectedRoute"; // Assuming you want to protect this route
import Background from "@/components/Background"; // Adjust the path accordingly
import { useRouter } from "expo-router";
import WeatherForecast from "../components/WeatherForecast"; // Import WeatherForecast component

const HomeScreen: React.FC = () => 
{
    const router = useRouter();

    return (
        <ProtectedRoute>
            <Background>
                <WeatherForecast />

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
