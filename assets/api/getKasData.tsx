import { Foutmelding, KasResponse, Pomp, Sensor } from "../interfaces/customInterfaces";


export const getKasData = async (): Promise<KasResponse | null> => 
    {
        try 
        {
            const url = `http://localhost:3000/fetch-data`;

            console.log(`Fetching data uit URL: ${url}`);
    
            const response = await fetch(url, {
                method: "GET",
                mode: "no-cors",
            })
            if (!response.ok) 
            {
                throw new Error(`Network response was not ok: ${response.status}, ${response.statusText}`);
            }
    
            const data: KasResponse = await response.json();

            console.log(`Data succesvol gefetched: ${data}`)

            return data;
        } 
        catch (error) 
        {
            console.error("Error fetching kas data:", error);
            return null;
        }
    };
    

    export const processKasData = async (): Promise<{
        actievePompen: Pomp[];
        actieveSensoren: Sensor[];
        logboekFouten: Foutmelding[];
    } | { error: string }> => {
        const kasData = await getKasData();
        
        if (!kasData) {
            return { error: "Kon kasdata niet ophalen" };
        }
        
        const actievePompen = Object.values(kasData.pompen).filter((pomp) => pomp.actief);
        const actieveSensoren = Object.values(kasData.sensoren).filter((sensor) => sensor.actief);
        
        const logboekFouten = kasData.logboek.foutmeldingen;
        
        return {
            actievePompen,
            actieveSensoren,
            logboekFouten,
        };
    };
    
        
    
