/**
 * This file is where all the services are instantiated and exported
 */

import { HttpClient } from './HttpClient';
import { CloudStorageService } from './CloudStorageService';
import { useAuthStore } from '@/store/authStore';
import { GeneralHealthDataRepository } from './GeneralHealthDataRepository';
import { CloudGeneralHealthDataSource } from './data-sources/CloudGeneralHealthDataSource';
import { LocalGeneralHealthDataSource } from './data-sources/LocalGeneralHealthDataSource';

// Instantiate the base HTTP client
const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL as string;
if (!apiBaseUrl) {
    console.error('EXPO_PUBLIC_API_URL is not defined in your .env file!');
}
export const httpClient : HttpClient = new CloudStorageService(apiBaseUrl);

// Helper function to get the current auth token for data sources
const getAuthToken = (): string | null => {
    return useAuthStore.getState().token;
};

export const cloudStorageService = new CloudStorageService(apiBaseUrl);
export const cloudHealthDataSource = new CloudGeneralHealthDataSource(httpClient, getAuthToken);
export const localHealthDataSource = new LocalGeneralHealthDataSource();
export const generalHealthDataRepository = new GeneralHealthDataRepository(cloudHealthDataSource, localHealthDataSource);