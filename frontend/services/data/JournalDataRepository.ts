import { JournalData } from '@/constants/types/JournalData';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/userProfileStore';
import { JournalDataSource } from './data-sources/JournalDataSource';
import { EncryptionService } from '../EncryptionService';

/**
 * Repository for managing journal data.
 * This is what the main app uses to interact with journal data.
 * It abstracts the data source layer and provides a unified interface.
 * 
 * It does not handle the case where user preference changes and data needs to be migrated.
 */
export class JournalDataRepository {
    private cloudDataSource: JournalDataSource;
    private localDataSource: JournalDataSource;
    private encryptionService: EncryptionService;

    constructor(cloudDataSource: JournalDataSource, localDataSource: JournalDataSource, encryptionService: EncryptionService) {
        this.cloudDataSource = cloudDataSource;
        this.localDataSource = localDataSource;
        this.encryptionService = encryptionService;
    }

    private getAuthenticatedUserData() {
        const user = useAuthStore.getState().user;
        if (!user) {
            throw new Error('User is not authenticated. Please log in first.');
        }
        return user;
    }

    private getActiveDataSource(): JournalDataSource {
        const userConsentPreferences = useProfileStore.getState().userConsentPreferences;
        if (userConsentPreferences?.cloudStorageEnabled) {
            return this.cloudDataSource;
        } else {
            return this.localDataSource;
        }
    }

    async getJournalByDate(date: string): Promise<JournalData | null> {
        const { userId } = this.getAuthenticatedUserData();
        const activeDataSource = this.getActiveDataSource();
        try {
            const response = await activeDataSource.getJournalByDate(userId, date);
            if (!response) {
                return null; // No journal found for the given date
            }
            return await this.encryptionService.decryptJournalData(response);
        } catch (error: any) {
            console.error(`Error fetching journal from ${useProfileStore.getState().userConsentPreferences.cloudStorageEnabled ? 'cloud' : 'local'} storage:`, error);
            throw new Error(`Failed to retrieve journal: ${error.message}`);
        }
    }

    async editJournal(journal: Partial<JournalData>, date: string): Promise<JournalData | null> {
        const { userId } = this.getAuthenticatedUserData();
        const activeDataSource = this.getActiveDataSource();
        try {
            const dataToCreate: Partial<Omit<JournalData, 'journalId' | 'userId'>> = {
                ...journal,
                date: date, // Ensure date is set correctly
            };
            console.log("Editing journal with data:", dataToCreate);
            const encryptedData = await this.encryptionService.encryptJournalData(dataToCreate);
            const response = await activeDataSource.editJournal(date, encryptedData, userId);
            if (!response) {
                return null; // No journal found for the given date
            }
            return await this.encryptionService.decryptJournalData(response);
        } catch (error: any) {
            console.error(`Error creating journal in ${useProfileStore.getState().userConsentPreferences.cloudStorageEnabled ? 'cloud' : 'local'} storage:`, error);
            throw new Error(`Failed to create journal: ${error.message}`);
        }
    }

    async deleteJournal(journalId: string): Promise<void> {
        const { userId } = this.getAuthenticatedUserData();
        const activeDataSource = this.getActiveDataSource();
        try {
            await activeDataSource.deleteJournal(journalId, userId);
        } catch (error: any) {
            console.error(`Error deleting journal from ${useProfileStore.getState().userConsentPreferences.cloudStorageEnabled ? 'cloud' : 'local'} storage:`, error);
            throw new Error(`Failed to delete journal: ${error.message}`);
        }
    }
}