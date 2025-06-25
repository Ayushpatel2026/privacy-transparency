import { JournalData } from '../constants/types';

/**
 * Interface for interacting with journal data storage.
 * Defines the contract for CRUD operations on JournalData.
 */
export interface JournalRepository {

    createJournal(journalData: Omit<JournalData, 'journalId'>): Promise<JournalData>;

    getJournalById(userId: string, journalId: string): Promise<JournalData | null>;

    getJournalsByUserId(userId: string): Promise<JournalData[]>;

    getJournalByDate(userId: string, date: string): Promise<JournalData | null>;

    updateJournal(userId: string, journalId: string, updatedData: Partial<Omit<JournalData, 'journalId' | 'userId'>>): Promise<JournalData | null>;

    deleteJournal(userId: string, journalId: string): Promise<boolean>;
}