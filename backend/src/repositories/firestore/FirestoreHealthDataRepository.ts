import { HealthDataRepository } from '../HealthDataRepository';
import { GeneralHealthData } from '../../constants/types';
import { db } from '../../config/firebaseConfig';
import { DocumentData, DocumentSnapshot } from 'firebase-admin/firestore';

export class FirestoreHealthDataRepository implements HealthDataRepository {
    private collectionName = 'healthData';

    private mapDocToHealthData(doc: DocumentSnapshot<DocumentData>): GeneralHealthData {
        const data = doc.data();
        if (!data) {
            throw new Error('Document data is undefined');
        }
        return {
            userId: data.userId,
            currentSleepDuration: data.currentSleepDuration,
            snoring: data.snoring,
            tirednessFrequency: data.tirednessFrequency,
            daytimeSleepiness: data.daytimeSleepiness,
        };
    }

    async createHealthData(healthData: GeneralHealthData): Promise<GeneralHealthData> {
        try {
            // Basic validation - need at least userId to create health data
            if (!healthData.userId) {
                throw new Error('User ID is required to create health data.');
            }

            const docRef = await db.collection(this.collectionName).add({
                ...healthData,
                createdAt: new Date(),
            });

            if (docRef.id) {
                const newHealthData: GeneralHealthData = {
                    ...healthData,
                }
                console.log(`Health data created for user: ${newHealthData.userId}`);
                return newHealthData;
            }
            throw new Error('Failed to create health data.');

        } catch (error: any) {
            console.error('Error creating health data:', error);
            throw new Error(`Failed to create health data in Firestore: ${error.message}`);
        }
    }

    async getHealthDataById(userId: string): Promise<GeneralHealthData | null> {
        try {
            const querySnapshot = await db.collection(this.collectionName).where('userId', '==', userId).get();
            if (querySnapshot.empty) {
                return null; // No health data found for this user
            }
            const doc = querySnapshot.docs[0];
            return this.mapDocToHealthData(doc);
        } catch (error: any) {
            console.error('Error fetching health data:', error);
            throw new Error(`Failed to fetch health data from Firestore: ${error.message}`);
        }
    }

    async updateHealthData(userId: string, healthData: Omit<GeneralHealthData, 'userId'>): Promise<GeneralHealthData | null> {
        try {
            if (!userId) {
                throw new Error('User ID is required to update health data.');
            }

            const querySnapshot = await db.collection(this.collectionName).where('userId', '==', userId).get();
            if (querySnapshot.empty) {
                return null; // No health data found for this user
            }

            const doc = querySnapshot.docs[0];
            await doc.ref.update({
                ...healthData,
                updatedAt: new Date(),
            });

            return this.mapDocToHealthData(doc);
        } catch (error: any) {
            console.error('Error updating health data:', error);
            throw new Error(`Failed to update health data in Firestore: ${error.message}`);
        }
    }

    async deleteHealthData(userId: string): Promise<boolean> {
        try {
            const querySnapshot = await db.collection(this.collectionName).where('userId', '==', userId).get();
            if (querySnapshot.empty) {
                console.warn(`No health data found for user ${userId} to delete.`);
                return false; // No health data found for this user
            }

            const doc = querySnapshot.docs[0];
            await doc.ref.delete();
            console.log(`Health data deleted for user: ${userId}`);
            return true;
        } catch (error: any) {
            console.error('Error deleting health data:', error);
            throw new Error(`Failed to delete health data from Firestore: ${error.message}`);
        }
    }
}