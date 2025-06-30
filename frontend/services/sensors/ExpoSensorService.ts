import { Audio } from 'expo-av';
import { LightSensor } from 'expo-sensors';
import { Accelerometer } from 'expo-sensors';
import { SensorService } from './SensorService';
import { AccelerometerSensorData, AudioSensorData, LightSensorData } from './sensor-data-types';

/**
 * This class implements the SensorService interface using Expo's sensor APIs.
 * It provides methods to start/stop recording, monitor audio, light, and accelerometer data. 
 */
export class ExpoSensorService extends SensorService {
  private audioRecording: Audio.Recording | null = null;
  private lightSubscription: any = null;
  private accelerometerSubscription: any = null;
  private audioAnalysisInterval: ReturnType<typeof setInterval> | null = null;
  
  async isAudioAvailable(): Promise<boolean> {
    try {
      const audioAvailable = await Audio.requestPermissionsAsync();
      
      return audioAvailable.granted;
    } catch (error) {
      return false;
    }
  }

	async isLightAvailable(): Promise<boolean> {
		try {
			const lightAvailable = await LightSensor.isAvailableAsync();
			return lightAvailable;
		} catch (error) {
			return false;
		}
	}

	async isAccelerometerAvailable(): Promise<boolean> {
			try {
				const accelerometerAvailable = await Accelerometer.isAvailableAsync();
				return accelerometerAvailable;
			} catch (error) {
				return false;
			}
	}
  
  async startAudioMonitoring(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      // Start continuous recording for analysis
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      this.audioRecording = recording;
      
      // Analyze audio periodically
      this.audioAnalysisInterval = setInterval(async () => {
        await this.analyzeAudioData();
      }, this.config.samplingRates.audio * 1000);
      
    } catch (error) {
      this.onError(error as Error, 'audio');
    }
  }
  
  async stopAudioMonitoring(): Promise<void> {
    if (this.audioAnalysisInterval) {
      clearInterval(this.audioAnalysisInterval);
      this.audioAnalysisInterval = null;
    }
    
    if (this.audioRecording) {
      await this.audioRecording.stopAndUnloadAsync();
      this.audioRecording = null;
    }
  }
  
  async startLightMonitoring(): Promise<void> {
    try {
      LightSensor.setUpdateInterval(this.config.samplingRates.light * 1000);
      
      this.lightSubscription = LightSensor.addListener(({ illuminance }) => {
        const lightLevel = this.categorizeLightLevel(illuminance);
        
        const lightData: Omit<LightSensorData, 'id' | 'userId'> = {
          sensorType: 'light',
          timestamp: Date.now(),
          sessionId: this.currentSessionId!,
          date: new Date().toISOString().split('T')[0],
          illuminance,
          lightLevel,
        };
        
        this.onLightData(lightData);
      });
    } catch (error) {
      this.onError(error as Error, 'light');
    }
  }
  
  async stopLightMonitoring(): Promise<void> {
    if (this.lightSubscription) {
      this.lightSubscription.remove();
      this.lightSubscription = null;
    }
  }
  
  async startAccelerometerMonitoring(): Promise<void> {
    try {
      Accelerometer.setUpdateInterval(this.config.samplingRates.accelerometer * 1000);
      
      this.accelerometerSubscription = Accelerometer.addListener(({ x, y, z }) => {
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const movementIntensity = this.categorizeMovement(magnitude);
        
        const accelData: Omit<AccelerometerSensorData, 'id' | 'userId'> = {
          sensorType: 'accelerometer',
          timestamp: Date.now(),
          sessionId: this.currentSessionId!,
          date: new Date().toISOString().split('T')[0],
          x, y, z, magnitude,
          movementIntensity,
        };
        
        this.onAccelerometerData(accelData);
      });
    } catch (error) {
      this.onError(error as Error, 'accelerometer');
    }
  }
  
  async stopAccelerometerMonitoring(): Promise<void> {
    if (this.accelerometerSubscription) {
      this.accelerometerSubscription.remove();
      this.accelerometerSubscription = null;
    }
  }
  
  // ===== HELPER METHODS =====
  
  private async analyzeAudioData(): Promise<void> {
    // This would need actual audio processing library
    // For now, simulate audio analysis
    const mockDecibels = 30 + Math.random() * 40; // 30-70 dB range
    const mockPeak = mockDecibels + Math.random() * 20;
    
    const audioData: Omit<AudioSensorData, 'id' | 'userId'> = {
      sensorType: 'audio',
      timestamp: Date.now(),
      sessionId: this.currentSessionId!,
      date: new Date().toISOString().split('T')[0],
      averageDecibels: mockDecibels,
      peakDecibels: mockPeak,
      frequencyBands: {
        low: Math.random() * 40,
        mid: Math.random() * 50,
        high: Math.random() * 30,
      },
      snoreDetected: Math.random() > 0.9, // 10% chance
      ambientNoiseLevel: this.categorizeNoiseLevel(mockDecibels),
    };
    
    this.onAudioData(audioData);
  }
  
  private categorizeLightLevel(lux: number): 'dark' | 'dim' | 'moderate' | 'bright' {
    if (lux < 1) return 'dark';
    if (lux < 10) return 'dim';
    if (lux < 100) return 'moderate';
    return 'bright';
  }
  
  private categorizeMovement(magnitude: number): 'still' | 'light' | 'moderate' | 'active' {
    if (magnitude < 0.1) return 'still';
    if (magnitude < 0.5) return 'light';
    if (magnitude < 1.0) return 'moderate';
    return 'active';
  }
  
  private categorizeNoiseLevel(decibels: number): 'quiet' | 'moderate' | 'loud' | 'very_loud' {
    if (decibels < 30) return 'quiet';
    if (decibels < 50) return 'moderate';
    if (decibels < 70) return 'loud';
    return 'very_loud';
  }
}