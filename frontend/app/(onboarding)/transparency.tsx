import { View, Text } from "react-native";
import {useRouter} from "expo-router";
import GeneralButton from "@/components/GeneralButton";
import { useProfileStore } from "@/store/userProfileStore";

export default function Transparency() {

    const router = useRouter();

    const { setHasCompletedPrivacyOnboarding } = useProfileStore();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Transparency Explanation Screen</Text>
            <GeneralButton title='Continue' onPress={() => {
                router.push('/questions-explanation')
                setHasCompletedPrivacyOnboarding(true);
            }}/>
        </View>
    );
}