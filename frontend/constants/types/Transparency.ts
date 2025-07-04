import { UserConsentPreferences } from "./UserConsentPreferences";

export interface TransparencyEvent {
  id: string;
  timestamp: Date;
  dataSteps: TransparencyEventType[];	 // what processes happened on that data
  dataType: DataType;
  source: DataSource;
  destination?: DataDestination;
  info: Eventdata;  // information about the event
}

// this type is what comes back from the backend (LLM API)
export interface TransparencyEventWithExplanation extends TransparencyEvent {
  privacyRisk: PrivacyRisk; // indicates the level of privacy risk associated with the event
  regulatoryCompliance: RegulatoryCompliance; // indicates the regulatory compliance status of the event
  aiExplanation: AIExplanation; // AI generated explanation of the event
}

// this is what is sent to the backend
export interface AIPrompt {
  transparencyEvent: TransparencyEvent;
  privacyPolicy: string; // TODO - how to send the privacy policy (or parts of it) to the backend
  userConsentPreferences: UserConsentPreferences;

  // Future extension for determining risk levels based on user's risk tolerance
  userRiskTolerance: any;
}

export enum TransparencyEventType {
  DATA_COLLECTION = 'DATA_COLLECTION',
  DATA_STORAGE = 'DATA_STORAGE',
  DATA_TRANSMISSION = 'DATA_TRANSMISSION',
  DATA_PROCESSING = 'DATA_PROCESSING',
  CONSENT_CHANGE = 'CONSENT_CHANGE'
}

export enum DataType {
  SENSOR_AUDIO = 'SENSOR_AUDIO',
  SENSOR_MOTION = 'SENSOR_MOTION',
  SENSOR_LIGHT = 'SENSOR_LIGHT',
  USER_JOURNAL = 'USER_JOURNAL',
  USER_PROFILE = 'USER_PROFILE',
  GENERAL_SLEEP = 'GENERAL_SLEEP',
  DEVICE_INFO = 'DEVICE_INFO',
  LOCATION = 'LOCATION',
  USAGE_ANALYTICS = 'USAGE_ANALYTICS'
}

export enum DataSource {
  MICROPHONE = 'MICROPHONE',
  ACCELEROMETER = 'ACCELEROMETER',
  LIGHT_SENSOR = 'LIGHT_SENSOR',
  USER_INPUT = 'USER_INPUT',
  SYSTEM_INFO = 'SYSTEM_INFO',
}

export enum DataDestination {
  ASYNC_STORAGE = 'ASYNC_STORAGE',
  SECURE_STORE = 'SECURE_STORE',
  SQLITE_DB = 'SQLITE_DB',
  MEMORY = 'MEMORY',
  BACKEND_API = 'BACKEND_API',
  FIRESTORE = 'FIRESTORE',
  THIRD_PARTY = 'THIRD_PARTY'
}

export enum EncryptionMethod {
  NONE = 'NONE',
  AES_256 = 'AES_256',
  JWT = 'JWT',
  DEVICE_KEYCHAIN = 'DEVICE_KEYCHAIN'
}

export enum PrivacyRisk {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum RegulatoryFramework {
	// This prototype only focuses on PIPEDA but others are included for future extensibility
  PIPEDA = 'PIPEDA',
  PHIPA = 'PHIPA',
  GDPR = 'GDPR'
}

export interface RegulatoryCompliance {
  framework: RegulatoryFramework;
  compliant: boolean;
  issues?: string[];
  relevantSections?: string[];
}

export interface Eventdata {
  // sensor data collection specific
  sensorType?: string;
  samplingRate?: number;
  duration?: number;
  
  // Storage specific
  encryptionMethod?: EncryptionMethod;
  storageLocation?: DataDestination;
  
  // Transmission specific
  endpoint?: string;
  protocol?: 'HTTP' | 'HTTPS' | 'WSS';
  encrypted?: boolean;
  
  // Additional context
  userConsent?: boolean;
  backgroundMode?: boolean; // was this data collected while the app was in the background
  purpose?: string; // why is this data being collected
}

export interface AIExplanation {
  summary: string;
  purpose: string;
  risks: string[];
  userBenefit: string;
  regulatoryContext: string;
  privacyPolicyLink: string;
  regulationLink: string;
}

// this config is used to determine what transparency features are enabled in the app
export interface TransparencySettings {
  realTimeNotifications: boolean;
  privacyDashboard: boolean;
  uiElementsVisible: boolean;
  aiExplanations: boolean;
  riskAssessment: boolean;
  regulatoryChecks: boolean;
}

export const DEFAULT_TRANSPARENCY_SETTINGS: TransparencySettings = {
	realTimeNotifications: false,
	privacyDashboard: false,
	uiElementsVisible: true,
	aiExplanations: true,
	riskAssessment: true,
	regulatoryChecks: true
}

// If real time notifications are implemented, the below interfaces will be used

export interface TransparencyNotification {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  eventId: string;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
}
