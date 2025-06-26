import { View, Text, StyleSheet } from "react-native";
import {useRouter} from "expo-router";
import GeneralButton from "@/components/GeneralButton";
import { useProfileStore } from "@/store/userProfileStore";
import OnboardingHeader from "@/components/OnboardingHeader";
import { useState } from "react";
import OnboardingQuestionOption from "@/components/OnboardingQuestionOption";
import { generalHealthDataRepository } from "@/services/index";
import { GeneralHealthData } from "@/constants/types/GeneralHealthData";
import { useAuthStore } from "@/store/authStore";

export default function Questions() {

	const router = useRouter();
	const { setHasCompletedAppOnboarding } = useProfileStore();
  const { user } = useAuthStore();

	const [selectedOption, setSelectedOption] = useState<string>();

  // Define the available options for the question
  const sleepOptions = ['6 hours or less', '6 - 8 hours', '8 - 10 hours'];

	const handleOptionPress = (value: string) => {
    setSelectedOption(value);
  };

	// TODO - this data would be saved in the cloud or local storage
	const saveSelectedOption = async () => {
    // it is not neccessary for the user to select an option before continuing, but if they do not select one, we will not save anything
		if (!selectedOption){
      return;
    }

    const healthData = {
      userId: user?.userId,
      currentSleepDuration: selectedOption,
      snoring: '',
      tirednessFrequency: '',
      daytimeSleepiness: '',
    }
    console.log('Saving health data:', healthData);
    try{
      const response = await generalHealthDataRepository.createHealthData(healthData as GeneralHealthData)
      console.log('Health data saved successfully:', response);
    } catch (error) {
      console.error('Error saving health data:', error);
      return;
    }
  }

	return (
		<View
			style={styles.container}
		>
			<OnboardingHeader title="" onBackPress={() => router.back()} />
			<View style={styles.mainContentArea}>
        <View style={styles.questionSection}>
          <Text style={styles.questionText}>How much sleep do you usually get at night?</Text>
        </View>

        <View style={styles.optionsContainer}>
          {sleepOptions.map((option) => (
            <OnboardingQuestionOption
              key={option}
              label={option}
              isSelected={selectedOption === option}
              onPress={() => handleOptionPress(option)}
            />
          ))}
        </View>
      </View>
      <GeneralButton
        title='Continue'
        onPress={() => {
          saveSelectedOption(); 
          router.replace('/(tabs)'); 
          setHasCompletedAppOnboarding(true); 
        }}
      />
    </View>
  );
}

// =============================================================
// STYLES
// =============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24, 
    paddingBottom: 20, 
    justifyContent: 'space-between',
  },
  mainContentArea: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center', 
  },
  questionSection: {
    marginBottom: 32, 
    width: '100%',
  },
  questionText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center', 
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center', 
    marginBottom: 20, 
  },
});
