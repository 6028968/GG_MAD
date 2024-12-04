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