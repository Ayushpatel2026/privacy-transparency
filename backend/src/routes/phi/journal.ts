import { Router, Request, Response } from 'express';
import { JournalData } from '../../constants/types';
import verifyToken from '../../middleware/auth';
import { RequestHandler } from 'express';
import { FirestoreJournalRepository } from '../../repositories/firestore/FirestoreJournalRepository';
import { JournalRepository } from '../../repositories/JournalRepository';

const router = Router();
const journalRepository : JournalRepository = new FirestoreJournalRepository();

/**
 * Get by userId
 */
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

/**
 * Edit or create a journal entry by date
 */
router.put('/:date', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {
        const userID = req.userId;
        const { date } = req.params; // Get date from URL parameters
        const updatedData: Partial<Omit<JournalData, 'journalId' | 'userId'>> = req.body;

        if (!userID) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        if (!date) {
            res.status(400).json({ message: 'Date parameter is required.' });
            return;
        }

        const journal = await journalRepository.editJournal(userID, date, updatedData);

        if (!journal) {
            res.status(500).json({ message: 'Failed to process journal entry (create/update).' });
            return;
        }
        res.status(200).json({ journal });

    } catch (error: any) {
        console.error(`Error editing journal entry for date ${req.params.date}:`, error);
        res.status(500).json({ message: 'Failed to edit journal entry.', error: error.message });
    }
});

router.get('/by-date/:date', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {
        const userID = req.userId;
        const { date } = req.params; // Date in YYYY-MM-DD format

        if (!userID) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        const journal = await journalRepository.getJournalByDate(userID, date);

        res.status(200).json({ journal });
    } catch (error: any) {
        console.error(`Error fetching journal for user ${req.userId} on date ${req.params.date}:`, error);
        res.status(500).json({ message: 'Failed to retrieve journal by date.', error: error.message });
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