import React from "react";
import { AuthProvider } from "./components/AuthContext";
import { Stack } from "expo-router";
import { Buffer } from "buffer";
// Voeg dit toe boven je import
// @ts-ignore
import { polyfill } from "react-native-crypto";

polyfill();

global.Buffer = Buffer; // Polyfill voor Buffer
polyfill(); // Voeg crypto-functionaliteit toe


const App: React.FC = () => {
    return (
        <AuthProvider>
            <Stack />
        </AuthProvider>
    );
};

export default App;
