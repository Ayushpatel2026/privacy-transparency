import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

/** TODO 
 * The encryption service will handle encryption and decryption of sensitive data using AES-GCM.
 * It will initialize an encryption key either by loading it from SecureStore or generating a new one
 * This service will be used by both LocalStorageService and CloudStorageService to ensure data is encrypted before storage.
 */
export class EncryptionService {
  private encryptionKey: CryptoKey | null = null;
  private isInitialized: Promise<void>;

  constructor() {
    this.isInitialized = this.initializeKey();
  }

  /**
   * TODO - Initializes the encryption key: either loads it from SecureStore or generates a new one.
   */
  private async initializeKey(): Promise<void> {
    console.log("Initializing Encryption Key")
  }

  /**
   * TODO - Encrypts a string using AES-GCM.
   */
  async encrypt(data: string): Promise<string> {
    console.log("Encrypting data");
    return "";
  }

  /**
   * TODO - Decrypts an AES-GCM encrypted string.
   */
  async decrypt(encryptedBase64: string): Promise<string> {
    console.log("Decrypting the data")
    return "";
  }
}

// Export a singleton instance of the EncryptionService
export const encryptionService = new EncryptionService();