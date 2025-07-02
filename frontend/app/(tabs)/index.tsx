// the sleep screen is the index.tsx file for the tabs because this screen is generally the first screen users would want to see when they open the app

import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { sensorBackgroundTaskManager } from "@/services";
import { useProfileStore } from "@/store/userProfileStore";

export default function Sleep() {
	const [loading, setLoading] = useState(true);
	const { isSleepModeActive, setIsSleepModeActive } = useProfileStore();


	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 2000); // Simulate a loading delay of 2 seconds for now
	}, []);

	const handleStartSleepSession = async () => {
		setIsSleepModeActive(true);
		await sensorBackgroundTaskManager.updateConfig({
			audioEnabled: true,
			lightEnabled: true,
		});
	};

	const handleEndSleepSession = async () => {
		setIsSleepModeActive(false);
		await sensorBackgroundTaskManager.updateConfig({
			audioEnabled: false,
			lightEnabled: false,
		});
	};

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
			<Button title="Start Sleep" onPress={handleStartSleepSession} />
			<Button title="End Sleep" onPress={handleEndSleepSession} />
		</View>
	);
}