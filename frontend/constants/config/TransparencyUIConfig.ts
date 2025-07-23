/**
 * This is a sample configuration interface for the Transparency UI:
 * This allows use to control the visibility of the transparency tooltips vs the Privacy Page UI for each screen
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