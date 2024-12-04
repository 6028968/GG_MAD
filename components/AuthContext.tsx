import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import bcrypt from "bcryptjs";
import { AuthContextProps, User } from "@/assets/interfaces/customInterfaces";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const initializeUsers = async () => {
            const formatDate = (date: Date): string => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            };
    
            const adminData: User = {
                username: "admin",
                email: "admin@admin.nl",
                password: bcrypt.hashSync("admin", 10),
                role: "admin",
                aangemaakt: formatDate(new Date()),
            };
    
            const testUserData: User = {
                username: "test",
                email: "test@test.nl",
                password: bcrypt.hashSync("test", 10),
                role: "user",
                aangemaakt: formatDate(new Date()),
            };
    
            const storedUsers = await AsyncStorage.getItem("users");
            let users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    
            const adminExists = users.some((user) => user.username === "admin");
            if (!adminExists) {
                users.push(adminData);
            }
    
            const testUserExists = users.some((user) => user.username === "test");
            if (!testUserExists) {
                users.push(testUserData);
            }
    
            await AsyncStorage.setItem("users", JSON.stringify(users));
        };
    
        initializeUsers();
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
                await AsyncStorage.setItem("8JUhZ1hcFU1xFzYwf8CeWeNzYpf5ArUb", JSON.stringify(auth));
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
        await AsyncStorage.removeItem("8JUhZ1hcFU1xFzYwf8CeWeNzYpf5ArUb");
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
