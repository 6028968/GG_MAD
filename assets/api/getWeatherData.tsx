// import { WEER_API_KEY } from "@env";

interface LiveWeather {
    plaats: string; 
    temp: string; 
    samenv: string;
}

interface WeatherForecast {
    dag: string; 
    verwachting: string; 
    temp?: string; 
    min_temp: number;
    max_temp: number;
}

interface WeatherResponse {
    liveweer?: LiveWeather[]; 
    wk_verw?: WeatherForecast[]; 
}

export const getWeatherData = async (): Promise<WeatherResponse | null> => 
{
    try 
    {
        const location = "Leiden";
        const url = `https://weerlive.nl/api/weerlive_api_v2.php?key=05ddd06644&locatie=${location}`;

        // console.log("Fetching weather data from URL:", url);

        const response = await fetch(url);
        
        if (!response.ok) 
        {
            throw new Error(`Network response was not ok: ${response.status}, ${response.statusText}`);
        }

        const data: WeatherResponse = await response.json();
        // console.log("Weather data fetched successfully:", data); 

        return data; 
    } 
    catch (error) 
    {
        console.error("Error fetching weather data:", error); 
        return null; 
    }
};

export const getProcessedWeatherData = async (): Promise<any> => 
    {
        const weatherResponse = await getWeatherData(); 
        // console.log("Full Weather Response:", weatherResponse); 
        
        if (!weatherResponse || "error" in weatherResponse) 
        {
            return { error: "Kon weerdata niet ophalen" }; 
        }
    
        const liveWeather: LiveWeather = weatherResponse.liveweer ? weatherResponse.liveweer[0] : {} as LiveWeather;
    
        const weatherForecast: WeatherForecast[] = weatherResponse.wk_verw
            ? weatherResponse.wk_verw.map((item) => ({
                  ...item,
                  max_temp: item.max_temp, 
                  min_temp: item.min_temp,
                  avg_temp: item.max_temp && item.min_temp ? ((item.max_temp + item.min_temp) / 2).toFixed(1) : undefined 
              }))
            : [];
        
        return {
            live_weather: liveWeather, 
            weather_forecast: weatherForecast, 
            day_forecast: weatherForecast 
        };
    };
    
