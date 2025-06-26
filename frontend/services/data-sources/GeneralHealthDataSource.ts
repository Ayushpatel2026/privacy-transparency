import { GeneralHealthData } from "@/constants/types/GeneralHealthData";

/**
 * Provides an interface to interact with general health data 
 * General health data includes sleep, snoring, tiredness, and daytime sleepiness.
 */
export interface GeneralHealthDataSource {
    getHealthDataByUserId(userId: string): Promise<GeneralHealthData | null>;
    createHealthData(healthData: GeneralHealthData): Promise<GeneralHealthData>;
    deleteHealthData(userId: string): Promise<void>;
}