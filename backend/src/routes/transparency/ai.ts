import { Router, Request, Response, RequestHandler } from 'express';
import verifyToken from '../../middleware/auth';
import { GeminiLLMService } from '../../llm/GeminiLLMService';
import { createPrivacyAnalysisPrompt } from '../../llm/prompts';

const router = Router();

router.post('/', verifyToken as RequestHandler, async (req : Request, res : Response) => {
  try {

    const { transparencyEvent, privacyPolicy, userConsentPreferences, regulationFrameworks, pipedaRegulations } = req.body;

    // Basic validation of the incoming data
    if (!transparencyEvent || !privacyPolicy || !userConsentPreferences || !regulationFrameworks) {
      res.status(400).json({ message: 'Missing required fields in the request body.' });
      return;
    }

    const llmService = new GeminiLLMService();

    const prompt = createPrivacyAnalysisPrompt(
      transparencyEvent,
      privacyPolicy,
      userConsentPreferences,
      regulationFrameworks,
      pipedaRegulations
    );

    // Call the LLM service to analyze privacy risks
    const updatedTransparencyEvent = await llmService.analyzePrivacyRisks(
      transparencyEvent,
      prompt
    );

    res.status(200).json({ transparencyEvent: updatedTransparencyEvent });

  } catch (error : any) {
    console.error('Error analyzing privacy risks:', error);
    if (error.message.includes('Authentication token missing')) {
      res.status(401).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Internal server error during privacy risk analysis.', error: error.message });
  }
});

export default router;