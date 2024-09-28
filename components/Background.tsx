import React, { PropsWithChildren } from "react";
import { View, ImageBackground } from "react-native";
import { GlobalStyles } from "@/constants/GlobalStyles";

const Background: React.FC<PropsWithChildren> = ({ children }) => 
{
    return (
        <ImageBackground
            source={require('../assets/images/achtergrond.png')}
            style={GlobalStyles.backgroundImage}
            resizeMode="cover"
        >
            <View style={GlobalStyles.overlay}>
                {children}
            </View>
        </ImageBackground>
    );
};

export default Background;
