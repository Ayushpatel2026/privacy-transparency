import { View, Text } from "react-native";
import {useRouter} from "expo-router";
import GeneralButton from "@/components/GeneralButton";
import { useProfileStore } from "@/store/userProfileStore";

export default function Questions() {

    const router = useRouter();
    const { setHasCompletedAppOnboarding } = useProfileStore();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Questions Screen</Text>
            <GeneralButton title='Continue' onPress={() => {
                router.replace('/(tabs)')
                setHasCompletedAppOnboarding(true);
            }}/>
        </View>
    );
}