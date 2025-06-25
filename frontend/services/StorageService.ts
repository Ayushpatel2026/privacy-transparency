
export interface StoredData {
  key: string;
  value: any; // Can be any serializable data before encryption
  timestamp: string;
  storageType: 'local' | 'cloud';
}

/** TODO 
 * Interface for any Storage Service.
 * The methods in this interface and the types above may be changed as more details are worked out. 
 */
export interface StorageService {
  store(key: string, data: any): Promise<void>;
  retrieve(key: string): Promise<any | null>;
  getAllStoredData(): Promise<StoredData[]>; // For transparency dashboard
}