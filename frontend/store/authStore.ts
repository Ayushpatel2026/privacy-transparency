/*
	This authStore is used to manage the user authentication state in the application. 
	This includes the auth token, registration information (email, name etc..) and loading states related to authentication.
*/

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store'; 
import { User } from '../constants/types/User';

interface AuthState {
	user: User | null;
	token: string | null;
	isLoading: boolean;
	isCheckingAuth: boolean;
	register: (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
	checkAuth: () => Promise<void>;
	login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
	logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
	token: null,
	isLoading: false,
	isCheckingAuth: true,
	
	checkAuth: async () => {
		set({ isLoading: true });

		try {
			const user = await AsyncStorage.getItem('user');
			const token = await SecureStore.getItemAsync('authToken');

			if (user && token) {
				set({ user: JSON.parse(user), token: token, isLoading: false });
			} else {
				set({ user: null, token: null, isLoading: false });
			}
		} catch (error) {
			set({ isLoading: false });
			console.error('Failed to check authentication:', error);
		} finally {
			set({ isCheckingAuth: false });
		}
	},
	register: async (firstName: string, lastName: string, email: string, password: string) => {
		set({ isLoading: true });

		try {
			const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ firstName, lastName, email, password }),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || 'Registration failed');
			}
			await AsyncStorage.setItem('user', JSON.stringify(data.user));
			
			// Store sensitive token securely using expo-secure-store
      await SecureStore.setItemAsync('authToken', data.token);

			set({ user: data.user, token: data.token, isLoading: false });
			return {
				success: true,
			}
		} catch (error: unknown) {
			set({ isLoading: false });
			return { success: false, message: error instanceof Error ? error.message : 'An error occurred during registration.' };
		}
	},
	login: async (email: string, password: string) => {
		set({ isLoading: true });
		try{
			console.log('Logging in with:', { email, password });
			const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			})

			console.log('Response status:', response.status);

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || 'Login failed');
			}
			await AsyncStorage.setItem('user', JSON.stringify(data.user));

			// Store sensitive token securely using expo-secure-store
      await SecureStore.setItemAsync('authToken', data.token);
			set({ user: data.user, token: data.token, isLoading: false });
			return {
				success: true,
			}

		} catch (error: unknown) {
			set({ isLoading: false });
			return { success: false, message: error instanceof Error ? error.message : 'An error occurred during login.' };
		}
	},
	logout: async () => {
		try {
			await AsyncStorage.removeItem('user');
			
			// Delete token from SecureStore
      await SecureStore.deleteItemAsync('authToken');
			set({ user: null, token: null });
		} catch (error) {
			console.error('Failed to logout:', error);
		}
	},
}));