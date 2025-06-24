import { View, Text } from "react-native";
import {useRouter} from "expo-router";
import GeneralButton from "@/components/GeneralButton";

export default function QuestionsExplanation() {

    const router = useRouter();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Questions Explanation Screen</Text>
            <GeneralButton title='Continue' onPress={() => {router.push('/questions')}}/>
        </View>
    );
}