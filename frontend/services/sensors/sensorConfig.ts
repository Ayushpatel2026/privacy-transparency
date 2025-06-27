/**
 * This is a sample configuration interface for the SensorService:
 * This allows the Sensor Service to be configured with various options
 * 
 * This is subject to change as more implementation details are worked out. 
 */
export interface SensorServiceConfig {
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