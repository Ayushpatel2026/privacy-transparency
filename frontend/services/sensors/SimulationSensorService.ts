import { AccelerometerSensorData, AudioSensorData, LightSensorData } from "../../constants/types/SensorData";
import { SensorService } from "./SensorService";

/**
 * This is the simulated sensor service. 
 * It is always available (does not need OS permissions) and can be used for testing and simulations. 
 */
export class SimulationSensorService extends SensorService {
  private intervals: ReturnType<typeof setInterval>[] = []; 
  
  async isAudioAvailable(): Promise<boolean> {
    return true;
  }

	async isLightAvailable(): Promise<boolean> {
	  return true;
	}

	async isAccelerometerAvailable(): Promise<boolean> {
		return true;
	}
  
  async startAudioMonitoring(): Promise<void> {
    const interval = setInterval(() => {
      this.generateMockAudioData();
    }, this.config.samplingRates.audio * 1000);
    
    this.intervals.push(interval);
  }
  
  async startLightMonitoring(): Promise<void> {
    const interval = setInterval(() => {
      this.generateMockLightData();
    }, this.config.samplingRates.light * 1000);
    
    this.intervals.push(interval);
  }
  
  async startAccelerometerMonitoring(): Promise<void> {
    console.log("Starting simulated accelerometer monitoring with sampling rate:", this.config.samplingRates.accelerometer);
    const interval = setInterval(() => {
      this.generateMockAccelerometerData();
    }, this.config.samplingRates.accelerometer * 1000);
    
    this.intervals.push(interval);
  }
  
  private clearAllIntervals(): void {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }

  async stopAudioMonitoring(): Promise<void> {
    this.clearAllIntervals();
  }
  
  async stopLightMonitoring(): Promise<void> {
    this.clearAllIntervals();
  }
  
  async stopAccelerometerMonitoring(): Promise<void> {
    this.clearAllIntervals();
  }
  
  // ===== MOCK DATA GENERATORS =====
  
  private generateMockAudioData(): void {
    const hour = new Date().getHours();
    const isNightTime = hour >= 22 || hour <= 6;
    
    // Simulate quieter audio at night
    const baseDecibels = isNightTime ? 25 : 35;
    const mockDecibels = baseDecibels + Math.random() * 30;
    
    const audioData: Omit<AudioSensorData, 'id' | 'userId'> = {
      sensorType: 'audio',
      timestamp: Date.now(),
      sessionId: this.currentSessionId!,
      date: new Date().toISOString().split('T')[0],
      averageDecibels: mockDecibels,
      peakDecibels: mockDecibels + Math.random() * 15,
      frequencyBands: {
        low: Math.random() * 40,
        mid: Math.random() * 50,
        high: Math.random() * 30,
      },
      snoreDetected: Math.random() > 0.85,
      ambientNoiseLevel: this.categorizeNoiseLevel(mockDecibels),
    };
    
    this.onAudioData(audioData);
  }
  
  private generateMockLightData(): void {
    const hour = new Date().getHours();
    let mockLux: number;
    
    // Simulate realistic light patterns
    if (hour >= 22 || hour <= 6) {
      mockLux = Math.random() * 5; // Very low light at night
    } else if (hour >= 7 && hour <= 9) {
      mockLux = Math.random() * 200; // Morning light
    } else {
      mockLux = Math.random() * 500; // Daytime
    }
    
    const lightData: Omit<LightSensorData, 'id' | 'userId'> = {
      sensorType: 'light',
      timestamp: Date.now(),
      sessionId: this.currentSessionId!,
      date: new Date().toISOString().split('T')[0],
      illuminance: mockLux,
      lightLevel: this.categorizeLightLevel(mockLux),
    };
    
    this.onLightData(lightData);
  }
  
  private generateMockAccelerometerData(): void {
    // Simulate sleep movement patterns
    const isAsleep = Math.random() > 0.7; // 70% chance of being asleep
    const baseMovement = isAsleep ? 0.05 : 0.3;
    
    const x = (Math.random() - 0.5) * baseMovement;
    const y = (Math.random() - 0.5) * baseMovement;  
    const z = (Math.random() - 0.5) * baseMovement;
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    
    const accelData: Omit<AccelerometerSensorData, 'id' | 'userId'> = {
      sensorType: 'accelerometer',
      timestamp: Date.now(),
      sessionId: this.currentSessionId!,
      date: new Date().toISOString().split('T')[0],
      x, y, z, magnitude,
      movementIntensity: this.categorizeMovement(magnitude),
    };
    
    this.onAccelerometerData(accelData);
  }
  
  // Helper methods (same as ExpoSensorService)
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