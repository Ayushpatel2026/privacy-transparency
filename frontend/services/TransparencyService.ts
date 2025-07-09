import { AIExplanation, TransparencySettings } from '@/constants/types/Transparency';
import { TransparencyEvent } from '@/constants/types/Transparency';

/**
 * TODO - this service needs to provide methods to create a transparency event as data collection, transmission and storage are happening
 * And then send an AIPrompt to the backend, process the backend response, and update the appropriate UI elements
 * 
 * This service is a work in progress and more implementation details are being worked out. 
 */
export class TransparencyService {
  // TODO - implement something to prevent too many calls to the backend (especially for the continous sensor data collection)
  private events: TransparencyEvent[] = [];

  // Singleton
  private static instance: TransparencyService;

  private constructor() {
    
  }

  public static getInstance(): TransparencyService {
    if (!TransparencyService.instance) {
      TransparencyService.instance = new TransparencyService();
    }
    return TransparencyService.instance;
  }

  async analyzePrivacyRisks(transparencyEvent : TransparencyEvent){

  }
}