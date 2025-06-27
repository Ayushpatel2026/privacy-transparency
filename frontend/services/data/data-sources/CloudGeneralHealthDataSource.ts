import { GeneralHealthDataSource } from './GeneralHealthDataSource';
import { GeneralHealthData } from '../../constants/types/GeneralHealthData'; 
import { HttpClient } from '../HttpClient'; 

/**
 * This is the cloud implementation of the GeneralHealthDataSource
 */
export class CloudGeneralHealthDataSource implements GeneralHealthDataSource {
    private httpClient: HttpClient;
    private getTokenFn: () => string | null; // Function to get the token, injected

    constructor(httpClient: HttpClient, getTokenFn: () => string | null) {
        this.httpClient = httpClient;
        this.getTokenFn = getTokenFn;
    }

    private getAuthToken(): string {
        const token = this.getTokenFn();
        if (!token) {
            throw new Error('Authentication token missing for cloud operation.');
        }
        return token;
    }

    async getHealthDataByUserId(userId: string): Promise<GeneralHealthData | null> {
        const token = this.getAuthToken();
        try {
            const response = await this.httpClient.get<{ healthData: GeneralHealthData }>('/phi/generalHealth/', token);
            return response.healthData;
        } catch (error: any) {
            if (error.message.includes('404') || error.message.toLowerCase().includes('not found')) {
                return null;
            }
            console.error(`Error fetching health data from cloud for user ${userId}:`, error);
            throw error;
        }
    }

    async createHealthData(healthData: GeneralHealthData): Promise<GeneralHealthData> {
        console.log("Creating health data in cloud with data:", healthData);
        const token = this.getAuthToken();
        try {
            // Backend's POST /phi/generalHealth expects the full object in the body
            const response = await this.httpClient.post<{ healthData: GeneralHealthData }>('/phi/generalHealth/', healthData, token);
            return response.healthData;
        } catch (error: any) {
            console.error("Error creating health data in cloud:", error);
            // Re-throw the error so the calling repository can handle it (e.g., show user message)
            throw new Error(`Failed to create health data in cloud: ${error.message}`);
        }
    }

    async deleteHealthData(userId: string): Promise<void> {
        const token = this.getAuthToken();
        try {
            await this.httpClient.delete<{}>(`/phi/generalHealth/`, token);
        } catch (error: any) {
            console.error("Error deleting health data from cloud:", error);
            throw new Error(`Failed to delete health data from cloud: ${error.message}`);
        }
    }
}