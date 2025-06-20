// this could be a stack of many screens or it could be a single screen with a carousel component
import { View, Text } from "react-native";

export default function Onboarding() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Onboarding Screen</Text>
        </View>
    );
}