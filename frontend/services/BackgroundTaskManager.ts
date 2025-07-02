import * as TaskManager from 'expo-task-manager';
import { SensorRepository } from './sensors/SensorRepository';
import { SensorServiceConfig } from './sensors/sensorConfig';

const ACCELEROMETER_BACKGROUND_TASK = 'ACCELEROMETER_BACKGROUND_TASK';

/**
 * TODO - Right now this does not work in the background
 * But in the future, it will be used as a middle man between the main app and the SensorRepository, managing background task of sensor data collection.
 */
export class SensorBackgroundTaskManager {
    private sensorRepository: SensorRepository;

    constructor(sensorRepository: SensorRepository) {
        this.sensorRepository = sensorRepository;
    }
    
    public registerAccelerometer() {
        console.log("Defining accelerometer background task");
        this.sensorRepository.startAccelerometerMonitoring();
        console.log('Accelerometer background task started');
    }

    public registerLightSensor(){
        console.log("Defining light sensor background task");
        this.sensorRepository.startLightMonitoring();
        console.log('Light sensor background task started');
    }

    public registerAudioSensor() {
        console.log("Defining audio sensor background task");
        this.sensorRepository.startAudioMonitoring();
        console.log('Audio sensor background task started');
    }

    public async updateConfig(newConfig: Partial<SensorServiceConfig>) {
        console.log("Updating sensor service config with:", newConfig);
        this.sensorRepository.updateConfig(newConfig);
        await this.sensorRepository.stopAllSensors();
        this.sensorRepository.setSimulationMode();
        await this.sensorRepository.startAllSensors();
    }
}