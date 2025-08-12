import WORD_FREQUENCIES from "../../../word_frequencies.json";

const frequencies: { [key: string]: number } = WORD_FREQUENCIES;

/**
 * Calculate Word Familiarity Score based on corpus frequency
 * Returns a zipf value between 1 and 7, where 1 is very rare and 7 is very common
 * 
 * @param text - Input text to analyze
 * @returns Familiarity score (1-7, where 7 = most familiar)
 */
export function analyzeWordFrequency(text: string): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }

  // Clean and tokenize text
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length === 0) {
    return 0;
  }
  
  // Calculate weighted average frequency
  let totalWeightedFreq = 0;
  let totalWords = 0;
  
  for (const word of words) {
    // Get frequency from database (default to very low frequency for unknown words)
    const frequency = frequencies[word] || 0.1;
    totalWeightedFreq += frequency;
    totalWords++;
  }
  
  if (totalWords === 0) {
    return 0;
  }

  // return average frequency as a zipf value
  const averageFrequency = totalWeightedFreq / totalWords;
	return averageFrequency;
}