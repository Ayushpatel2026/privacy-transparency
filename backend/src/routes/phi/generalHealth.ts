import { Router, Request, Response, RequestHandler } from 'express';
import { GeneralHealthData } from '../../constants/types'; 
import verifyToken from '../../middleware/auth'; 
import { FirestoreHealthDataRepository } from '../../repositories/firestore/FirestoreHealthDataRepository';
import { HealthDataRepository } from '../../repositories/HealthDataRepository';

const router = Router();
const healthDataRepository : HealthDataRepository = new FirestoreHealthDataRepository();


router.post('/', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {

        if (!req.body.userId) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        const { currentSleepDuration, snoring, tirednessFrequency, daytimeSleepiness } = req.body;

        // Basic validation - need at least one field to create health data
        if (!currentSleepDuration && !snoring && !tirednessFrequency && !daytimeSleepiness) {
            res.status(400).json({ message: 'Missing required general health data fields.' });
            return;
        }

        const newHealthData: GeneralHealthData = req.body;

        const createdHealthData = await healthDataRepository.createHealthData(newHealthData);
        res.status(201).json({ message: 'General health data created successfully', healthData: createdHealthData });

    } catch (error: any) {
        // Specifically check for the 'already exists' error from the repository
        if (error.message.includes('Health data already exists for user')) {
            res.status(409).json({ message: error.message }); // 409 Conflict
            return;
        }
        console.error('Error creating general health data:', error);
        res.status(500).json({ message: 'Failed to create general health data.', error: error.message });
    }
});


router.get('/', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        const healthData = await healthDataRepository.getHealthDataById(userId);

        if (!healthData) {
            res.status(404).json({ message: 'General health data not found for this user.' });
            return;
        }
        res.status(200).json({ healthData });
    } catch (error: any) {
        console.error(`Error fetching general health data for user ${req.body.userId}:`, error);
        res.status(500).json({ message: 'Failed to retrieve general health data.', error: error.message });
    }
});


router.put('/', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;
        const updatedData: GeneralHealthData = req.body;

        if (!userId) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        if (Object.keys(updatedData).length === 0) {
            res.status(400).json({ message: 'No data provided for update.' });
            return;
        }

        const updatedHealthData = await healthDataRepository.updateHealthData(userId, updatedData);

        if (!updatedHealthData) {
            res.status(404).json({ message: 'General health data not found or failed to update.' });
            return;
        }
        res.status(200).json({ message: 'General health data updated successfully', healthData: updatedHealthData });

    } catch (error: any) {
        console.error(`Error updating general health data for user ${req.body.userId}:`, error);
        res.status(500).json({ message: 'Failed to update general health data.', error: error.message });
    }
});


router.delete('/', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        const deleted = await healthDataRepository.deleteHealthData(userId);

        if (!deleted) {
            res.status(404).json({ message: 'General health data not found or failed to delete.' });
            return;
        }
        res.status(200).json({ message: 'General health data deleted successfully.' });

    } catch (error: any) {
        console.error(`Error deleting general health data for user ${req.userId}:`, error);
        res.status(500).json({ message: 'Failed to delete general health data.', error: error.message });
    }
});

export default router;