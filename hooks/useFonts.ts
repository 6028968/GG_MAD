import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

export default function useFonts() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            await SplashScreen.preventAutoHideAsync();
            await Font.loadAsync({
                'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
                "recharge": require("../assets/fonts/recharge.ttf"),
            });
            setFontsLoaded(true);
            await SplashScreen.hideAsync();
        }
        loadFonts();
    }, []);

    return fontsLoaded;
}
