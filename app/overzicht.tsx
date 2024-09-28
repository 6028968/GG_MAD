import React from "react";
import { FlatList, Text, View, Image, TouchableOpacity } from "react-native";
import cars from "../assets/data/cars.json";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "expo-router";

type DataItem = {
    id: number;
    merk: string;
    model: string;
    bouwjaar: number;
    image: string;
    beschrijving: string;
};

const carData: DataItem[] = cars;

type ItemProps = {
    id: number;
    merk: string;
    model: string;
    bouwjaar: number;
    image: string;
    beschrijving: string;
};

const Item: React.FC<ItemProps> = ({ id, merk, model, bouwjaar, image, beschrijving }) =>
{
    const router = useRouter();
    return (
        <TouchableOpacity onPress={() => router.push(`/plant/${id}`)}>
            <View>
                <Image source={{ uri: image }}  />
                <View >
                    <Text >{merk} {model}</Text>
                </View>
                <Text >{bouwjaar}</Text>
            </View>
        </TouchableOpacity>
    );
};

const MyFlatList: React.FC = () =>
{
    return (
        <ProtectedRoute>
            <FlatList
                data={carData}
                renderItem={({ item }) => (
                    <Item
                        id={item.id}
                        merk={item.merk}
                        model={item.model}
                        bouwjaar={item.bouwjaar}
                        image={item.image}
                        beschrijving={item.beschrijving}
                    />
                )}
                keyExtractor={item => item.id.toString()}
            />
        </ProtectedRoute>
    );
};

export default MyFlatList;
