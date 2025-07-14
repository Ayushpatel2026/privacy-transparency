import { Colors } from "@/constants/Colors";
import { PrivacyRisk, TransparencyEvent } from "@/constants/types/Transparency";

// Helper function to get privacy risk color based on the risk level
export const getPrivacyRiskColor = (risk: PrivacyRisk) => {
    switch (risk) {
        case PrivacyRisk.HIGH:
            return Colors.tooltipRed;
        case PrivacyRisk.MEDIUM:
            return Colors.tooltipYellow;
        case PrivacyRisk.LOW:
            return Colors.tooltipGreen;
        default:
            return Colors.tooltipGreen;
    }
};

// Helper function to get privacy risk icon
export const getPrivacyRiskIcon = (risk: PrivacyRisk) => {
    switch (risk) {
        case PrivacyRisk.HIGH:
            return "privacy-high"
        case PrivacyRisk.MEDIUM:
            return "privacy-medium"
        case PrivacyRisk.LOW:
            return "privacy-low"
        default:
            return "privacy-low"
    }
};

// Function to get the appropriate privacy risk icon for a page based on all risks on that page
export const getPrivacyRiskIconForPage = (risks: PrivacyRisk[]) => {
    if (risks.includes(PrivacyRisk.HIGH)) {
        return "privacy-high";
    } else if (risks.includes(PrivacyRisk.MEDIUM)) {
        return "privacy-medium";
    } else {
        return "privacy-low";
    }
}

// Function to get the appropriate privacy risk color for a page based on all risks on that page
export const getPrivacyRiskColorForPage = (risks: PrivacyRisk[]) => {
    if (risks.includes(PrivacyRisk.HIGH)) {
        return Colors.tooltipRed;
    } else if (risks.includes(PrivacyRisk.MEDIUM)) {
        return Colors.tooltipYellow;
    } else {
        return Colors.tooltipGreen;
    }
}

// Helper function to format violations detected
export const formatViolationsDetected = (transparency: TransparencyEvent) => {
    if (!transparency.regulatoryCompliance?.issues || transparency.regulatoryCompliance.issues.length === 0) {
        return "No privacy violations detected";
    }
    return `${transparency.aiExplanation?.privacyRisks} ${transparency.aiExplanation?.regulatoryContext}`;
};