import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./AuthContext";
import { GlobalStyles } from "@/constants/GlobalStyles";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isReady && !isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated, isReady, router]);

    if (!isReady) {
        return (
            <View style={GlobalStyles.layoutContainer}>
                <Text style={GlobalStyles.layoutMessage}>Loading...</Text>
            </View>
        );
    }

    if (!isAuthenticated) {
        return (
            <View style={GlobalStyles.layoutContainer}>
                <Text style={GlobalStyles.layoutMessage}>Je moet ingelogd zijn om deze inhoud te bekijken.</Text>
                {/* <Button title="Login" onPress={() => router.push("/login")} /> */}
            </View>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
