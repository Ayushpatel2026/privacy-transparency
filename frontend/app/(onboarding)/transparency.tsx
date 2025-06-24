import { View, Text, StyleSheet } from "react-native";
import {useRouter} from "expo-router";
import GeneralButton from "@/components/GeneralButton";
import { useProfileStore } from "@/store/userProfileStore";
import OnboardingHeader from "@/components/OnboardingHeader";
import { Colors } from "@/constants/Colors";

export default function Transparency() {

  const router = useRouter();

	const { setHasCompletedPrivacyOnboarding } = useProfileStore();

	return (
		<View style={styles.container}>
			<OnboardingHeader title="Your Privacy Matters to Us" onBackPress={() => router.back()} />
			<View style={styles.contentContainer}>
				<Text style={styles.sectionTitle}>Privacy Features In this App</Text>
				<Text style={styles.sectionText}>
					This prototype app is designed to prioritize transparency by embedding details about data collection within the UI. Some of these features include: ....
				</Text>
				<GeneralButton title='Continue' onPress={() => {
						router.push('/questions-explanation')
						setHasCompletedPrivacyOnboarding(true);
				}}/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	contentContainer: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 32,
		paddingBottom: 40,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	sectionTitle: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	sectionText: {
		color: 'white',
		fontSize: 16,
		lineHeight: 24,
		marginBottom: 16,
	},
	linkText: {
		color: Colors.hyperlinkBlue,
		fontSize: 14,
		marginBottom: 32,
		textDecorationLine: 'underline',
	},
})