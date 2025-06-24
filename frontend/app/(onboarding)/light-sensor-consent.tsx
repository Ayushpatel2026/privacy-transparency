import { View, Text } from "react-native";
import {useRouter} from "expo-router";
import GeneralButton from "@/components/GeneralButton";

export default function LightSensorConsent() {

    const router = useRouter();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Light Sensor Consent Screen</Text>
            <GeneralButton title='Continue' onPress={() => {router.push('/journal-data')}}/>
        </View>
    );
}