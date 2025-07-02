/**
 * This file is where all the services are instantiated and exported
 */

import { HttpClient } from './HttpClient';
import { CloudStorageService } from './data/CloudStorageService';
import { useAuthStore } from '@/store/authStore';
import { GeneralHealthDataRepository } from './data/GeneralHealthDataRepository';
import { CloudGeneralHealthDataSource } from './data/data-sources/CloudGeneralHealthDataSource';
import { LocalGeneralHealthDataSource } from './data/data-sources/LocalGeneralHealthDataSource';
import { LocalDatabaseManager } from './data/LocalDatabaseManager';
import { LocalJournalDataSource } from './data/data-sources/LocalJournalDataSource';
import { JournalDataRepository } from './data/JournalDataRepository';
import { CloudJournalDataSource } from './data/data-sources/CloudJournalDataSource';
import { SensorBackgroundTaskManager } from './BackgroundTaskManager';
import { CloudSensorDataSource } from './data/data-sources/CloudSensorDataSource';

// Instantiate the base HTTP client
const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL as string;
if (!apiBaseUrl) {
    console.error('EXPO_PUBLIC_API_URL is not defined in your .env file!');
}
export const httpClient : HttpClient = new CloudStorageService(apiBaseUrl);
const dbManager = LocalDatabaseManager.getInstance();

// Helper function to get the current auth token for data sources
const getAuthToken = (): string | null => {
    return useAuthStore.getState().token;
};

export const cloudHealthDataSource = new CloudGeneralHealthDataSource(httpClient, getAuthToken);
export const localHealthDataSource = new LocalGeneralHealthDataSource();
export const generalHealthDataRepository = new GeneralHealthDataRepository(cloudHealthDataSource, localHealthDataSource);

export const cloudJournalDataSource = new CloudJournalDataSource(httpClient, getAuthToken);
export const localJournalDataSource = new LocalJournalDataSource(dbManager);
export const journalDataRepository = new JournalDataRepository(cloudJournalDataSource, localJournalDataSource);

export const cloudSensorDataSource = new CloudSensorDataSource(httpClient, getAuthToken);
export const localSensorDataSource = new LocalJournalDataSource(dbManager);
export const sensorBackgroundTaskManager = new SensorBackgroundTaskManager();