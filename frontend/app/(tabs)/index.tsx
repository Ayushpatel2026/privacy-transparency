// the sleep screen is the index.tsx file for the tabs because this screen is generally the first screen users would want to see when they open the app

import { View, Text } from "react-native";

export default function Sleep() {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text>Sleep Screen</Text>
		</View>
	);
}