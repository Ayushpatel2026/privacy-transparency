import { Router, Request, Response } from 'express';
import { JournalData } from '../../constants/types';
import verifyToken from '../../middleware/auth';
import { RequestHandler } from 'express';
import { FirestoreJournalRepository } from '../../repositories/firestore/FirestoreJournalRepository';
import { JournalRepository } from '../../repositories/JournalRepository';

const router = Router();
const journalRepository : JournalRepository = new FirestoreJournalRepository();

router.post('/', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {

        const { date, bedtime, alarmTime, sleepDuration, diaryEntry, sleepNotes, userId } = req.body;

        // Basic validation for required fields
        if (!bedtime && !alarmTime && !sleepDuration && !diaryEntry && !sleepNotes) {
            res.status(400).json({ message: 'Missing required journal fields.' });
            return;
        }

        const newJournalData: Omit<JournalData, 'journalId'> = {
            date,
            userId,
            bedtime,
            alarmTime,
            sleepDuration,
            diaryEntry,
            sleepNotes: sleepNotes || [],
        };

        const createdJournal = await journalRepository.createJournal(newJournalData);
        res.status(201).json({ message: 'Journal entry created successfully', journal: createdJournal });

    } catch (error: any) {
        console.error('Error creating journal entry:', error);
        res.status(500).json({ message: 'Failed to create journal entry.', error: error.message });
    }
});


router.get('/', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {
        const userID = req.userId;

        if (!userID) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        const journals = await journalRepository.getJournalsByUserId(userID);
        res.status(200).json({ journals });
    } catch (error: any) {
        console.error('Error fetching journal entries:', error);
        res.status(500).json({ message: 'Failed to retrieve journal entries.', error: error.message });
    }
});

router.get('/:journalId', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {
        const userID = req.userId;
        const { journalId } = req.params;
        if (!userID) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        const journal = await journalRepository.getJournalById(userID, journalId);

        if (!journal) {
            res.status(404).json({ message: 'Journal entry not found or unauthorized.' });
            return;
        }
        res.status(200).json({ journal });
    } catch (error: any) {
        console.error(`Error fetching journal entry ${req.params.journalId}:`, error);
        res.status(500).json({ message: 'Failed to retrieve journal entry.', error: error.message });
    }
});

router.put('/:journalId', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {
        const userID = req.userId;
        const { journalId } = req.params;
        const updatedData: Partial<Omit<JournalData, 'journalId' | 'userId'>> = req.body;

        if (!userID) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }
        
        if (Object.keys(updatedData).length === 0) {
            res.status(400).json({ message: 'No data provided for update.' });
            return;
        }

        const updatedJournal = await journalRepository.updateJournal(userID, journalId, updatedData);

        if (!updatedJournal) {
            res.status(404).json({ message: 'Journal entry not found or unauthorized to update.' });
            return;
        }
        res.status(200).json({ message: 'Journal entry updated successfully', journal: updatedJournal });

    } catch (error: any) {
        console.error(`Error updating journal entry ${req.params.journalId}:`, error);
        res.status(500).json({ message: 'Failed to update journal entry.', error: error.message });
    }
});


router.delete('/:journalId', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {
        const userID = req.userId;
        const { journalId } = req.params;
        if (!userID) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        const deleted = await journalRepository.deleteJournal(userID, journalId);

        if (!deleted) {
            res.status(404).json({ message: 'Journal entry not found or unauthorized to delete.' });
            return;
        }
        res.status(204).json({ message: 'Journal entry deleted successfully.' });

    } catch (error: any) {
        console.error(`Error deleting journal entry ${req.params.journalId}:`, error);
        res.status(500).json({ message: 'Failed to delete journal entry.', error: error.message });
    }
});

export default router;