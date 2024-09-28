import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../components/AuthContext";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { HeaderStyles } from "@/constants/GlobalStyles";

export default function Layout() 
{
    const router = useRouter();

    return (
        <AuthProvider>
            <View style={GlobalStyles.container}>
                <Stack
                    screenOptions={{
                        // headerTransparent: true,
                        headerStyle:
                        {
                            backgroundColor: "white",
                        },
                        headerLeft: () => <HomeButton onPress={() => router.push("/home")} />, 
                        headerRight: () => <LogoutButton />, 
                        headerTitle: () => <Logo />,
                        headerTitleAlign: 'center',
                    }}
                >
                    <Stack.Screen
                        name="index"
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="home"
                        options={{
                            headerShown: true,
                        }}
                    />
                </Stack>
            </View>
        </AuthProvider>
    );
}

type HomeButtonProps = {
    onPress: () => void;
};

const HomeButton: React.FC<HomeButtonProps> = ({ onPress }) => 
{
    return (
        <TouchableOpacity style={HeaderStyles.logoutButton} onPress={onPress}>
            <Text style={HeaderStyles.logoutButtonText}>Home</Text>
        </TouchableOpacity>
    );
};

const LogoutButton = () => 
{
    const { logout } = useAuth();

    return (
        <TouchableOpacity style={HeaderStyles.logoutButton} onPress={logout}>
            <Text style={HeaderStyles.logoutButtonText}>Loguit</Text>
        </TouchableOpacity>
    );
};

const Logo = () => 
{
    return (
        <Image
            source={require('../assets/images/logo.png')}
            style={{ width: 200, height: 70, resizeMode: "contain" }} 
        />
    );
};
