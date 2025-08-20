/**
 * This is a configuration interface for the Transparency UI:
 * This allows us to control the visibility of the transparency tooltips vs the Privacy Page UI for each screen
 */
export interface TransparencyUIConfig {
  journalTooltipEnabled: boolean;
  sleepPageTooltipEnabled: boolean;
  sleepModeTooltipEnabled: boolean;
}

export const TRANSPARENCY_UI_CONFIG: TransparencyUIConfig = {
  journalTooltipEnabled: true,
  sleepPageTooltipEnabled: true,
  sleepModeTooltipEnabled: true,
};

export const IN_DEMO_MODE = false;

// This is is used for demo purposes, allowing us to override actual consent settings for demos
// this config is only applied when IN_DEMO_MODE is true
export const transparencyDemoConfig = {
  collectAudio: true,
  collectLight: true,
  collectAccelerometer: true,
  encryptedAtRest: true,
  encryptedInTransit: true
}