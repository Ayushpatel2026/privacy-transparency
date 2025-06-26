// TODO - implement this class 

import { GeneralHealthData } from "@/constants/types/GeneralHealthData";
import { GeneralHealthDataSource } from "./GeneralHealthDataSource";

export class LocalGeneralHealthDataSource implements GeneralHealthDataSource{
    getHealthDataByUserId(userId: string): Promise<GeneralHealthData | null> {
        throw new Error("Method not implemented.");
    }
    createHealthData(healthData: GeneralHealthData): Promise<GeneralHealthData> {
        throw new Error("Method not implemented.");
    }
    updateHealthData(updatedData: Omit<GeneralHealthData, "userId">, userId: string): Promise<GeneralHealthData | null> {
        throw new Error("Method not implemented.");
    }
    deleteHealthData(userId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}