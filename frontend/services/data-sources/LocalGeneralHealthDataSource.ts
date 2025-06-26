import { GeneralHealthData } from "@/constants/types/GeneralHealthData";
import { GeneralHealthDataSource } from "./GeneralHealthDataSource";
import * as SecureStore from 'expo-secure-store';

/**
 * Since there is only small amounts of general health data for each user, we can use 
 * expo secure store to store this data locally instead of a sqlite database.
 */
export class LocalGeneralHealthDataSource implements GeneralHealthDataSource{
    async getHealthDataByUserId(userId: string): Promise<GeneralHealthData | null> {
        const healthData = await SecureStore.getItemAsync(`healthData_${userId}`);
        if (healthData) {
            return JSON.parse(healthData) as GeneralHealthData;
        } else {
            return null;
        }
    }
    async createHealthData(healthData: GeneralHealthData): Promise<GeneralHealthData> {
        console.log("Creating health data in local storage with data:", healthData);
        const userId = healthData.userId;
        if (!userId) {
            throw new Error("User ID is required to create health data.");
        }

        // get existing health data if it exists
        const existingHealthData = await this.getHealthDataByUserId(userId);
        if (existingHealthData) {
            // use the userId from the existing data
            const updatedHealthData: GeneralHealthData = {
                userId: existingHealthData.userId,
                currentSleepDuration: healthData.currentSleepDuration === '' ? existingHealthData.currentSleepDuration : healthData.currentSleepDuration,
                snoring: healthData.snoring === '' ? existingHealthData.snoring : healthData.snoring,
                tirednessFrequency: healthData.tirednessFrequency === '' ? existingHealthData.tirednessFrequency : healthData.tirednessFrequency,
                daytimeSleepiness: healthData.daytimeSleepiness === '' ? existingHealthData.daytimeSleepiness : healthData.daytimeSleepiness,
            }

            await SecureStore.setItemAsync(`healthData_${userId}`, JSON.stringify(updatedHealthData));
            return updatedHealthData;
        } else {
            // create new health data
            await SecureStore.setItemAsync(`healthData_${userId}`, JSON.stringify(healthData));
            return healthData;
        }
    }
    async deleteHealthData(userId: string): Promise<void> {
        await SecureStore.deleteItemAsync(`healthData_${userId}`);
    }
}