import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { homeStyles } from "@/constants/HomeStyles"
import Background from "@/components/Background"; 
import ExpandableMenu from "../components/MenuDownUnder"; 
import { useFonts } from "expo-font";
import { plantenStyles } from "@/constants/PlantenStyles"
import { Foutmelding, Wijziging, Bijzonderheid, Sensordata, Plantdata } from "@/assets/interfaces/customInterfaces";
import { plantStyles } from "@/constants/PlantStyles";
import { sensorStyles } from "@/constants/SensorStyles";
import { ScrollView } from "react-native-gesture-handler";
import { dataStyles } from "@/constants/DataStyles";
import ProtectedRoute from "@/components/ProtectedRoute";

const Data: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [foutmeldingen, setFoutmelding] = useState<Foutmelding[]>([]);
    const [wijzingen, setWijziging] = useState<Wijziging[]>([]);
    const [bijzonderheden, setBijzonderheden] = useState<Bijzonderheid[]>([])

    const [sensordata, setSensordata] = useState<Sensordata[]>([])
    const [plantdata, setPlantdata] = useState<Plantdata[]>([])

    const [isFoutmeldingenOpen, setIsFoutmeldingenOpen] = useState(false);
    const [isWijzigingenOpen, setIsWijzigingenOpen] = useState(false);
    const [isBijzonderheidOpen, setIsBijzonderheidOpen] = useState(false);

    const [isSensordataOpen, setIsSensordataOpen] = useState(false);
    const [isPlantdataOpen, setIsPlantdataOpen] = useState(false);

    const [fontsLoaded] = useFonts({
        "Afacad": require("../assets/fonts/Afacad-Regular.ttf"),
        "Akaya": require("../assets/fonts/AkayaKanadaka-Regular.ttf"),
    });

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const storedAuth = await AsyncStorage.getItem("8JUhZ1hcFU1xFzYwf8CeWeNzYpf5ArUb");
                if (storedAuth) {
                    const { user } = JSON.parse(storedAuth);
                    if (user.role === "admin") {
                        setIsAdmin(true);
                    }
                }
            } catch (error) {
                console.error("Fout bij het ophalen van de gebruikersrol:", error);
            }
        };

        const fetchFoutmeldingData = async () => 
            {
                try 
                {
                    const response = await fetch("http://localhost:3000/fetch-data");
                    if (!response.ok) 
                    {
                        throw new Error(`Fout bij het ophalen van de foutmeldingen: ${response.statusText}`);
                    }
                    const data = await response.json();
                    console.log("Ophalen JSON data:", data); 
                    setFoutmelding(data.logboek.foutmeldingen); 
                } 
                catch (error) 
                {
                    console.error("Fout bij het ophalen van foutmeldinggegevens:", error);
                    setError("Kan foutmeldingen niet ophalen.");
                } 
                finally 
                {
                    setLoading(false);
                }
            };         
            
            const fetchWijzingenData = async () => {
                try {
                    const response = await fetch("http://localhost:3000/fetch-data");
                    if (!response.ok) {
                        throw new Error(`Fout bij het ophalen van wijzigingen: ${response.statusText}`);
                    }
                    const data = await response.json();
                    setWijziging(data.logboek.wijzigingen);
                } 
                catch (error) {
                    console.error("Fout bij het ophalen van wijziginggegevens:", error);
                    setError("Kan wijzigingen niet ophalen.");
                } 
                finally {
                    setLoading(false);
                }
            };                       

            const fetchBijzonderheidData = async () => {
                try {
                    const response = await fetch("http://localhost:3000/fetch-data");
                    if (!response.ok) {
                        throw new Error(`Fout bij het ophalen van bijzonderheden: ${response.statusText}`);
                    }
                    const data = await response.json();
                    setBijzonderheden(data.logboek.bijzonderheden);
                } 
                catch (error) {
                    console.error("Fout bij het ophalen van bijzinderheden:", error);
                    setError("Kan bijzonderheden niet ophalen.");
                } 
                finally {
                    setLoading(false);
                }
            };   

            const fetchSensordata = async () => {
                try {
                    const response = await fetch("http://localhost:3000/fetch-data");
                    if (!response.ok) {
                        throw new Error(`Fout bij het ophalen van sensordata: ${response.statusText}`);
                    }
                    const data = await response.json();
                    setSensordata(data.overzicht.sensordata);
                } 
                catch (error) {
                    console.error("Fout bij het ophalen van bijzinderheden:", error);
                    setError("Kan sensordata niet ophalen.");
                } 
                finally {
                    setLoading(false);
                }
            };   

            const fetchPlantdata = async () => {
                try {
                    const response = await fetch("http://localhost:3000/fetch-data");
                    if (!response.ok) {
                        throw new Error(`Fout bij het ophalen van plantdata: ${response.statusText}`);
                    }
                    const data = await response.json();
                    setPlantdata(data.overzicht.plantdata);
                } 
                catch (error) {
                    console.error("Fout bij het ophalen van bijzinderheden:", error);
                    setError("Kan plantdata niet ophalen.");
                } 
                finally {
                    setLoading(false);
                }
            };   

            fetchUserRole();
            fetchFoutmeldingData();
            fetchWijzingenData();
            fetchBijzonderheidData();
            fetchSensordata();
            fetchPlantdata();
    }, []);
    
    const [foutmeldingenScrollPosition, setFoutmeldingenScrollPosition] = useState(0);
    const [wijzigingenScrollPosition, setWijzigingenScrollPosition] = useState(0);
    const [bijzonderhedenScrollPosition, setBijzonderhedenScrollPosition] = useState(0);

    const [sensordataScrollPosition, setSensordataScrollPosition] = useState(0);
    const [plantdataScrollPosition, setPlantdataScrollPosition] = useState(0);

    const handleFoutmeldingenScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const viewHeight = event.nativeEvent.layoutMeasurement.height;

        const totalScrollableHeight = contentHeight - viewHeight;
        const position = (offsetY / totalScrollableHeight) * (viewHeight - 50);
        setFoutmeldingenScrollPosition(Math.max(0, position));
    };

    const handleWijzigingenScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const viewHeight = event.nativeEvent.layoutMeasurement.height;

        const totalScrollableHeight = contentHeight - viewHeight;
        const position = (offsetY / totalScrollableHeight) * (viewHeight - 50);
        setWijzigingenScrollPosition(Math.max(0, position));
    };

    const handleBijzonderhedenScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const viewHeight = event.nativeEvent.layoutMeasurement.height;

        const totalScrollableHeight = contentHeight - viewHeight;
        const position = (offsetY / totalScrollableHeight) * (viewHeight - 50);
        setBijzonderhedenScrollPosition(Math.max(0, position));
    };

    const handleSensordataScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const viewHeight = event.nativeEvent.layoutMeasurement.height;

        const totalScrollableHeight = contentHeight - viewHeight;
        const position = (offsetY / totalScrollableHeight) * (viewHeight - 50);
        setSensordataScrollPosition(Math.max(0, position));
    };

    const handlePlantdataScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const viewHeight = event.nativeEvent.layoutMeasurement.height;

        const totalScrollableHeight = contentHeight - viewHeight;
        const position = (offsetY / totalScrollableHeight) * (viewHeight - 50);
        setPlantdataScrollPosition(Math.max(0, position));
    };

    return (
        <ProtectedRoute>
            <Background>
                <ScrollView style={sensorStyles.mainContainer}>
                    <View style={[homeStyles.infoSectionContainer, plantStyles.articlesParent, dataStyles.uitklapbaarMenu]}>
                        <Text style={[plantenStyles.title, { margin: 0 }]}>Logboek</Text>
                        {/* FOUTMELDINGEN */}
                        <TouchableOpacity
                            style={[dataStyles.subTitleMenu, isFoutmeldingenOpen ? { borderTopLeftRadius: 10, borderTopRightRadius: 10, } : { borderRadius: 10 }]}
                            onPress={() => setIsFoutmeldingenOpen(!isFoutmeldingenOpen)}
                        >
                            <Text style={dataStyles.uitklapMenuTitle}>Foutmeldingen</Text>
                            <View style={isFoutmeldingenOpen ? dataStyles.triangleDown : dataStyles.triangleUp} />
                        </TouchableOpacity>
                        {isFoutmeldingenOpen && (
                        <View style={dataStyles.parentFlatlistContainer}>
                            <FlatList
                                data={foutmeldingen}
                                style={dataStyles.binnenContainerFlatlist}
                                showsVerticalScrollIndicator={false}
                                onScroll={handleFoutmeldingenScroll}
                                scrollEventThrottle={16}
                                keyExtractor={(item) => item.foutmeldingID.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={dataStyles.binnenContainerParent}>
                                        <View
                                            style={[
                                                dataStyles.binnenContainer,
                                                index === foutmeldingen.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 },
                                            ]}
                                        >
                                            <Text style={[dataStyles.innerTitle, { fontFamily: "Afacad" }]}>{item.melding}</Text>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Apparaat ID:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.apparaatID}</Text>
                                            </View>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Tijdstip:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.tijdstip}</Text>
                                            </View>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Foutcode:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.foutcode}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                                ListEmptyComponent={
                                    <View style={{ padding: 20 }}>
                                        <Text style={{ textAlign: "center" }}>Geen foutmeldingen gevonden.</Text>
                                    </View>
                                }
                            />
                            <View style={dataStyles.scrollbarTrack}>
                                <View style={[dataStyles.scrollbarThumb, { top: foutmeldingenScrollPosition }]} />
                            </View>
                        </View>
                        )}
                    {/* WIJZIGINGEN */}
                    <TouchableOpacity
                        style={[dataStyles.subTitleMenu, isWijzigingenOpen ? { borderTopLeftRadius: 10, borderTopRightRadius: 10, } : { borderRadius: 10 }]}
                        onPress={() => setIsWijzigingenOpen(!isWijzigingenOpen)}
                    >
                        <Text style={dataStyles.uitklapMenuTitle}>Wijzigingen</Text>
                        <View style={isWijzigingenOpen ? dataStyles.triangleDown : dataStyles.triangleUp} />
                    </TouchableOpacity>
                        {isWijzigingenOpen && (
                        <View style={dataStyles.parentFlatlistContainer}>
                            <FlatList
                                data={wijzingen}
                                style={dataStyles.binnenContainerFlatlist}
                                onScroll={handleWijzigingenScroll}
                                showsVerticalScrollIndicator={false}
                                scrollEventThrottle={16}
                                keyExtractor={(item) => item.wijzigingID.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={dataStyles.binnenContainerParent}>
                                        <View
                                            style={[
                                                dataStyles.binnenContainer,
                                                index === wijzingen.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 },
                                            ]}
                                        >
                                            <Text style={[dataStyles.innerTitle, { fontFamily: "Afacad" }]}>{item.wijziging}</Text>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Naam:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.apparaat}</Text>
                                            </View>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Apparaat ID:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.apparaatID}</Text>
                                            </View>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Tijdstip:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.tijdstip}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                                ListEmptyComponent={
                                    <View style={{ padding: 20 }}>
                                        <Text style={{ textAlign: "center" }}>Geen wijzigingen gevonden.</Text>
                                    </View>
                                }
                            />
                            <View style={dataStyles.scrollbarTrack}>
                                <View style={[dataStyles.scrollbarThumb, { top: wijzigingenScrollPosition }]} />
                            </View>
                        </View>
                        )}
                    {/* Bijzonderheden */}
                    <TouchableOpacity
                        style={[dataStyles.subTitleMenu, isBijzonderheidOpen ? { borderTopLeftRadius: 10, borderTopRightRadius: 10, } : { borderRadius: 10 }]}
                        onPress={() => setIsBijzonderheidOpen(!isBijzonderheidOpen)}
                    >
                        <Text style={dataStyles.uitklapMenuTitle}>Bijzonderheden</Text>
                        <View style={isBijzonderheidOpen ? dataStyles.triangleDown : dataStyles.triangleUp} />
                    </TouchableOpacity>
                        {isBijzonderheidOpen && (
                        <View style={dataStyles.parentFlatlistContainer}>
                            <FlatList
                                data={bijzonderheden}
                                style={dataStyles.binnenContainerFlatlist}
                                onScroll={handleBijzonderhedenScroll}
                                showsVerticalScrollIndicator={false}
                                scrollEventThrottle={16}
                                keyExtractor={(item) => item.bijzonderheidID.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={dataStyles.binnenContainerParent}>
                                        <View
                                            style={[
                                                dataStyles.binnenContainer,
                                                index === bijzonderheden.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 },
                                            ]}
                                        >
                                            <Text style={[dataStyles.innerTitle, { fontFamily: "Afacad" }]}>{item.bijzonderheid}</Text>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Naam:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.apparaat}</Text>
                                            </View>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Apparaat ID:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.apparaatID}</Text>
                                            </View>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Tijdstip:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.tijdstip}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                                ListEmptyComponent={
                                    <View style={{ padding: 20 }}>
                                        <Text style={{ textAlign: "center" }}>Geen wijzigingen gevonden.</Text>
                                    </View>
                                }
                            />
                            <View style={dataStyles.scrollbarTrack}>
                                <View style={[dataStyles.scrollbarThumb, { top: bijzonderhedenScrollPosition }]} />
                            </View>
                        </View>
                        )}                    
                    </View>
                    {/* ===============OVERZICHT================ */}
                    <View style={[homeStyles.infoSectionContainer, plantStyles.articlesParent, dataStyles.uitklapbaarMenu, { marginTop: 0 }]}>
                        <Text style={[plantenStyles.title, { margin: 0 }]}>Data Overzicht</Text>
                        {/* SENSORDATA */}
                        <TouchableOpacity
                            style={[dataStyles.subTitleMenu, isSensordataOpen ? { borderTopLeftRadius: 10, borderTopRightRadius: 10, } : { borderRadius: 10 }]}
                            onPress={() => setIsSensordataOpen(!isSensordataOpen)}
                        >
                            <Text style={dataStyles.uitklapMenuTitle}>Sensordata</Text>
                            <View style={isSensordataOpen ? dataStyles.triangleDown : dataStyles.triangleUp} />
                        </TouchableOpacity>
                        {isSensordataOpen && (
                        <View style={dataStyles.parentFlatlistContainer}>
                            <FlatList
                                data={sensordata}
                                style={dataStyles.binnenContainerFlatlist}
                                showsVerticalScrollIndicator={false}
                                onScroll={handleSensordataScroll}
                                scrollEventThrottle={16}
                                keyExtractor={(item) => item.sensordataID.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={dataStyles.binnenContainerParent}>
                                        <View
                                            style={[
                                                dataStyles.binnenContainer,
                                                index === sensordata.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 },
                                            ]}
                                        >
                                            <Text style={[dataStyles.innerTitle, { fontFamily: "Afacad" }]}>{item.apparaat}</Text>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Apparaat ID:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.apparaatID}</Text>
                                            </View>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Tijdstip:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.tijdstip}</Text>
                                            </View>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Waarde:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.waarde}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                                ListEmptyComponent={
                                    <View style={{ padding: 20 }}>
                                        <Text style={{ textAlign: "center" }}>Geen foutmeldingen gevonden.</Text>
                                    </View>
                                }
                            />
                            <View style={dataStyles.scrollbarTrack}>
                                <View style={[dataStyles.scrollbarThumb, { top: sensordataScrollPosition }]} />
                            </View>
                        </View>
                        )}
                        {/* PLANTDATA */}
                        <TouchableOpacity
                            style={[dataStyles.subTitleMenu, isPlantdataOpen ? { borderTopLeftRadius: 10, borderTopRightRadius: 10, } : { borderRadius: 10 }]}
                            onPress={() => setIsPlantdataOpen(!isPlantdataOpen)}
                        >
                            <Text style={dataStyles.uitklapMenuTitle}>Plantendata</Text>
                            <View style={isPlantdataOpen ? dataStyles.triangleDown : dataStyles.triangleUp} />
                        </TouchableOpacity>
                        {isPlantdataOpen && (
                        <View style={dataStyles.parentFlatlistContainer}>
                            <FlatList
                                data={plantdata}
                                style={dataStyles.binnenContainerFlatlist}
                                onScroll={handlePlantdataScroll}
                                showsVerticalScrollIndicator={false}
                                scrollEventThrottle={16}
                                keyExtractor={(item) => item.plantdataID.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={dataStyles.binnenContainerParent}>
                                        <View
                                            style={[
                                                dataStyles.binnenContainer,
                                                index === plantdata.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 },
                                            ]}
                                        >
                                            <Text style={[dataStyles.innerTitle, { fontFamily: "Afacad" }]}>{item.beschrijving}</Text>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Naam:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.plantnaam}</Text>
                                            </View>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Reden:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.reden}</Text>
                                            </View>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Plant ID:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.plantID}</Text>
                                            </View>
                                            <View style={dataStyles.innerItem}>
                                                <Text style={[dataStyles.eersteTekst, { fontFamily: "Afacad" }]}>Tijdstip:</Text>
                                                <Text style={[dataStyles.tweedeTekst, { fontFamily: "Afacad" }]}>{item.tijdstip}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                                ListEmptyComponent={
                                    <View style={{ padding: 20 }}>
                                        <Text style={{ textAlign: "center" }}>Geen wijzigingen gevonden.</Text>
                                    </View>
                                }
                            />
                            <View style={dataStyles.scrollbarTrack}>
                                <View style={[dataStyles.scrollbarThumb, { top: plantdataScrollPosition }]} />
                            </View>
                        </View>
                        )}             
                    </View>
                </ScrollView>
                <ExpandableMenu />
            </Background>
        </ProtectedRoute>
    );
};


export default Data;
