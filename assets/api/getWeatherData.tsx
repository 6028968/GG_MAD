import { WEER_API_KEY } from "@env";

interface LiveWeather {
    plaats: string; // Location name
    temp: string; // Current temperature
    samenv: string; // Summary of current weather
    // Add more fields if available from the API response
}

interface WeatherForecast {
    dag: string; // Day of the week
    verwachting: string; // Expectation for the weather forecast
    temp?: string; // Temperature field for the forecast
    min_temp: number;
    max_temp: number;
}

interface WeatherResponse {
    liveweer?: LiveWeather[]; // Array of live weather data
    wk_verw?: WeatherForecast[]; // Array of weather forecast data
}

// Function to fetch the weather data from the Weerlive API
export const getWeatherData = async (): Promise<WeatherResponse | null> => 
{
    try 
    {
        const location = "Leiden";
        const url = `https://weerlive.nl/api/weerlive_api_v2.php?key=${WEER_API_KEY}&locatie=${location}`;

        console.log("Fetching weather data from URL:", url); // Log URL for debugging

        const response = await fetch(url);
        
        if (!response.ok) 
        {
            throw new Error(`Network response was not ok: ${response.status}, ${response.statusText}`);
        }

        const data: WeatherResponse = await response.json();
        console.log("Weather data fetched successfully:", data); // Log data for debugging

        return data; // Return the fetched weather data
    } 
    catch (error) 
    {
        console.error("Error fetching weather data:", error); // Log error if request fails
        return null; // Return null if there's an error
    }
};

// Function to process the fetched weather data
export const getProcessedWeatherData = async (): Promise<any> => 
    {
        const weatherResponse = await getWeatherData(); // Get the raw weather data
        console.log("Full Weather Response:", weatherResponse); // Log the complete response for debugging
        
        if (!weatherResponse || "error" in weatherResponse) 
        {
            return { error: "Kon weerdata niet ophalen" }; // Return an error if the response is invalid
        }
    
        // Extract live weather information
        const liveWeather: LiveWeather = weatherResponse.liveweer ? weatherResponse.liveweer[0] : {} as LiveWeather;
    
        // Transform forecast data to add max, min, and avg temperatures
        const weatherForecast: WeatherForecast[] = weatherResponse.wk_verw
            ? weatherResponse.wk_verw.map((item) => ({
                  ...item,
                  max_temp: item.max_temp, // Maximum temperature for the day
                  min_temp: item.min_temp, // Minimum temperature for the day
                  avg_temp: item.max_temp && item.min_temp ? ((item.max_temp + item.min_temp) / 2).toFixed(1) : undefined // Calculate average temperature
              }))
            : [];
        
        return {
            live_weather: liveWeather, // Processed live weather data
            weather_forecast: weatherForecast, // Processed forecast data
            day_forecast: weatherForecast // Assuming day_forecast is the same as weather_forecast
        };
    };
    
