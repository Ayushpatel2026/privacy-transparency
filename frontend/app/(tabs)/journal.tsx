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
} from "react-native";
import { journalDataRepository } from "@/services";
import { JournalData } from "@/constants/types/JournalData";
import Loader from "@/components/Loader";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from "@/constants/Colors";

export default function Journal() {
    const [diaryEntry, setDiaryEntry] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [journalExists, setJournalExists] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        loadJournalData();
    }, [selectedDate]); // Reload journal data when selectedDate changes

    const loadJournalData = async () => {
        try {
            setIsLoading(true);
            const dateToLoad = selectedDate.toISOString().split('T')[0]; // Use selected date
            const existingJournal = await journalDataRepository.getJournalByDate(dateToLoad);

            if (existingJournal) {
                setJournalExists(true);
                setDiaryEntry(existingJournal.diaryEntry || "");
            } else {
                setJournalExists(false);
                setDiaryEntry("");
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
            const journalData: Partial<JournalData> = {
                date: selectedDate.toISOString().split('T')[0], // Save for selected date
                bedtime: "22:00",
                alarmTime: "07:00",
                sleepDuration: "8h",
                diaryEntry: diaryEntry,
                sleepNotes: []
            };

            const result = await journalDataRepository.editJournal(journalData, selectedDate.toISOString().split('T')[0]);
            if (result) {
                setJournalExists(true);
                setDiaryEntry(result.diaryEntry || "");
                Alert.alert("Success", "Journal saved successfully!");
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

    const getDaysInCurrentWeek = () => {
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay()); // Go to the Sunday of the current week

        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const CalendarComponent = () => {
        const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const daysInWeek = getDaysInCurrentWeek();

        return (
            <View style={styles.calendarContainer}>
                <View style={styles.weekDaysRow}>
                    {weekDays.map((day, index) => (
                        <Text key={index} style={styles.weekDayText}>{day}</Text>
                    ))}
                </View>
                <View style={styles.daysGrid}>
                    {daysInWeek.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dayCell,
                                day.toDateString() === selectedDate.toDateString() && styles.selectedDay
                            ]}
                            onPress={() => setSelectedDate(day)}
                        >
                            <Text style={[
                                styles.dayText,
                                day.toDateString() === selectedDate.toDateString() && styles.selectedDayText
                            ]}>
                                {day.getDate()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    if (isLoading) {
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
                {/* Calendar (conditional) */}
                {showCalendar && <CalendarComponent />}
            </ImageBackground>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Sleep Goal Section */}
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Sleep Goal</Text>
                        <View style={styles.sleepGoalContent}>
                            <View style={styles.timeRow}>
                                <View style={styles.timeItem}>
                                    <Text style={styles.timeLabel}><Ionicons name="moon-outline" size={16} color="#FFFFFF" /> Bedtime</Text>
                                    <Text style={styles.timeValue}>10:00 PM</Text>
                                </View>
                                <View style={styles.goalItem}>
                                    <Text style={styles.goalLabel}><Ionicons name="alarm-outline" size={16} color="#FFFFFF" /> Goal</Text>
                                    <Text style={styles.goalValue}>8 h 30 min</Text>
                                </View>
                            </View>
                            <View style={styles.alarmRow}>
                                <Text style={styles.alarmLabel}><Ionicons name="alarm-outline" size={16} color="#FFFFFF" /> Alarm</Text>
                                <Text style={styles.alarmTime}>06:00 AM - 06:30 AM</Text>
                            </View>
                        </View>
                    </View>

                    {/* Diary Section */}
                    <View style={styles.sectionCard}>
                        <View style={styles.diaryHeader}>
                            <Text style={styles.sectionTitle}>Diary</Text>
                            <TouchableOpacity onPress={saveJournal} disabled={isSaving}>
                                <Ionicons name="save-outline" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.diaryContent}>
                            <Text style={styles.sleepNotesLabel}>Sleep Notes</Text>
                            <TextInput
                                style={styles.diaryInput}
                                value={diaryEntry}
                                onChangeText={setDiaryEntry}
                                placeholder="Write something to record this special day ..."
                                placeholderTextColor="#8E8E93"
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>

                    {/* Activity Tracker Section */}
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Activity Tracker</Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#001122',
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: 16,
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
        overflow: 'hidden', // Ensures the borderRadius is applied to the image
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
    calendarContainer: {
        padding: 16,
        backdropFilter: 'blur(10px)', // This might not work on all React Native platforms
    },
    weekDaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    weekDayText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
        opacity: 0.7,
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    dayCell: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
        borderRadius: 18,
    },
    selectedDay: {
        backgroundColor: '#FFFFFF',
    },
    dayText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    selectedDayText: {
        color: '#001122',
        fontWeight: '600',
    },
    sectionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        backdropFilter: 'blur(10px)',
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
    },
    sleepGoalContent: {
        gap: 15,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeItem: {
        flex: 1,
    },
    goalItem: {
        alignItems: 'flex-end',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    alarmLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        opacity: 0.7,
        flexDirection: 'row',
        alignItems: 'center',
    },
    alarmTime: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    diaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    editIcon: {
        fontSize: 18,
    },
    diaryContent: {
        gap: 10,
    },
    sleepNotesLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    diaryInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 15,
        color: '#FFFFFF',
        fontSize: 16,
        minHeight: 80,
        textAlignVertical: 'top',
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
});