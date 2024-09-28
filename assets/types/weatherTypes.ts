export interface ForecastData {
    list: {
        dt_txt: string; // Date-time of the forecast
        main: {
            temp: number; // Temperature
        };
        weather: {
            description: string; // Weather description
        }[];
    }[];
}
