import { EncryptionService } from "./encryptionService";
import { StorageService, StoredData } from "./storageService";

/**
 * TODO - The service will handle cloud storage of PHI data. 
 * It will call the REST API endpoint of the backend to store and retrieve data.
 */
export class CloudStorageService implements StorageService {
  private baseUrl: string;
  private encryptionService: EncryptionService;

  constructor(encryptionService: EncryptionService, backendUrl: string) {
    this.encryptionService = encryptionService;
    this.baseUrl = backendUrl;
  }

  async store(key: string, data: any): Promise<void> {
    console.log(`[CloudStorage] Attempting to store in cloud: ${key}`);
  }

  async retrieve(key: string): Promise<any | null> {
    console.log(`[CloudStorage] Attempting to retrieve from cloud: ${key}`);
  }

  async getAllStoredData(): Promise<StoredData[]> {
    console.log('[CloudStorage] Attempting to retrieve all stored data from cloud...');
    return [];
  }
}