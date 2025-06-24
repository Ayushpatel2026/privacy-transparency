// the sleep screen is the index.tsx file for the tabs because this screen is generally the first screen users would want to see when they open the app

import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function Sleep() {
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 2000); // Simulate a loading delay of 2 seconds for now
	}, []);

	if (loading){
		return <Loader size="large" />;
	}
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