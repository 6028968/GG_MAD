import AsyncStorage from "@react-native-async-storage/async-storage";
import { Plant } from "@/assets/types/plantTypes";

export const loadPlants = async (): Promise<Plant[]> => 
{
    try 
    {
        const savedPlants = await AsyncStorage.getItem("plants");
        return savedPlants ? JSON.parse(savedPlants) : [];
    } 
    catch (error) 
    {
        console.error("Failed to load plants:", error);
        return [];
    }
};

export const savePlants = async (plants: Plant[]): Promise<void> => 
{
    try 
    {
        await AsyncStorage.setItem("plants", JSON.stringify(plants));
    } 
    catch (error) 
    {
        console.error("Failed to save plants:", error);
    }
};

export const addPlant = async (newPlant: Plant): Promise<Plant[]> => 
{
    try 
    {
        const existingPlants = await loadPlants();
        const updatedPlants = [...existingPlants, newPlant];
        await savePlants(updatedPlants);
        return updatedPlants;
    } 
    catch (error) 
    {
        console.error("Failed to add plant:", error);
        return [];
    }
};

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
];

export const initializePlants = async (): Promise<void> => 
{
    try 
    {
        const existingPlants = await loadPlants();
        if (existingPlants.length === 0) 
        {
            await savePlants(defaultPlants);
            console.log("Default plants initialized");
        }
    } 
    catch (error) 
    {
        console.error("Failed to initialize plants:", error);
    }
};
