import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    StyleSheet,
    ImageBackground,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    Modal,
} from "react-native";
import { journalDataRepository } from "@/services";
import { JournalData, SleepNote } from "@/constants/types/JournalData";
import Loader from "@/components/Loader";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from "@/constants/Colors";
import { Calendar } from "@/components/Calendar";
import { useTransparencyStore } from "@/store/transparencyStore";
import { DEFAULT_JOURNAL_TRANSPARENCY_EVENT, PrivacyRisk, TransparencyEvent } from "@/constants/types/Transparency";
import { transparencyService } from "@/services";
import PrivacyTooltip from "@/components/transparency/PrivacyTooltip";
import { JournalEntryModal } from "@/components/modal/JournalEntryModal";
import { SleepNotesModal } from "@/components/modal/SleepNotesModal";

export default function Journal() {
    const [diaryEntry, setDiaryEntry] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [journalExists, setJournalExists] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [alarm, setAlarm] = useState("");
    const [bedtime, setBedtime] = useState("");
    const [sleepGoal, setSleepGoal] = useState("");

    // State for the journal entry modal
    const [isJournalModalVisible, setIsJournalModalVisible] = useState(false);
    const [tempDiaryEntry, setTempDiaryEntry] = useState(""); // Temporary state for modal's TextInput

    const [sleepNotes, setSleepNotes] = useState<SleepNote[]>([]);

    // State for Sleep Notes Modal
    const [isSleepNotesModalVisible, setIsSleepNotesModalVisible] = useState(false);
    const [tempSleepNotes, setTempSleepNotes] = useState<SleepNote[]>([]); // Temporary state for modal's sleep notes

    // Transparency State
    const { journalTransparency, setJournalTransparency, accelerometerTransparency, setAccelerometerTransparency } = useTransparencyStore();

    // transparency UI configuration for this page
    const [ tooltipUI, setTooltipUI ] = useState(false);
    
    const getPrivacyRiskColor = (risk: PrivacyRisk) => {
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
    const getPrivacyRiskIcon = (risk: PrivacyRisk) => {
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

    // Helper function to format violations detected
    const formatViolationsDetected = (transparency: TransparencyEvent) => {
        if (!transparency.regulatoryCompliance?.issues || transparency.regulatoryCompliance.issues.length === 0) {
            return "No privacy violations detected";
        }
        return `${transparency.aiExplanation?.privacyRisks} ${transparency.aiExplanation?.regulatoryContext}`;
    };

    useEffect(() => {
        loadJournalData();
    }, [selectedDate]);

    const loadJournalData = async () => {
        try {
            setIsLoading(true);
            const dateToLoad = selectedDate.toISOString().split('T')[0];
            const existingJournal = await journalDataRepository.getJournalByDate(dateToLoad);
            
            if (existingJournal) {
                setJournalExists(true);
                setDiaryEntry(existingJournal.diaryEntry || "");
                setSleepNotes(existingJournal.sleepNotes || []);
                setAlarm(existingJournal.alarmTime);
                setBedtime(existingJournal.bedtime);
                setSleepGoal(existingJournal.sleepDuration);
            } else {
                setJournalExists(false);
                setDiaryEntry("");
                setSleepNotes([]);
                setAlarm("");
                setBedtime("");
                setSleepGoal("");
            }
        } catch (error) {
            console.error("Error loading journal data:", error);
            Alert.alert("Error", `Failed to load journal data: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const saveJournal = async (updatedDiaryEntry: string, updatedSleepNotes: SleepNote[]) => {
        try {
            setIsSaving(true);
            const journalData: Partial<JournalData> = {
                date: selectedDate.toISOString().split('T')[0],
                diaryEntry: updatedDiaryEntry,
                sleepNotes: updatedSleepNotes
            };
            
            // set up a new transparency event
            const transparencyEvent : TransparencyEvent = DEFAULT_JOURNAL_TRANSPARENCY_EVENT;
            setJournalTransparency(transparencyEvent);

            const result = await journalDataRepository.editJournal(journalData, selectedDate.toISOString().split('T')[0]);

            // 
            transparencyService.analyzePrivacyRisks(transparencyEvent)
                .then(updatedJournalTransparency => {
                    setJournalTransparency(updatedJournalTransparency);
                    console.log("Updated journal transparency", updatedJournalTransparency);
                })
                .catch(error => {
                    console.error("Error analyzing privacy risks:", error);
            });

            if (result) {
                setJournalExists(true);
                setDiaryEntry(result.diaryEntry || "");
                setSleepNotes(result.sleepNotes || []);
                setAlarm(result.alarmTime);
                setBedtime(result.bedtime);
                setSleepGoal(result.sleepDuration);
            } else {
                Alert.alert("Error", "Failed to save journal");
            }
        } catch (error) {
            console.error("Error saving journal:", error);
            Alert.alert("Error", `Failed to save journal: ${error}`);
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit'
        });
    };

    const handleAddSleepNote = () => {
        setTempSleepNotes([...sleepNotes]);
        setIsSleepNotesModalVisible(true);
    };

    const handleEditJournalEntry = () => {
        setTempDiaryEntry(diaryEntry); // Set the temporary state to current diary entry
        setIsJournalModalVisible(true);
    };

    const handleSaveModalEdit = async () => {
        setDiaryEntry(tempDiaryEntry);
        await saveJournal(tempDiaryEntry, sleepNotes);
        setIsJournalModalVisible(false); // Close the modal
    };

    const handleCancelModalEdit = () => {
        setIsJournalModalVisible(false); // Just close the modal, changes in tempDiaryEntry are discarded
    };

    // Save and Cancel functions for Sleep Notes Modal
    const handleSaveSleepNotes = async () => {
        setSleepNotes(tempSleepNotes); // Update the main sleep notes state
        await saveJournal(diaryEntry, tempSleepNotes);
        setIsSleepNotesModalVisible(false);
    };

    const handleCancelSleepNotes = () => {
        setIsSleepNotesModalVisible(false); // Discard changes by closing
    };

    if (isLoading || isSaving) {
        return (
            <Loader/>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
                style={styles.calendarBackgroundImage}
                imageStyle={styles.calendarBackgroundImageStyle}
            >
                <View style={styles.calendarOverlay} />
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.dateHeader}
                        onPress={() => setShowCalendar(!showCalendar)}
                    >
                        <Text style={styles.todayText}>Today</Text>
                        <Text style={styles.dateText}>
                            {formatDate(selectedDate)} <Ionicons name={showCalendar ? "chevron-up" : "chevron-down"} size={18} color="#FFFFFF" />
                        </Text>
                    </TouchableOpacity>
                </View>
                {showCalendar && <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
                {!tooltipUI && }
            </ImageBackground>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Sleep Goal Section */}
                <Text style={styles.sectionTitle}>Sleep Goal</Text>
                <View style={styles.sectionCard}>
                    <View style={styles.sleepGoalContent}>
                        <View style={styles.sleepTimeAndAlarm}>
                            <View>
                                <Text style={styles.timeLabel}><Ionicons name="moon-outline" size={16} color="#FFFFFF" /> Bedtime</Text>
                                <Text style={styles.timeValue}>{bedtime}</Text>
                            </View>
                            <View style={styles.alarmRow}>
                                <Text style={styles.alarmLabel}><Ionicons name="alarm-outline" size={16} color="#FFFFFF" /> Alarm</Text>
                                <Text style={styles.alarmTime}>{alarm}</Text>
                            </View>
                        </View>
                        <View style={styles.goalItem}>
                            <Text style={styles.goalLabel}><Ionicons name="compass-outline" size={16} color="#FFFFFF" /> Goal</Text>
                            <Text style={styles.goalValue}>{sleepGoal}</Text>
                        </View>
                    </View>
                </View>

                {/* Diary Section - Title with Privacy Tooltip */}
                <View style={styles.sectionTitleWithTooltip}>
                    <Text style={styles.sectionTitle}>Diary</Text>
                    <PrivacyTooltip
                        color={getPrivacyRiskColor(journalTransparency.privacyRisk || PrivacyRisk.LOW)}
                        iconSize={40}
                        iconName={getPrivacyRiskIcon(journalTransparency.privacyRisk || PrivacyRisk.LOW)}
                        violationsDetected={formatViolationsDetected(journalTransparency)}
                        purpose={journalTransparency.aiExplanation!.why}
                        storage={journalTransparency.aiExplanation!.storage}
                        access={journalTransparency.aiExplanation!.access}
                        privacyPolicyLink={journalTransparency.aiExplanation?.privacyPolicyLink}
                        privacyPolicySectionLink={journalTransparency.aiExplanation?.regulationLink}
                        dataType="Journal"
                    />
                </View>
                <KeyboardAvoidingView
                    style={styles.keyboardAvoidingContainer}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                >
                    {/* Sleep Notes Subsection */}
                    <View style={styles.subSectionCard}>
                        <View style={styles.subSectionHeader}>
                            <Text style={styles.subSectionTitle}>Sleep Notes</Text>
                            <TouchableOpacity onPress={handleAddSleepNote}>
                                <Ionicons name="add-circle-outline" size={24} color={Colors.generalBlue} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.sleepNotesContainer}>
                            {sleepNotes && sleepNotes.map((note, index) => (
                                <View key={index} style={styles.sleepNoteItem}>
                                    <Text style={styles.sleepNoteBullet}>•</Text>
                                    <Text style={styles.sleepNoteText}>{note}</Text>
                                </View>
                            ))}
                            {sleepNotes.length === 0 && (
                                <Text style={styles.noNotesText}>No sleep notes added yet.</Text>
                            )}
                        </View>
                    </View>

                    {/* Journal Entry Subsection - Display only when not in modal */}
                    <View style={styles.journalEntryCard}>
                        <Text style={styles.diaryEntryPreview}>
                            {diaryEntry || "Write something to record your day... "}
                        </Text>
                        <TouchableOpacity onPress={handleEditJournalEntry} style={styles.editButton}>
                            <Ionicons name="pencil-outline" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

                {/* Activity Tracker Section - Title with Privacy Tooltip */}
                <View style={styles.sectionTitleWithTooltip}>
                    <Text style={styles.sectionTitle}>Activity Tracker</Text>
                    <PrivacyTooltip
                        color={getPrivacyRiskColor(accelerometerTransparency.privacyRisk || PrivacyRisk.LOW)}
                        iconSize={50}
                        iconName={getPrivacyRiskIcon(accelerometerTransparency.privacyRisk || PrivacyRisk.LOW)}
                        violationsDetected={formatViolationsDetected(accelerometerTransparency)}
                        purpose={accelerometerTransparency.aiExplanation!.why}
                        storage={accelerometerTransparency.aiExplanation!.storage}
                        access={accelerometerTransparency.aiExplanation!.access}
                        optOutLink={accelerometerTransparency.aiExplanation?.privacyPolicyLink}
                        privacyPolicyLink={accelerometerTransparency.aiExplanation?.privacyPolicyLink}
                        privacyPolicySectionLink={accelerometerTransparency.aiExplanation?.regulationLink}
                        dataType="Motion Data"
                    />
                </View>
                <View style={styles.sectionCard}>
                    <View style={styles.activityContent}>
                        <TouchableOpacity style={styles.activityItem}>
                            <Text style={styles.activityLabel}>Steps</Text>
                            <View style={styles.circularProgress}>
                                <Text style={styles.progressNumber}>83</Text>
                                <Text style={styles.progressUnit}>steps</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.activityItem}>
                            <Text style={styles.activityLabel}>Calories</Text>
                            <View style={styles.circularProgress}>
                                <Text style={styles.progressNumber}>83</Text>
                                <Text style={styles.progressUnit}>kcal</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Journal Entry Modal */}
            <JournalEntryModal 
                isJournalModalVisible 
                setIsJournalModalVisible={setIsJournalModalVisible} 
                tempDiaryEntry={tempDiaryEntry}
                setTempDiaryEntry={setTempDiaryEntry}
                handleCancelModalEdit={handleCancelModalEdit}
                handleSaveModalEdit={handleSaveModalEdit}
            />

            {/* Sleep Notes Modal */}
            <SleepNotesModal 
                isSleepNotesModalVisible={isSleepNotesModalVisible}
                setIsSleepNotesModalVisible={setIsSleepNotesModalVisible}
                tempSleepNotes={tempSleepNotes}
                handleCancelSleepNotes={handleCancelSleepNotes}
                handleSaveSleepNotes={handleSaveSleepNotes}
                setTempSleepNotes={setTempSleepNotes}
            />
        </View>
    );
}

// ===================================================================
// Styles
// ===================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 30,
    },
    dateHeader: {
        alignItems: 'flex-start',
    },
    todayText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '600',
        marginBottom: 5,
    },
    dateText: {
        color: '#FFFFFF',
        fontSize: 18,
        opacity: 0.8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    calendarBackgroundImage: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
    },
    calendarBackgroundImageStyle: {
        opacity: 0.6,
    },
    calendarOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 20, 40, 0.8)',
        borderRadius: 16,
    },
    sectionCard: {
        backgroundColor: Colors.lightBlack,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    sectionTitleWithTooltip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    subSectionCard: {
        backgroundColor: Colors.lightBlack,
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
    },
    subSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    subSectionTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    sleepNotesContainer: {
        marginTop: 5,
    },
    sleepNoteItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    sleepNoteBullet: {
        color: '#FFFFFF',
        fontSize: 18,
        marginRight: 8,
        lineHeight: 20,
    },
    sleepNoteText: {
        color: '#FFFFFF',
        fontSize: 16,
        flex: 1,
    },
    noNotesText: {
        color: '#8E8E93',
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 10,
    },
    journalEntryCard: {
        backgroundColor: Colors.lightBlack,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 16,
    },
    editButton: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    diaryEntryPreview: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        flex: 6,
        color: '#FFFFFF',
        fontSize: 16,
        opacity: 0.8,
        minHeight: 60,
    },
    sleepGoalContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sleepTimeAndAlarm: {
        flex: 1,
        gap: 15,
    },
    timeLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeValue: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    goalItem: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    goalLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    goalValue: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    alarmRow: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    alarmLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        opacity: 0.7,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    alarmTime: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    activityContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    activityItem: {
        flex: 1,
        alignItems: 'center',
        gap: 10,
    },
    activityLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    circularProgress: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.generalBlue,
    },
    progressNumber: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
    },
    progressUnit: {
        color: '#FFFFFF',
        fontSize: 12,
        opacity: 0.7,
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
});