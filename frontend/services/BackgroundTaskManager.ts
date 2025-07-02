import * as TaskManager from 'expo-task-manager';
import { SensorRepository } from './sensors/SensorRepository';

const ACCELEROMETER_BACKGROUND_TASK = 'ACCELEROMETER_BACKGROUND_TASK';

/**
 * TODO - Right now this does not work in the backgroound
 * But in the future, 
 */
export class SensorBackgroundTaskManager {
    constructor() {

    }
    
    public registerAccelerometer() {
        console.log("Defining accelerometer background task");
        const sensorRepository = SensorRepository.getInstance();
        sensorRepository.startAccelerometerMonitoring();
        console.log('Accelerometer background task started');
    }

    public registerLightSensor(){
        console.log("Defining light sensor background task");
        const sensorRepository = SensorRepository.getInstance();
        sensorRepository.startLightMonitoring();
        console.log('Light sensor background task started');
    }

    public registerAudioSensor() {
        console.log("Defining audio sensor background task");
        const sensorRepository = SensorRepository.getInstance();
        sensorRepository.startAudioMonitoring();
        console.log('Audio sensor background task started');
    }
}