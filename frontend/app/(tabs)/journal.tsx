import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from "react-native";
import { journalDataRepository } from "@/services";
import { JournalData } from "@/constants/types/JournalData";

/**
 * TODO - the code below is just to test out the database functionality.
 * Everything below needs to be replaced with a proper UI. 
 * 
 */
export default function Journal() {
    const [diaryEntry, setDiaryEntry] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [journalExists, setJournalExists] = useState(false);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    useEffect(() => {
        loadJournalData();
    }, []);

    const loadJournalData = async () => {
        try {
            setIsLoading(true);
            
            // Try to get existing journal for today
            const existingJournal = await journalDataRepository.getJournalByDate(today);
            
            if (existingJournal) {
                setJournalExists(true);
                setDiaryEntry(existingJournal.diaryEntry || "");
            } else {
                setJournalExists(false);
                // Set placeholder text
                setDiaryEntry("How did you sleep last night? Write about your sleep experience...");
            }
        } catch (error) {
            console.error("Error loading journal data:", error);
            Alert.alert("Error", `Failed to load journal data: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const saveJournal = async () => {
        try {
            setIsSaving(true);
            
            const journalData : Partial<JournalData> = {
                date: today,
                bedtime: "22:00", // Default values for now
                alarmTime: "07:00",
                sleepDuration: "8h",
                diaryEntry: diaryEntry,
                sleepNotes: []
            };
			console.log("Saving journal data:", journalData);
            const result = await journalDataRepository.editJournal(journalData, today);
            console.log("Result from saving journal:", result);
            if (result) {
                setJournalExists(true);
				setDiaryEntry(result.diaryEntry || "");
                Alert.alert("Success", "Journal saved successfully!");
                console.log("Saved journal:", result);
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

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading journal...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Sleep Journal - {today}
                </Text>
                
                <Text style={styles.subtitle}>
                    {journalExists ? "Editing existing journal" : "Creating new journal"}
                </Text>

                {/* Diary Entry Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                        Diary Entry:
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        value={diaryEntry}
                        onChangeText={setDiaryEntry}
                        placeholder="How did you sleep? Any dreams? How do you feel?"
                        multiline
                        numberOfLines={6}
                    />
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveJournal}
                    disabled={isSaving}
                >
                    <Text style={styles.saveButtonText}>
                        {isSaving ? "Saving..." : "Save Journal"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    content: {
        paddingVertical: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 5,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "white",
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: "top",
    },
    saveButton: {
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    debugButton: {
        backgroundColor: "#FF9500",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    reloadButton: {
        backgroundColor: "#34C759",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    debugInfo: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#e6f3ff",
        borderRadius: 8,
    },
    debugText: {
        fontSize: 14,
        color: "#0066cc",
    },
});