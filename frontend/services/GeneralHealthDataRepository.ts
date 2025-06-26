import { GeneralHealthDataSource } from './data-sources/GeneralHealthDataSource';
import { GeneralHealthData } from '../constants/types/GeneralHealthData';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/userProfileStore';

/**
 * Repository for managing general health data.
 * This is what the main app uses to interact with health data.
 * It abstracts the data source layer and provides a unified interface.
 * It uses the active data source based on user consent preferences.
 * 
 * It does not handle the case where user preference changes and data needs to be migrated.
 * 
 * TODO - incorporate with the encryption service
 */

export class GeneralHealthDataRepository {
    private cloudDataSource: GeneralHealthDataSource;
    private localDataSource: GeneralHealthDataSource;

    constructor(cloudDataSource: GeneralHealthDataSource, localDataSource: GeneralHealthDataSource) {
        this.cloudDataSource = cloudDataSource;
        this.localDataSource = localDataSource;
    }

    private getAuthenticatedUserData() {
        const user = useAuthStore.getState().user;
        if (!user) {
            throw new Error('User is not authenticated. Please log in first.');
        }
        return user;
    }

    private getActiveDataSource(): GeneralHealthDataSource {
        const userConsentPreferences = useProfileStore.getState().userConsentPreferences;
        if (userConsentPreferences?.cloudStorageEnabled) {
            return this.cloudDataSource;
        } else {
            return this.localDataSource;
        }
    }

    async getHealthData(): Promise<GeneralHealthData | null> {
        const { userId } = this.getAuthenticatedUserData();
        const activeDataSource = this.getActiveDataSource();
        try {
            return await activeDataSource.getHealthDataByUserId(userId);
        } catch (error: any) {
            console.error(`Error fetching health data from ${useProfileStore.getState().userConsentPreferences.cloudStorageEnabled ? 'cloud' : 'local'} storage:`, error);
            throw new Error(`Failed to retrieve health data: ${error.message}`);
        }
    }

    async createHealthData(healthData: GeneralHealthData): Promise<GeneralHealthData> {
        const { userId } = this.getAuthenticatedUserData();
        const activeDataSource = this.getActiveDataSource();
        console.log("Creating health data with userId:", userId, "and healthData:", healthData);
        try {
            // Append userId to the data payload as backend expects it in body
            const dataToCreate: GeneralHealthData = {
                ...healthData,
                userId: userId,
            };
            return await activeDataSource.createHealthData(dataToCreate);
        } catch (error: any) {
            console.error(`Error creating health data in ${useProfileStore.getState().userConsentPreferences.cloudStorageEnabled ? 'cloud' : 'local'} storage:`, error);
            throw new Error(`Failed to create health data: ${error.message}`);
        }
    }

    async deleteHealthData(): Promise<void> {
        const { userId } = this.getAuthenticatedUserData();
        const activeDataSource = this.getActiveDataSource();
        try {
            await activeDataSource.deleteHealthData(userId);
        } catch (error: any) {
            console.error(`Error deleting health data from ${useProfileStore.getState().userConsentPreferences.cloudStorageEnabled ? 'cloud' : 'local'} storage:`, error);
            throw new Error(`Failed to delete health data: ${error.message}`);
        }
    }
}