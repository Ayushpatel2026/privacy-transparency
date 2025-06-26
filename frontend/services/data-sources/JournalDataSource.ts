import { JournalData } from '../../constants/types/JournalData';

/**
 * Provides an interface to interact with journal data.
 * Journal data includes entries made by users, which can be stored in cloud or local storage.
 */
export interface JournalDataSource {
    getJournalsByUserId(userId: string): Promise<JournalData[]>;
    getJournalById(journalId: string): Promise<JournalData | null>;
    createJournal(journalData: Omit<JournalData, 'journalId'>, userId: string): Promise<JournalData>;
    updateJournal(journalId: string, updatedData: Partial<Omit<JournalData, 'journalId' | 'userId'>>, userId: string): Promise<JournalData | null>;
    deleteJournal(journalId: string, userId: string): Promise<void>;
}