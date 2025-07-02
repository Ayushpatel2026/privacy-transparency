import { Router, Request, Response } from 'express';
import { SensorData, AudioSensorData, LightSensorData, AccelerometerSensorData } from '../../constants/types';
import verifyToken from '../../middleware/auth';
import { RequestHandler } from 'express';
import { FirestoreSensorDataRepository } from '../../repositories/firestore/FirestoreSensorDataRepository';
import { SensorDataRepository } from '../../repositories/SensorDataRepository';

const router = Router();
const sensorDataRepository: SensorDataRepository = new FirestoreSensorDataRepository();


router.post('/', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {
        console.log('Creating sensor reading with body:', req.body);
        const userId = req.userId; 
        const { timestamp, date, sensorType, ...sensorSpecificData } = req.body;

        // Basic validation for common required fields
        if (!userId || !timestamp || !date || !sensorType) {
            res.status(400).json({ message: 'Missing required fields: userId, timestamp, date, and sensorType.' });
            return;
        }

        // Construct the sensor data object based on sensorType
        const newSensorData: Omit<SensorData, 'id'> = req.body;

        // I DO NOT THINK THIS IS NEEDED ANYMORE
        // switch (sensorType) {
        //     case 'audio':
        //         const { averageDecibels, peakDecibels, frequencyBands, audioClipUri, snoreDetected, ambientNoiseLevel } = sensorSpecificData;
        //         if (averageDecibels === undefined || peakDecibels === undefined || frequencyBands === undefined || snoreDetected === undefined || ambientNoiseLevel === undefined) {
        //             res.status(400).json({ message: 'Missing required fields for audio sensor data.' });
        //             return;
        //         }
        //         newSensorData = {
        //             userId,
        //             timestamp,
        //             date,
        //             sensorType: 'audio',
        //             averageDecibels,
        //             peakDecibels,
        //             frequencyBands,
        //             audioClipUri,
        //             snoreDetected,
        //             ambientNoiseLevel,
        //         } as Omit<AudioSensorData, 'id'>;
        //         break;
        //     case 'light':
        //         const { illuminance, lightLevel } = sensorSpecificData;
        //         if (illuminance === undefined || lightLevel === undefined) {
        //             return res.status(400).json({ message: 'Missing required fields for light sensor data.' });
        //         }
        //         newSensorData = {
        //             userId,
        //             timestamp,
        //             date,
        //             sensorType: 'light',
        //             illuminance,
        //             lightLevel,
        //         } as Omit<LightSensorData, 'id'>;
        //         break;
        //     case 'accelerometer':
        //         const { x, y, z, magnitude, movementIntensity } = sensorSpecificData;
        //         if (x === undefined || y === undefined || z === undefined || magnitude === undefined || movementIntensity === undefined) {
        //             return res.status(400).json({ message: 'Missing required fields for accelerometer sensor data.' });
        //         }
        //         newSensorData = {
        //             userId,
        //             timestamp,
        //             date,
        //             sensorType: 'accelerometer',
        //             x,
        //             y,
        //             z,
        //             magnitude,
        //             movementIntensity,
        //         } as Omit<AccelerometerSensorData, 'id'>;
        //         break;
        //     default:
        //         return res.status(400).json({ message: `Unknown sensor type: ${sensorType}` });
        // }

        const createdSensorReading = await sensorDataRepository.createSensorReading(newSensorData);
        console.log('Sensor reading created:', createdSensorReading);
        res.status(201).json({ message: 'Sensor reading created successfully', sensorReading: createdSensorReading });

    } catch (error: any) {
        console.error('Error creating sensor reading:', error);
        res.status(500).json({ message: 'Failed to create sensor reading.', error: error.message });
    }
});


router.get('/', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {
        const userID = req.userId; 

        if (!userID) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        const sensorReadings = await sensorDataRepository.getSensorReadingsByUserId(userID);
        res.status(200).json({ sensorReadings });
    } catch (error: any) {
        console.error('Error fetching sensor readings:', error);
        res.status(500).json({ message: 'Failed to retrieve sensor readings.', error: error.message });
    }
});


router.get('/:id', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {
        const userID = req.userId;
        const { id } = req.params; 

        if (!userID) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        const sensorReading = await sensorDataRepository.getSensorReadingById(userID, id);

        if (!sensorReading) {
            res.status(404).json({ message: 'Sensor reading not found or unauthorized.' });
            return;
        }
        res.status(200).json({ sensorReading });
    } catch (error: any) {
        console.error(`Error fetching sensor reading ${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to retrieve sensor reading.', error: error.message });
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

        const sensorReading = await sensorDataRepository.getSensorReadingsByDate(userID, date);

        if (!sensorReading) {
            res.status(404).json({ message: `No sensor reading found for user ${userID} on date ${date}.` });
            return;
        }
        res.status(200).json({ sensorReading });
    } catch (error: any) {
        console.error(`Error fetching sensor reading for user ${req.userId} on date ${req.params.date}:`, error);
        res.status(500).json({ message: 'Failed to retrieve sensor reading by date.', error: error.message });
    }
});

router.delete('/:id', verifyToken as RequestHandler, async (req: Request, res: Response) => {
    try {
        const userID = req.userId;
        const { id } = req.params;

        if (!userID) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }

        const deleted = await sensorDataRepository.deleteSensorReading(userID, id);

        if (!deleted) {
            res.status(404).json({ message: 'Sensor reading not found or unauthorized to delete.' });
            return;
        }
        // No content (204) for successful deletion
        res.status(204).send();

    } catch (error: any) {
        console.error(`Error deleting sensor reading ${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to delete sensor reading.', error: error.message });
    }
});

export default router;