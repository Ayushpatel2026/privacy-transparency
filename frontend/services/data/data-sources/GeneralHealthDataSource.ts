import { GeneralHealthData } from "@/constants/types/GeneralHealthData";

/**
 * Provides an interface to interact with general health data 
 * General health data includes sleep, snoring, tiredness, and daytime sleepiness.
 * 
 * Note that while many of these functions take userId as an argument, this is only for local storage.
 * In cloud storage, the userId is not needed as the backend will get it from the JWT token.
 */
export interface GeneralHealthDataSource {
    getHealthDataByUserId(userId: string): Promise<GeneralHealthData | null>;
    createHealthData(healthData: GeneralHealthData): Promise<GeneralHealthData>;
    deleteHealthData(userId: string): Promise<void>;
}