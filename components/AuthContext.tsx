import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import bcrypt from "bcryptjs";
import { AuthContextProps, User } from "@/assets/interfaces/customInterfaces";
import { Plant } from "@/assets/types/plantTypes";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const initializeUsersAndPlants = async () => 
            {
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
    
                const defaultPlants: Plant[] = [
                    {
                        id: 1,
                        naam: "Tomaat",
                        soort: "Groente",
                        aanwezig: true,
                        wetenschappelijkeNaam: "Solanum lycopersicum",
                        dagenInKas: 5,
                        totaalGeplant: 10,
                        mislukteOogst: 1,
                        succesvolleOogst: 9,
                        zonlicht: "Volle zon",
                        irrigatieFrequentie: "Dagelijks",
                        laatsteIrrigratie: "Vandaag",
                        aankomendeIrrigratie: "Morgen",
                        laatsteBemesting: "3 dagen geleden",
                        aankomendeBemesting: "Over 2 dagen",
                        meestSuccesvolleMaand: "Juni",
                        meestSuccesvolleSeizoen: "Zomer",
                        kant: "links",
                    },
                    {
                        id: 2,
                        naam: "Aardbei",
                        soort: "Fruit",
                        aanwezig: true,
                        wetenschappelijkeNaam: "Fragaria × ananassa",
                        dagenInKas: 15,
                        totaalGeplant: 20,
                        mislukteOogst: 2,
                        succesvolleOogst: 18,
                        zonlicht: "Volle zon",
                        irrigatieFrequentie: "Om de dag",
                        laatsteIrrigratie: "Gisteren",
                        aankomendeIrrigratie: "Morgen",
                        laatsteBemesting: "5 dagen geleden",
                        aankomendeBemesting: "Over 3 dagen",
                        meestSuccesvolleMaand: "Mei",
                        meestSuccesvolleSeizoen: "Lente",
                        kant: "rechts",
                    },
                    {
                        id: 3,
                        naam: "Champignon",
                        soort: "Schimmel",
                        aanwezig: true,
                        wetenschappelijkeNaam: "Agaricus bisporus",
                        dagenInKas: 20,
                        totaalGeplant: 30,
                        mislukteOogst: 5,
                        succesvolleOogst: 25,
                        zonlicht: "Geen",
                        irrigatieFrequentie: "Om de 3 dagen",
                        laatsteIrrigratie: "2 dagen geleden",
                        aankomendeIrrigratie: "Morgen",
                        laatsteBemesting: "Niet nodig",
                        aankomendeBemesting: "Niet nodig",
                        meestSuccesvolleMaand: "Oktober",
                        meestSuccesvolleSeizoen: "Herfst",
                        kant: "rechts",
                    },
                    {
                        id: 4,
                        naam: "Komkommer",
                        soort: "Groente",
                        aanwezig: true,
                        wetenschappelijkeNaam: "Cucumis sativus",
                        dagenInKas: 10,
                        totaalGeplant: 12,
                        mislukteOogst: 2,
                        succesvolleOogst: 10,
                        zonlicht: "Volle zon",
                        irrigatieFrequentie: "Om de dag",
                        laatsteIrrigratie: "Gisteren",
                        aankomendeIrrigratie: "Morgen",
                        laatsteBemesting: "5 dagen geleden",
                        aankomendeBemesting: "Volgende week",
                        meestSuccesvolleMaand: "Juli",
                        meestSuccesvolleSeizoen: "Zomer",
                        kant: "rechts",
                    },
                    {
                        id: 5,
                        naam: "Courgette",
                        soort: "Groente",
                        aanwezig: true,
                        wetenschappelijkeNaam: "Cucurbita pepo",
                        dagenInKas: 12,
                        totaalGeplant: 14,
                        mislukteOogst: 1,
                        succesvolleOogst: 13,
                        zonlicht: "Volle zon",
                        irrigatieFrequentie: "Om de dag",
                        laatsteIrrigratie: "Vandaag",
                        aankomendeIrrigratie: "Morgen",
                        laatsteBemesting: "3 dagen geleden",
                        aankomendeBemesting: "Over 2 dagen",
                        meestSuccesvolleMaand: "Juli",
                        meestSuccesvolleSeizoen: "Zomer",
                        kant: "rechts",
                    },
                    {
                        id: 6,
                        naam: "Meloen",
                        soort: "Fruit",
                        aanwezig: true,
                        wetenschappelijkeNaam: "Cucumis melo",
                        dagenInKas: 18,
                        totaalGeplant: 8,
                        mislukteOogst: 0,
                        succesvolleOogst: 8,
                        zonlicht: "Volle zon",
                        irrigatieFrequentie: "Dagelijks",
                        laatsteIrrigratie: "Vandaag",
                        aankomendeIrrigratie: "Morgen",
                        laatsteBemesting: "2 dagen geleden",
                        aankomendeBemesting: "Over 3 dagen",
                        meestSuccesvolleMaand: "Augustus",
                        meestSuccesvolleSeizoen: "Zomer",
                        kant: "rechts",
                    },
                    {
                        id: 7,
                        naam: "Paprika",
                        soort: "Groente",
                        aanwezig: true,
                        wetenschappelijkeNaam: "Capsicum annuum",
                        dagenInKas: 14,
                        totaalGeplant: 12,
                        mislukteOogst: 1,
                        succesvolleOogst: 11,
                        zonlicht: "Volle zon",
                        irrigatieFrequentie: "Dagelijks",
                        laatsteIrrigratie: "Vandaag",
                        aankomendeIrrigratie: "Morgen",
                        laatsteBemesting: "1 dag geleden",
                        aankomendeBemesting: "Over 2 dagen",
                        meestSuccesvolleMaand: "Juli",
                        meestSuccesvolleSeizoen: "Zomer",
                        kant: "rechts",
                    },
                    {
                        id: 8,
                        naam: "Spinazie",
                        soort: "Groente",
                        aanwezig: true,
                        wetenschappelijkeNaam: "Spinacia oleracea",
                        dagenInKas: 6,
                        totaalGeplant: 20,
                        mislukteOogst: 2,
                        succesvolleOogst: 18,
                        zonlicht: "Halfzon",
                        irrigatieFrequentie: "Om de dag",
                        laatsteIrrigratie: "Vandaag",
                        aankomendeIrrigratie: "Morgen",
                        laatsteBemesting: "3 dagen geleden",
                        aankomendeBemesting: "Over 2 dagen",
                        meestSuccesvolleMaand: "Maart",
                        meestSuccesvolleSeizoen: "Lente",
                        kant: "rechts",
                    },
                    {
                        id: 9,
                        naam: "Peterselie",
                        soort: "Kruiden",
                        aanwezig: true,
                        wetenschappelijkeNaam: "Petroselinum crispum",
                        dagenInKas: 14,
                        totaalGeplant: 25,
                        mislukteOogst: 1,
                        succesvolleOogst: 24,
                        zonlicht: "Halfzon",
                        irrigatieFrequentie: "Om de dag",
                        laatsteIrrigratie: "Gisteren",
                        aankomendeIrrigratie: "Morgen",
                        laatsteBemesting: "2 dagen geleden",
                        aankomendeBemesting: "Over 3 dagen",
                        meestSuccesvolleMaand: "April",
                        meestSuccesvolleSeizoen: "Lente",
                        kant: "links",
                    },
                    {
                        id: 10,
                        naam: "Brandnetel",
                        soort: "Overig",
                        aanwezig: false,
                        wetenschappelijkeNaam: "Urtica dioica",
                        dagenInKas: 0,
                        totaalGeplant: 20,
                        mislukteOogst: 2,
                        succesvolleOogst: 18,
                        zonlicht: "Halfzon",
                        irrigatieFrequentie: "Om de dag",
                        laatsteIrrigratie: "n.v.t.",
                        aankomendeIrrigratie: "n.v.t.",
                        laatsteBemesting: "n.v.t.",
                        aankomendeBemesting: "n.v.t.",
                        meestSuccesvolleMaand: "Maart",
                        meestSuccesvolleSeizoen: "Lente",
                        kant: "links",
                    },
                    {
                        id: 11,
                        naam: "Lavendel",
                        soort: "Kruiden",
                        aanwezig: true,
                        wetenschappelijkeNaam: "Lavandula angustifolia",
                        dagenInKas: 20,
                        totaalGeplant: 18,
                        mislukteOogst: 2,
                        succesvolleOogst: 16,
                        zonlicht: "Volle zon",
                        irrigatieFrequentie: "Wekelijks",
                        laatsteIrrigratie: "4 dagen geleden",
                        aankomendeIrrigratie: "Over 3 dagen",
                        laatsteBemesting: "2 weken geleden",
                        aankomendeBemesting: "Over 1 week",
                        meestSuccesvolleMaand: "Juli",
                        meestSuccesvolleSeizoen: "Zomer",
                        kant: "rechts",
                    },                    
                ];                
    
                const storedPlants = await AsyncStorage.getItem("plants");
                const plants: Plant[] = storedPlants ? JSON.parse(storedPlants) : [];
    
                if (plants.length === 0) {
                    await AsyncStorage.setItem("plants", JSON.stringify(defaultPlants));
                    console.log("Default plants initialized");
                }
            };
    
            initializeUsersAndPlants();
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
