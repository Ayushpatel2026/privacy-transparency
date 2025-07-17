import { TransparencyEvent } from '../constants/types/Transparency';

/**
 * Defines the contract for any Large Language Model (LLM) service.
 * This interface ensures that all LLM implementations adhere to a common
 * method for analyzing privacy risks.
 */
export interface LLMService {
  analyzePrivacyRisks(
    transparencyEvent: TransparencyEvent,
    prompt: string
  ): Promise<TransparencyEvent>;
}