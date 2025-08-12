import 'dotenv/config';

import { RegulatoryFramework, TransparencyEvent, UserConsentPreferences } from '../constants/types/Transparency';
import { GeminiLLMService } from '../llm/GeminiLLMService';
import { testEvents } from './test-events';
import privacyPolicyData from '../../privacyPolicyData.json';
import privacyRegulations from '../../privacyRegulations.json';
import { createPrivacyAnalysisPrompt } from './prompts';
import { evalReadability } from './readability/evalReadability';
import { NLIEvaluator } from './accuracy/nliEvaluator';
import * as fs from 'fs';
import * as path from 'path';

// Single instruction focusing on readability
const instruction = "Provide your analysis in clear, concise, user-friendly language that a non-technical person can understand. Replace complex legal and technical jargon with simple explanations that the average middle schooler can grasp.";

const promptLength: number[] = [15, 20, 25, 30, 40, 50];

interface ExperimentResult {
    eventKey: string;
    targetLength: number;
    actualWordCount: number;
    nliDataCollection: number;
    nliPrivacyExplanation: number;
    nliAverageScore: number;
    fleschKincaid: number;
    wordFrequencyScore: number;
}

function createCSVHeaders(): string {
    return 'EventKey,TargetLength,ActualWordCount,NLI_DataCollection,NLI_PrivacyExplanation,NLI_AverageScore,FleschKincaid,WordFrequencyScore';
}

function resultToCSVRow(result: ExperimentResult): string {
    return [
        result.eventKey,
        result.targetLength,
        result.actualWordCount.toFixed(1),
        isNaN(result.nliDataCollection) ? 'N/A' : result.nliDataCollection.toFixed(3),
        isNaN(result.nliPrivacyExplanation) ? 'N/A' : result.nliPrivacyExplanation.toFixed(3),
        isNaN(result.nliAverageScore) ? 'N/A' : result.nliAverageScore.toFixed(3),
        result.fleschKincaid.toFixed(2),
        result.wordFrequencyScore.toFixed(2)
    ].join(',');
}

function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

async function runEval() {
    const llmService = new GeminiLLMService();
    const nliEvaluator = await NLIEvaluator.create();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rawDataFileName = `readability_length_exp_raw_${timestamp}.csv`;
    const rawDataPath = path.join(__dirname, 'test-results', rawDataFileName);

    // Ensure results directory exists
    const resultsDir = path.dirname(rawDataPath);
    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
    }

    fs.writeFileSync(rawDataPath, createCSVHeaders() + '\n');
    
    let totalExperiments = 0;
    let completedExperiments = 0;
    
    // Calculate total experiments for progress tracking
    for (const length of promptLength) {
        totalExperiments += testEvents.size;
    }
    
    console.log(`Starting ${totalExperiments} experiments...`);
    console.log(`Raw data will be saved to: ${rawDataPath}`);

    for (const length of promptLength) {
        console.log(`\n=== Processing target length ${length} words ===`);
        
        for (const [eventKey, testEvent] of testEvents) {
            try {
                const prompt = createPrivacyAnalysisPrompt(
                    testEvent[0],
                    JSON.stringify(privacyPolicyData.privacyPolicy),
                    testEvent[1],
                    [RegulatoryFramework.PIPEDA],
                    JSON.stringify(privacyRegulations.pipeda),
                    instruction,
                    length 
                );
                
                console.log(`Processing event: ${eventKey} (${++completedExperiments}/${totalExperiments})`);
                
                const updatedTransparencyEvent = await llmService.analyzePrivacyRisks(
                    testEvent[0],
                    prompt
                );

                // if there was a gemini error, do not include that test case
                if (updatedTransparencyEvent.aiExplanation?.storage === 'Not currently available'){
                    console.log(`Gemini error for event: ${eventKey} - skipping`);
                    continue;
                }
                        
                const nliScores = await nliEvaluator.evaluateAIExplanation(updatedTransparencyEvent.aiExplanation!);
                const readabilityMetrics = evalReadability(updatedTransparencyEvent.aiExplanation!);
                
                // Calculate actual response length
                const fullResponse = [
                    updatedTransparencyEvent.aiExplanation!.storage || '',
                    updatedTransparencyEvent.aiExplanation!.access || '',
                    updatedTransparencyEvent.aiExplanation!.why || '',
                    updatedTransparencyEvent.aiExplanation!.privacyExplanation || ''
                ].join(' ').trim();
                
                const actualWordCount = countWords(fullResponse) / 4; // Approximate words per explanation field
                
                // Calculate NLI average (handle NaN values)
                const validNliScores = nliScores.filter(score => !isNaN(score));
                const nliAverageScore = validNliScores.length > 0 
                    ? validNliScores.reduce((sum, score) => sum + score, 0) / validNliScores.length 
                    : NaN;
                
                const result: ExperimentResult = {
                    eventKey,
                    targetLength: length,
                    actualWordCount,
                    nliDataCollection: nliScores[0] || NaN,
                    nliPrivacyExplanation: nliScores[1] || NaN,
                    nliAverageScore,
                    fleschKincaid: readabilityMetrics.fleschKincaid,
                    wordFrequencyScore: readabilityMetrics.wordFrequency
                };
                
                // Append result to CSV
                fs.appendFileSync(rawDataPath, resultToCSVRow(result) + '\n');
                
                console.log(`Completed - Words: ${actualWordCount.toFixed(1)}/${length}, NLI: [${nliScores[0]?.toFixed(3) || 'N/A'}, ${nliScores[1]?.toFixed(3) || 'N/A'}], AverageNLI: ${nliAverageScore.toFixed(3)}, FK: ${readabilityMetrics.fleschKincaid.toFixed(1)}, WordFreq: ${readabilityMetrics.wordFrequency.toFixed(1)}`);
            } catch (error: any) {
                console.error(`Error processing event: ${eventKey} - ${error.message}`);
            }
        }
    }

    console.log(`\nAll experiments completed! Raw data saved to: ${rawDataPath}`);
    console.log(`Total experiments: ${completedExperiments}/${totalExperiments}`);
}

runEval();

// interface AggregatedResult {
//     instructionType: string;
//     targetLength: number;
//     avgActualWordCount: number;
//     avgNliDataCollection: number;
//     avgNliPrivacyExplanation: number;
//     avgNliAverageScore: number;
//     avgFleschKincaid: number;
//     avgColemanLiau: number;
//     avgWordFrequencyScore: number;
//     sampleSize: number;
// }

// function createAggregateCSVHeaders(): string {
//     return [
//         'InstructionType',
//         'TargetLength',
//         'AvgActualWordCount',
//         'AvgNLI_DataCollection',
//         'AvgNLI_PrivacyExplanation',
//         'AvgNLI_AverageScore',
//         'AvgFleschKincaid',
//         'AvgColemanLiau',
//         'AvgWordFrequencyScore',
//         'SampleSize'
//     ].join(',');
// }


// function aggregateResultToCSVRow(result: AggregatedResult): string {
//     return [
//         result.instructionType,
//         result.targetLength,
//         result.avgActualWordCount.toFixed(2),
//         result.avgNliDataCollection.toFixed(4),
//         result.avgNliPrivacyExplanation.toFixed(4),
//         result.avgNliAverageScore.toFixed(4),
//         result.avgFleschKincaid.toFixed(4),
//         result.avgColemanLiau.toFixed(4),
//         result.avgWordFrequencyScore.toFixed(4),
//         result.sampleSize
//     ].join(',');
// }

// function calculateAggregatesFromFile(rawDataFilePath: string): void {
//     console.log('\n=== Calculating aggregated results ===');
    
//     // Read the raw data file
//     const rawData = fs.readFileSync(rawDataFilePath, 'utf-8');
//     const lines = rawData.split('\n').filter(line => line.trim().length > 0);
    
//     // Skip header
//     const dataLines = lines.slice(1);
    
//     // Parse the data
//     const results: ExperimentResult[] = dataLines.map(line => {
//         const columns = line.split(',');
//         return {
//             instructionType: columns[0],
//             eventKey: columns[1],
//             targetLength: parseInt(columns[2]),
//             actualWordCount: parseInt(columns[3]),
//             nliDataCollection: columns[4] === 'N/A' ? NaN : parseFloat(columns[4]),
//             nliPrivacyExplanation: columns[5] === 'N/A' ? NaN : parseFloat(columns[5]),
//             nliAverageScore: columns[6] === 'N/A' ? NaN : parseFloat(columns[6]),
//             fleschKincaid: parseFloat(columns[7]),
//             colemanLiau: parseFloat(columns[8]),
//             wordFrequencyScore: parseFloat(columns[9])
//         };
//     });
    
//     // Group results by instruction type and target length
//     const groups = new Map<string, ExperimentResult[]>();
    
//     for (const result of results) {
//         const key = `${result.instructionType}-${result.targetLength}`;
//         if (!groups.has(key)) {
//             groups.set(key, []);
//         }
//         groups.get(key)!.push(result);
//     }
    
//     // Calculate aggregates
//     const aggregates: AggregatedResult[] = [];
    
//     for (const [key, groupResults] of groups) {
//         const [instructionType, lengthStr] = key.split('-');
//         const targetLength = parseInt(lengthStr);
        
//         const validNliData = groupResults.filter(r => !isNaN(r.nliDataCollection));
//         const validNliPrivacy = groupResults.filter(r => !isNaN(r.nliPrivacyExplanation));
//         const validNliAverage = groupResults.filter(r => !isNaN(r.nliAverageScore));
        
//         aggregates.push({
//             instructionType,
//             targetLength,
//             avgActualWordCount: groupResults.reduce((sum, r) => sum + r.actualWordCount, 0) / groupResults.length,
//             avgNliDataCollection: validNliData.length > 0 
//                 ? validNliData.reduce((sum, r) => sum + r.nliDataCollection, 0) / validNliData.length 
//                 : NaN,
//             avgNliPrivacyExplanation: validNliPrivacy.length > 0
//                 ? validNliPrivacy.reduce((sum, r) => sum + r.nliPrivacyExplanation, 0) / validNliPrivacy.length
//                 : NaN,
//             avgNliAverageScore: validNliAverage.length > 0
//                 ? validNliAverage.reduce((sum, r) => sum + r.nliAverageScore, 0) / validNliAverage.length
//                 : NaN,
//             avgFleschKincaid: groupResults.reduce((sum, r) => sum + r.fleschKincaid, 0) / groupResults.length,
//             avgColemanLiau: groupResults.reduce((sum, r) => sum + r.colemanLiau, 0) / groupResults.length,
//             avgWordFrequencyScore: groupResults.reduce((sum, r) => sum + r.wordFrequencyScore, 0) / groupResults.length,
//             sampleSize: groupResults.length
//         });
//     }
    
//     // Sort aggregates
//     aggregates.sort((a, b) => {
//         if (a.instructionType !== b.instructionType) {
//             return a.instructionType.localeCompare(b.instructionType);
//         }
//         return a.targetLength - b.targetLength;
//     });
    
//     // Save aggregated results
//     const aggregateFileName = rawDataFilePath.replace('_raw_', '_aggregated_');
//     fs.writeFileSync(aggregateFileName, createAggregateCSVHeaders() + '\n');
    
//     for (const aggregate of aggregates) {
//         fs.appendFileSync(aggregateFileName, aggregateResultToCSVRow(aggregate) + '\n');
//     }
    
//     console.log(`Aggregated results saved to: ${aggregateFileName}`);
    
//     // Print summary to console
//     console.log('\n=== AGGREGATED RESULTS SUMMARY ===');
//     for (const instructionType of ['accurate', 'readable']) {
//         console.log(`\n${instructionType.toUpperCase()} Instruction:`);
//         const instrAggregates = aggregates.filter(a => a.instructionType === instructionType);
        
//         for (const agg of instrAggregates) {
//             console.log(`  Target: ${agg.targetLength}w Actual: ${agg.avgActualWordCount.toFixed(1)}w, FK: ${agg.avgFleschKincaid.toFixed(1)}, CL: ${agg.avgColemanLiau.toFixed(1)}, NLI: ${agg.avgNliAverageScore.toFixed(3)}, Word Freq: ${agg.avgWordFrequencyScore.toFixed(3)} (n=${agg.sampleSize})`);
//         }
//     }
// }