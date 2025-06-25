import { GeneralHealthData } from '../constants/types';

/**
 * This interface is for general health data repository operations. 
 * General health data includes information like current sleep duration, snoring, tiredness frequency, and daytime sleepiness.
 */
export interface HealthDataRepository {
    createHealthData: (healthData : GeneralHealthData) => Promise<GeneralHealthData>;
    getHealthDataById: (userId: string) => Promise<GeneralHealthData | null>;
    updateHealthData: (userId: string, healthData : Omit<GeneralHealthData, 'userId'>) => Promise<GeneralHealthData | null>;
    deleteHealthData: (userId: string) => Promise<boolean>;
}