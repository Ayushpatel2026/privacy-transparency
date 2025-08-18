import { SensorRepository } from './sensors/SensorRepository';
import { SensorServiceConfig } from './sensors/sensorConfig';

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
        if ("useSimulation" in newConfig) {
            this.sensorRepository.setSimulationMode();
        }
        if ("accelerometerEnabled" in newConfig){
            await this.sensorRepository.stopAccelerometerMonitoring();
            await this.sensorRepository.startAccelerometerMonitoring();
        }
        if ("audioEnabled" in newConfig) {
            await this.sensorRepository.stopAudioMonitoring();
            await this.sensorRepository.startAudioMonitoring();
        }
        if ("lightEnabled" in newConfig) {
            await this.sensorRepository.stopLightMonitoring();
            await this.sensorRepository.startLightMonitoring();
        }
    }
}