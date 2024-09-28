import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import cars from '../../assets/data/cars.json';
import { GlobalStyles } from "@/constants/GlobalStyles";
import useFonts from '../../hooks/useFonts';
import ProtectedRoute from '../../components/ProtectedRoute';

const CarDetailScreen: React.FC = () => {
    const { id } = useLocalSearchParams();
    const car = cars.find(c => c.id === parseInt(id as string, 10));
    const navigation = useNavigation();
    const fontsLoaded = useFonts();

    useEffect(() => {
        if (car) {
            navigation.setOptions({
                title: `${car.merk} ${car.model}`,
            });
        } else {
            console.log('Car not found with ID:', id);
        }
    }, [car, navigation]);

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" />;
    }

    if (!car) {
        return (
            <View>
                <Text>Car not found.</Text>
            </View>
        );
    }

    return (
        <ProtectedRoute>
            <View>
                <Text>{car.merk} {car.model}</Text>
                <Image source={{ uri: car.image }}/>
                <Text>Bouwjaar: {car.bouwjaar}</Text>
                <Text>{car.beschrijving}</Text>
            </View>
        </ProtectedRoute>
    );
};

export default CarDetailScreen;
