import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Image } from "react-native";
import { getProcessedWeatherData } from "../assets/api/getWeatherData"; // Adjust the path accordingly
import Colors from "@/constants/Colors";
import { homeStyles } from "@/constants/HomeStyles";

interface LiveWeather {
    plaats: string;
    temp: string;
    samenv: string;
}

interface WeatherForecast {
    dag: string;
    verwachting: string;
    image: string; 
    max_temp?: number; 
    min_temp?: number; 
    avg_temp?: string;
}

const getDayOfWeek = (dateString: string): string => 
{
    const daysOfWeek = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
    const dateParts = dateString.split("-");
    const date = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
    return daysOfWeek[date.getDay()];
};

const getImageSource = (condition: string) => 
{
    switch (condition.toLowerCase()) 
    {
        case "zonnig":
            return require("../assets/images/weer/zonnig.png");
        case "halfbewolkt":
            return require("../assets/images/weer/halfbewolkt.png");
        case "bewolkt":
            return require("../assets/images/weer/bewolkt.png");
        case "regen":
            return require("../assets/images/weer/regen.png");
        case "buien":
            return require("../assets/images/weer/regen.png");
        case "onweer":
            return require("../assets/images/weer/onweer.png");
        case "mist":
            return require("../assets/images/weer/mist.png");
        case "helderenacht":
            return require("../assets/images/weer/heldernacht.png");
        case "sneeuw":
            return require("../assets/images/weer/sneeuw.png");
        case "motregen":
            return require("../assets/images/weer/motregen.png");
        case "storm":
            return require("../assets/images/weer/storm.png");
        default:
            return require("../assets/images/weer/default.png");
    }
};

const WeatherForecast: React.FC = () => 
{
    const [weatherData, setWeatherData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => 
    {
        const fetchWeather = async () => 
        {
            setLoading(true); 
            setError(null); 

            const data = await getProcessedWeatherData();

            if (data && !data.error) 
            {
                setWeatherData(data); 
            } 
            else 
            {
                setError("Kon geen weersvoorspelling ophalen");
            }

            setLoading(false); 
        };

        fetchWeather();
    }, []);

    if (loading) 
    {
        return (
            <View style={homeStyles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={homeStyles.text}>Weergegevens worden opgehaald...</Text>
            </View>
        );
    }

    if (error) 
    {
        return (
            <View style={homeStyles.container}>
                <Text style={homeStyles.text}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={homeStyles.container}>
            {weatherData ? (
                <>
                    <FlatList
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={homeStyles.weerContainer} 
                        data={weatherData.weather_forecast}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={homeStyles.item}>
                                <Text style={homeStyles.dayText}>{getDayOfWeek(item.dag)}</Text>
                                <Image
                                    source={getImageSource(item.image)}
                                    style={homeStyles.weatherIcon}
                                />
                                <View style={homeStyles.tempContainer}>
                                    <Text style={homeStyles.dagen}>
                                        {item.avg_temp ?? "N/A"}°C
                                    </Text>
                                </View>
                            </View>
                        )}
                    />
                </>
            ) : (
                <Text style={homeStyles.text}>Kon geen weergegevens ophalen</Text>
            )}
        </View>
    );
};

// const styles = StyleSheet.create({
//     container: 
//     {
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     weerContainer:
//     {
//         paddingVertical: 10, 
//     },
//     item: 
//     {
//         flexDirection: "column",
//         alignItems: "center",
//         marginHorizontal: 10, 
//         backgroundColor: "rgba(255, 255, 255, 0.75)",
//         paddingTop: 5,
//         borderRadius: 5,
//         elevation: 2, 
//     },
//     weatherIcon:
//     {
//         width: 50,
//         height: 50,
//         marginBottom: 5,
//     },
//     text: 
//     {
//         fontSize: 18,
//         textAlign: "left",
//     },
//     tempContainer:
//     {
//         backgroundColor: Colors.light.primary,
//         borderBottomRightRadius: 2,
//         borderBottomLeftRadius: 2,
//         padding: 5,
//     },
//     dagen:
//     {
//         fontSize: 16,
//         fontWeight: "bold",
//         color: "white",
//     },
//     dayText:
//     {
//         fontSize: 18,
//         marginBottom: 5,
//         color: "grey",
//         fontWeight: "bold",
//     }
// });

export default WeatherForecast;
