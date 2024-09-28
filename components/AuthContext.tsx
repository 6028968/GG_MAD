import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { Platform } from "react-native";

interface AuthContextProps {
    isAuthenticated: boolean;
    login: (username: string, password: string) => void;
    logout: () => void;
    errorMessage: string;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            if (Platform.OS !== "web") {
                const storedAuth = await SecureStore.getItemAsync("MySecureAuthStateKey");
                if (storedAuth) {
                    setIsAuthenticated(true);
                    router.push("/home");
                }
            }
        };
        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        const hardcodedUsername = "admin";
        const hardcodedPassword = "admin";

        if (username === hardcodedUsername && password === hardcodedPassword) {
            const auth = { username, password };
            const storageValue = JSON.stringify(auth);

            if (Platform.OS !== "web") {
                await SecureStore.setItemAsync("MySecureAuthStateKey", storageValue);
            }
            setIsAuthenticated(true);
            setErrorMessage("");
            router.push("/home");
        } else {
            setErrorMessage("Ongeldige gebruikersnaam of wachtwoord.");
        }
    };

    const logout = async () => {
        if (Platform.OS !== "web") {
            await SecureStore.deleteItemAsync("MySecureAuthStateKey");
        }
        setIsAuthenticated(false);
        router.push("/");
    };

    const clearError = () => {
        setErrorMessage("");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, errorMessage, clearError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
