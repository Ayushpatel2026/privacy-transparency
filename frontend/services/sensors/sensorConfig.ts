/**
 * This is a sample configuration interface for the SensorService:
 * This allows the Sensor Service to be configured with various options
 * 
 * This is subject to change as more implementation details are worked out. 
 */
export interface SensorServiceConfig {
  useSimulation: boolean; // Use simulation data instead of real sensors
  audioEnabled: boolean;
  lightEnabled: boolean;
  accelerometerEnabled: boolean;
  samplingRates: {
    audio: number; // seconds between readings
    light: number;
    accelerometer: number;
  };
  audioProcessing: {
    enableSnoreDetection: boolean;
    saveAudioClips: boolean;
    clipDuration: number; // seconds
  };
}

export const DEFAULT_SENSOR_SERVICE_CONFIG: SensorServiceConfig = {
  useSimulation: false,
  audioEnabled: false,
  lightEnabled: false,
  accelerometerEnabled: false,
  samplingRates: {
    audio: 5, // every 5 seconds
    light: 10, // every 10 seconds
    accelerometer: 10, // every 10 seconds
  },
  audioProcessing: {
    enableSnoreDetection: true,
    saveAudioClips: true,
    clipDuration: 30, // 30 seconds
  },
};