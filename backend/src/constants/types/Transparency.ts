
/**
 * This is the main type for transparency events in the app.
 * It captures all the necessary information about data collection, processing, and transmission, regulatory compliance, and privacy risks.
 */
export interface TransparencyEvent {
  timestamp?: Date;
  dataSteps: TransparencyEventType[];	 // what processes happened on that data
  dataType: DataType;
  source: DataSource;

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
  
  // Additional context
  userConsent?: boolean; // this is applicable for sensor data collection, for user input, it is always true
  backgroundMode?: boolean; // was this data collected while the app was in the background
  purpose?: string; // why is this data being collected

  // AI generated explanation of the event
  privacyRisk?: PrivacyRisk; // indicates the level of privacy risk associated with the event
  regulatoryCompliance?: RegulatoryCompliance; // indicates the regulatory compliance status of the event
  aiExplanation?: AIExplanation; // AI generated explanation of the event
}

// this is what is sent to the backend
export interface AIPrompt {
  transparencyEvent: TransparencyEvent;
  privacyPolicy: string; // TODO - how to send the privacy policy (or parts of it) to the backend
  userConsentPreferences: UserConsentPreferences;
  regulationFrameworks: RegulatoryFramework[]; // list of regulatory frameworks to check against
  pipedaRegulations?: string; // specific PIPEDA regulations to check against - TODO - determine how this will be sent

  // Future extension for determining risk levels based on user's risk tolerance
  userRiskTolerance?: any;
}

export enum TransparencyEventType {
  DATA_COLLECTION = 'DATA_COLLECTION',
  DATA_STORAGE = 'DATA_STORAGE',
  DATA_TRANSMISSION = 'DATA_TRANSMISSION',
  DATA_PROCESSING = 'DATA_PROCESSING',
  DATA_ENCRYPTION = 'DATA_ENCRYPTION',
  DATA_DELETION = 'DATA_DELETION',
  CONSENT_CHANGE = 'CONSENT_CHANGE'
}

export enum DataType {
  SENSOR_AUDIO = 'SENSOR_AUDIO',
  SENSOR_MOTION = 'SENSOR_MOTION',
  SENSOR_LIGHT = 'SENSOR_LIGHT',
  USER_JOURNAL = 'USER_JOURNAL',
  USER_PROFILE = 'USER_PROFILE',
  GENERAL_SLEEP = 'GENERAL_SLEEP',
  SLEEP_STATISTICS = 'SLEEP_STATISTICS',
  DEVICE_INFO = 'DEVICE_INFO',
  LOCATION = 'LOCATION',
  USAGE_ANALYTICS = 'USAGE_ANALYTICS'
}

export enum DataSource {
  MICROPHONE = 'MICROPHONE',
  ACCELEROMETER = 'ACCELEROMETER',
  LIGHT_SENSOR = 'LIGHT_SENSOR',
  USER_INPUT = 'USER_INPUT',
  DERIVED_DATA = 'DERIVED_DATA', 
  SYSTEM_INFO = 'SYSTEM_INFO',
}

export enum DataDestination {
  ASYNC_STORAGE = 'ASYNC_STORAGE',
  SECURE_STORE = 'SECURE_STORE',
  SQLITE_DB = 'SQLITE_DB',
  MEMORY = 'MEMORY',
  GOOGLE_CLOUD = 'GOOGLE_CLOUD',
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

/**
 * Defaults for transparency events for each data type.
 * These are used to initialize the UI elements before any data is collected.
 */
export const DEFAULT_JOURNAL_TRANSPARENCY_EVENT: TransparencyEvent = {
  dataSteps: [],
  dataType: DataType.USER_JOURNAL,
  source: DataSource.USER_INPUT,
  purpose: "To analyze how your daily mood, habits, sleep goals affects your sleep quality.",

  privacyRisk: PrivacyRisk.LOW,
  regulatoryCompliance: {
    framework: RegulatoryFramework.PIPEDA,
    compliant: true,
    issues: [],
    relevantSections: []
  },
  aiExplanation: {
    summary: '',
    purpose: '',
    risks: [],
    userBenefit: '',
    regulatoryContext: '',
    privacyPolicyLink: '',
    regulationLink: ''
  }
}

export const DEFAULT_LIGHT_SENSOR_TRANSPARENCY_EVENT: TransparencyEvent = {
  dataSteps: [],
  dataType: DataType.SENSOR_LIGHT,
  source: DataSource.LIGHT_SENSOR,
  purpose: 'To understand how the light conditions in your sleep environment may affect your sleep quality ',
  
  privacyRisk: PrivacyRisk.LOW,
  regulatoryCompliance: {
    framework: RegulatoryFramework.PIPEDA,
    compliant: true,
    issues: [],
    relevantSections: []
  },
  aiExplanation: {
    summary: '',
    purpose: '',
    risks: [],
    userBenefit: '',
    regulatoryContext: '',
    privacyPolicyLink: '',
    regulationLink: ''
  }
}

export const DEFAULT_MICROPHONE_TRANSPARENCY_EVENT: TransparencyEvent = {
  dataSteps: [],
  dataType: DataType.SENSOR_AUDIO,
  source: DataSource.MICROPHONE,
  purpose: 'To analyze sleep disturbances such as snoring and talking, as well as understanding the noise level in your sleep environment',

  privacyRisk: PrivacyRisk.LOW, 
  regulatoryCompliance: {
    framework: RegulatoryFramework.PIPEDA,
    compliant: true,
    issues: [],
    relevantSections: []
  },
  aiExplanation: {
    summary: '',
    purpose: '',
    risks: [],
    userBenefit: '',
    regulatoryContext: '',
    privacyPolicyLink: '',
    regulationLink: ''
  }
}

export const DEFAULT_ACCELEROMETER_TRANSPARENCY_EVENT: TransparencyEvent = {
  dataSteps: [],
  dataType: DataType.SENSOR_MOTION,
  source: DataSource.ACCELEROMETER,
  purpose: 'To analyze how your movements during sleep and throughout the day impact sleep quality',

  privacyRisk: PrivacyRisk.LOW,
  regulatoryCompliance: {
    framework: RegulatoryFramework.PIPEDA,
    compliant: true,
    issues: [],
    relevantSections: []
  },
  aiExplanation: {
    summary: '',
    purpose: '',
    risks: [],
    userBenefit: '',
    regulatoryContext: '',
    privacyPolicyLink: '',
    regulationLink: ''
  }
}

export const DEFAULT_STATISTICS_TRANSPARENCY_EVENT: TransparencyEvent = {
  dataSteps: [],
  dataType: DataType.SLEEP_STATISTICS,
  source: DataSource.DERIVED_DATA,
  purpose: 'Provide summaries and actionable insights to help improve your sleep quality',

  privacyRisk: PrivacyRisk.LOW,
  regulatoryCompliance: {
    framework: RegulatoryFramework.PIPEDA,
    compliant: true,
    issues: [],
    relevantSections: []
  },
  aiExplanation: {
    summary: '',
    purpose: '',
    risks: [],
    userBenefit: '',
    regulatoryContext: '',
    privacyPolicyLink: '',
    regulationLink: ''
  }
}

export const DEFAULT_GENERAL_SLEEP_TRANSPARENCY_EVENT: TransparencyEvent = {
  dataSteps: [],
  dataType: DataType.GENERAL_SLEEP,
  source: DataSource.USER_INPUT,
  purpose: 'To understand your current sleep quality and how we can improve it',

  privacyRisk: PrivacyRisk.LOW,
  regulatoryCompliance: {
    framework: RegulatoryFramework.PIPEDA,
    compliant: true,
    issues: [],
    relevantSections: []
  },
  aiExplanation: {
    summary: '',
    purpose: '',
    risks: [],
    userBenefit: '',
    regulatoryContext: '',
    privacyPolicyLink: '',
    regulationLink: ''
  }
}

export type UserConsentPreferences = {
	accelerometerEnabled: boolean,
	lightSensorEnabled: boolean,
	microphoneEnabled: boolean,
  cloudStorageEnabled: boolean,
  policyVersionAgreed: string | null, // version string or null if not agreed
	lastConsentTimestamp: string | null, // ISO format datetime or null if not set

	// These preferences are not set by the user in the first iteration of the prototype
	// but are included for completeness and future extensibility
  analyticsEnabled: boolean,  
  marketingCommunications: boolean, 
  
  // other non-sensitive app preferences
  notificationsEnabled: boolean,
};

// By default, all consent variables are false and the user will have to explicitly consent to all of them
export const DEFAULT_USER_CONSENT_PREFERENCES: UserConsentPreferences = {
	accelerometerEnabled: false,
	lightSensorEnabled: false,
	microphoneEnabled: false,
	cloudStorageEnabled: false,
	policyVersionAgreed: null,
	lastConsentTimestamp: null,

	analyticsEnabled: false,
	marketingCommunications: false,
	
	// other non-sensitive app preferences
	notificationsEnabled: false, 
};

// If real time notifications are implemented, the below interfaces may be used

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
