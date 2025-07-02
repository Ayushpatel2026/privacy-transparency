import { SensorData } from '@/constants/types/SensorData';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/userProfileStore';
import { CloudSensorDataSource } from './data-sources/CloudSensorDataSource';
import { LocalSensorDataSource } from './data-sources/LocalSensorDataSource';
import { SensorDataSource } from './data-sources/SensorDataSource';

/**
 * Repository for managing sensor data
    * This is what the main app uses to interact with sensor data. 
    * Again, all types of sensor data is part of one interface for simplicity. This may need to be changed in the future. 
 * It abstracts the data source layer and provides a unified interface.
 * It uses the active data source based on user consent preferences.
 * 
 * It does not handle the case where user preference changes and data needs to be migrated.
 * 
 * TODO - incorporate with the encryption service
 */

export class SensorStorageRepository {
    private cloudDataSource: CloudSensorDataSource;
    private localDataSource: LocalSensorDataSource;

    constructor(cloudDataSource: CloudSensorDataSource, localDataSource: LocalSensorDataSource) {
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

    private getActiveDataSource(): SensorDataSource {
        const userConsentPreferences = useProfileStore.getState().userConsentPreferences;
        if (userConsentPreferences?.cloudStorageEnabled) {
            return this.cloudDataSource;
        } else {
            return this.localDataSource;
        }
    }

    async createSensorReading(sensorData: Omit<SensorData, 'id' | 'userId'>): Promise<SensorData> {
        const { userId } = this.getAuthenticatedUserData();
        const activeDataSource = this.getActiveDataSource();
        const sensorDataWithUserId: Omit<SensorData, 'id'> = {
            userId: userId,
            ...sensorData
        };
        console.log("Creating sensor reading with userId:", userId, "and sensorData:", sensorData);
        try {
            return await activeDataSource.createSensorReading(sensorDataWithUserId, userId);
        } catch (error: any) {
            console.error(`Error creating sensor reading in ${useProfileStore.getState().userConsentPreferences.cloudStorageEnabled ? 'cloud' : 'local'} storage:`, error);
            throw new Error(`Failed to create sensor reading: ${error.message}`);
        }
    }

    async getSensorReadingById(id: string): Promise<SensorData | null> {
        const { userId } = this.getAuthenticatedUserData();
        const activeDataSource = this.getActiveDataSource();
        try {
            return await activeDataSource.getSensorReadingById(userId, id);
        } catch (error: any) {
            console.error(`Error fetching sensor reading by ID ${id} from ${useProfileStore.getState().userConsentPreferences.cloudStorageEnabled ? 'cloud' : 'local'} storage:`, error);
            throw new Error(`Failed to retrieve sensor reading by ID: ${error.message}`);
        }
    }

    async getSensorReadingsByUserId(): Promise<SensorData[]> {
        const { userId } = this.getAuthenticatedUserData();
        const activeDataSource = this.getActiveDataSource();
        try {
            return await activeDataSource.getSensorReadingsByUserId(userId);
        } catch (error: any) {
            console.error(`Error fetching all sensor readings from ${useProfileStore.getState().userConsentPreferences.cloudStorageEnabled ? 'cloud' : 'local'} storage:`, error);
            throw new Error(`Failed to retrieve all sensor readings: ${error.message}`);
        }
    }

    async getSensorReadingsByDate(date: string): Promise<SensorData[]> {
        const { userId } = this.getAuthenticatedUserData();
        const activeDataSource = this.getActiveDataSource();
        try {
            return await activeDataSource.getSensorReadingsByDate(userId, date);
        } catch (error: any) {
            console.error(`Error fetching sensor reading by date ${date} from ${useProfileStore.getState().userConsentPreferences.cloudStorageEnabled ? 'cloud' : 'local'} storage:`, error);
            throw new Error(`Failed to retrieve sensor reading by date: ${error.message}`);
        }
    }

    async deleteSensorReading(id: string): Promise<boolean> {
        const { userId } = this.getAuthenticatedUserData();
        const activeDataSource = this.getActiveDataSource();
        try {
            return await activeDataSource.deleteSensorReading(userId, id);
        } catch (error: any) {
            console.error(`Error deleting sensor reading ${id} from ${useProfileStore.getState().userConsentPreferences.cloudStorageEnabled ? 'cloud' : 'local'} storage:`, error);
            throw new Error(`Failed to delete sensor reading: ${error.message}`);
        }
    }
}