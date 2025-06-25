/**
 * This store is used to manage the user's profile information in the application. 
 * This includes profile information, consent status and loading states related to profile management.
 * This information is stored in AsyncStorage and persists at the device level, not the account level.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_USER_CONSENT_PREFERENCES, UserConsentPreferences } from '@/constants/types/UserConsentPreferences';

interface UserProfileState {
    userConsentPreferences: UserConsentPreferences;
    isLoading: boolean;
    hasCompletedPrivacyOnboarding: boolean;
    hasCompletedAppOnboarding: boolean; // this variable is for the onboarding questions related to user's current sleep habits
    loadProfileStatus: () => Promise<void>;
    setHasCompletedPrivacyOnboarding: (value: boolean) => Promise<void>;
    setHasCompletedAppOnboarding: (value: boolean) => Promise<void>;
    setUserConsentPreferences: (preferences: UserConsentPreferences) => Promise<void>;
    isSleepModeActive: boolean; // this variable is used to track if the user is on the "sleep mode" screen
    setIsSleepModeActive: (isSleepModeActive: boolean) => void;
}

export const useProfileStore = create<UserProfileState>((set, get) => ({
    userConsentPreferences: DEFAULT_USER_CONSENT_PREFERENCES,
    isLoading: false,
    hasCompletedPrivacyOnboarding: false,
    hasCompletedAppOnboarding: false,

    /* this variable is used to track if the user is on the "sleep mode" screen 
     * When this is true, the light sensor and accelerometer will be active to detect sleep patterns.
     * This can be deactivated if the user presses the "wake up" button on the sleep mode screen.
     * This variable is technically not part of the user profile, but I am not sure where else to put it.
    */
    isSleepModeActive: false,

    loadProfileStatus: async () => {
        set({ isLoading: true });
		try {
			const hasCompletedPrivacyOnboarding = await AsyncStorage.getItem('hasCompletedPrivacyOnboarding');
            const hasCompletedAppOnboarding = await AsyncStorage.getItem('hasCompletedAppOnboarding');
            const userConsentPreferences = await AsyncStorage.getItem('userConsentPreferences');

            if (userConsentPreferences){
                set({ userConsentPreferences: JSON.parse(userConsentPreferences)})
            }
			if (hasCompletedAppOnboarding === 'true') {
                set({hasCompletedAppOnboarding: true});
            }
            if (hasCompletedPrivacyOnboarding === 'true') {
                set({hasCompletedPrivacyOnboarding: true});
            }
            set({isLoading: false});
		} catch (error) {
			set({ isLoading: false });
			console.error('Failed to load user profile status', error);
		}
    },
    setHasCompletedPrivacyOnboarding: async (value: boolean) => {
        set({ hasCompletedPrivacyOnboarding: value });
        try {
            await AsyncStorage.setItem('hasCompletedPrivacyOnboarding', value ? 'true' : 'false');
        }
        catch (error) {
            console.error('Failed to save hasCompletedPrivacyOnboarding', error);
        }
    },
    setHasCompletedAppOnboarding: async (value: boolean) => {
        set({ hasCompletedAppOnboarding: value });
        try {
            await AsyncStorage.setItem('hasCompletedAppOnboarding', value ? 'true' : 'false');
        }
        catch (error) {
            console.error('Failed to save hasCompletedAppOnboarding', error);
        }
    },
    setUserConsentPreferences: async (preferences: UserConsentPreferences) => {
        set({ userConsentPreferences: preferences });
        try {
            await AsyncStorage.setItem('userConsentPreferences', JSON.stringify(preferences));
        } catch (error) {
            console.error('Failed to save user consent preferences', error);
        }
    },
    setIsSleepModeActive: (isSleepModeActive: boolean) => {
        set({ isSleepModeActive });
        // Note: No AsyncStorage save here, as this is a temporary state variable
    }
}));
