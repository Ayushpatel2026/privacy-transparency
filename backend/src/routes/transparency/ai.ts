import { Router, Request, Response, RequestHandler } from 'express';
import verifyToken from '../../middleware/auth';
import { RegulatoryFramework, TransparencyEvent, UserConsentPreferences } from '../../constants/types/Transparency';
import { GeminiLLMService } from '../../llm/GeminiLLMService';

const router = Router();

function createPrivacyAnalysisPrompt(
  transparencyEvent: TransparencyEvent,
  privacyPolicy: string,
  userConsentPreferences: UserConsentPreferences,
  regulationFrameworks: RegulatoryFramework[],
  pipedaRegulations?: string
): string {
  return `You are a privacy compliance expert analyzing a sleep tracking application's data handling practices. 

**TASK**: Analyze the following transparency event for privacy risks and regulatory compliance.

**TRANSPARENCY EVENT**:
${JSON.stringify(transparencyEvent, null, 2)}

**PRIVACY POLICY**:
${privacyPolicy}

**USER CONSENT PREFERENCES**:
${JSON.stringify(userConsentPreferences, null, 2)}

**REGULATORY FRAMEWORKS TO CONSIDER**:
${regulationFrameworks.join(', ')}

${pipedaRegulations ? `**SPECIFIC PIPEDA REGULATIONS**:\n${pipedaRegulations}\n` : ''}

**ANALYSIS INSTRUCTIONS**:
1. Evaluate if the data collection aligns with the stated purpose
2. Check if proper user consent was obtained based on preferences
3. Assess compliance with the specified regulatory frameworks and provided regulations only. DO NOT use any other regulations.
4. Identify potential privacy risks and their severity

**RISK ASSESSMENT CRITERIA**:
- **HIGH RISK**: Clear violation of regulations, privacy policy, or user consent; unauthorized data collection; insecure storage/transmission
- **MEDIUM RISK**: Technically compliant but suboptimal practices; vague purposes; excessive data collection; third-party sharing concerns
- **LOW RISK**: Fully compliant with minimal privacy concerns; clear purpose; proper consent; secure handling

**REQUIRED OUTPUT FORMAT** (respond with valid JSON only, keep explanations under 30 words each):
{
  "privacyRisk": "HIGH" | "MEDIUM" | "LOW",
  "regulatoryCompliance": {
    "framework": "PIPEDA",
    "compliant": true | false,
    "issues": "description of compliance issues",
    "relevantSections": ["section reference 1", "section reference 2"]
  },
  "aiExplanation": {
    "why": "brief explanation of why this data is collected and what benefits it provides to the user",
    "storage": "where the data is stored and how it is protected",
    "access": "who has access to the data",
    "privacyRisks": "summary of privacy risks associated with this data",
    "regulatoryContext": "Relevant regulatory considerations associated with this data collection",
    "privacyPolicyLink": "Return the id of the most relevant privacy policy section",
    "regulationLink": "Return the id of the most relevant PIPEDA principle"
  }
}
Provide your analysis in clear, consise, user-friendly language that a non-technical person can understand.`;
}

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