import { CustomSwitchProps } from "@/assets/types/customTypes";
import { plantStyles } from "@/constants/PlantStyles";
import { TouchableOpacity, View } from "react-native";

const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onValueChange }) => {
    return (
        <TouchableOpacity
            style={[
                plantStyles.switchContainer,
                value ? plantStyles.switchOn : plantStyles.switchOff,
            ]}
            onPress={() => onValueChange(!value)}
            activeOpacity={0.8}
        >
            <View
                style={[
                    plantStyles.thumb,
                    value ? plantStyles.thumbOn : plantStyles.thumbOff,
                ]}
            />
        </TouchableOpacity>
    );
};

export default CustomSwitch;