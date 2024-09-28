import React from "react";
import { AuthProvider } from "./components/AuthContext";
import { Stack } from "expo-router";

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Stack />
        </AuthProvider>
    );
};

export default App;
