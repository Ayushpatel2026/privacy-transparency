import { EncryptionService } from "./encryptionService";
import { StorageService, StoredData } from "./storageService";

/**
 * TODO - Implement LocalStorageService to store data in local storage.
 * Where exactly in local storage is this data stored?
*/
export class LocalStorageService implements StorageService {
  private encryptionService: EncryptionService;

  constructor(encryptionService: EncryptionService) {
    this.encryptionService = encryptionService;
  }

  async store(key: string, data: any): Promise<void> {
    console.log(`[LocalStorage] Attempting to store locally: ${key}`);
  }

  async retrieve(key: string): Promise<any | null> {
    console.log(`[LocalStorage] Attempting to retrieve from local storage: ${key}`);
  }

  async getAllStoredData(): Promise<StoredData[]> {
    console.log('[LocalStorage] Retrieving all stored data...');
    return [];
  }
}