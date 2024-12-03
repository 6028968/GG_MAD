import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import bcrypt from "bcryptjs";

interface AuthContextProps {
    isAuthenticated: boolean;
    login: (username: string, password: string) => void;
    logout: () => void;
    errorMessage: string;
    clearError: () => void;
}

interface User {
    username: string;
    email: string;
    password: string;
    role: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const initializeAdmin = async () => {
            const adminData: User = {
                username: "admin",
                email: "admin@admin.nl",
                password: bcrypt.hashSync("admin", 10), 
                role: "admin", 
            };
    
            const storedUsers = await AsyncStorage.getItem("users");
            let users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    
            const adminExists = users.some((user) => user.username === "admin");
            if (!adminExists) {
                users.push(adminData);
                await AsyncStorage.setItem("users", JSON.stringify(users));
            }
        };
    
        initializeAdmin();
    }, []);    

    const login = async (username: string, password: string) => 
    {
        const storedUsers = await AsyncStorage.getItem("users");
        if (storedUsers) 
        {
            const users: User[] = JSON.parse(storedUsers);
            const user = users.find((u) => u.username === username);
    
            if (user && bcrypt.compareSync(password, user.password)) 
            {
                const auth = { user };
                await AsyncStorage.setItem("MySecureAuthStateKey", JSON.stringify(auth));
                setCurrentUser(user);
                setIsAuthenticated(true);
                setErrorMessage("");
                router.push("/home");
                return;
            }
        }
        setErrorMessage("Ongeldige gebruikersnaam of wachtwoord.");
    };        

    const logout = async () => {
        await AsyncStorage.removeItem("MySecureAuthStateKey");
        setIsAuthenticated(false);
        router.push("/");
    };

    const clearError = () => {
        setErrorMessage("");
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, login, logout, errorMessage, clearError }}
        >
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
