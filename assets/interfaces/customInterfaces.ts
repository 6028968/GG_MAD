export interface ValidationErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export interface User {
    username: string;
    email: string;
    password: string;
    role: string;
    aangemaakt: string;
}

export interface AdminOnlyProps {
    children: React.ReactNode;
}

export interface AuthContextProps {
    isAuthenticated: boolean;
    login: (username: string, password: string) => void;
    logout: () => void;
    errorMessage: string;
    clearError: () => void;
}

export interface LiveWeather {
    plaats: string;
    temp: string;
    samenv: string;
}

export interface WeatherForecast {
    dag: string;
    verwachting: string;
    image: string; 
    max_temp?: number; 
    min_temp?: number; 
    avg_temp?: string;
}

export interface WeatherResponse {
    liveweer?: LiveWeather[]; 
    wk_verw?: WeatherForecast[]; 
}


// Kas data interfaces
export interface Pomp {
    pompID: number;
    actief: boolean;
    foutmelding: number | null;
    uptime: number;
    waterverbruikPerDagInLiters: number;
    pompAanzetten: boolean;
}

export interface Sensor {
    sensorID: number;
    actief: boolean;
    deviceNaam: string;
    foutmelding: number | null;
    uptime: number;
    locatie: string;
    grondvochtigheid: number;
    dataOntvangen: string;
}

export interface Foutmelding {
    apparaatSoort: string;
    apparaat: string;
    melding: string;
    apparaatID: number;
    tijdstip: string;
    foutcode: number;
}

export interface Logboek {
    foutmeldingen: Foutmelding[];
}

export interface KasResponse {
    pompen: {
        pompLinks: Pomp;
        pompRechts: Pomp;
    };
    sensoren: Record<string, Sensor>;
    logboek: Logboek;
}
