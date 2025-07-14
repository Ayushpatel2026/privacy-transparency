import { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Platform,
    Alert,
    Image,
    SafeAreaView
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from "@/constants/Colors";
import { useRouter } from 'expo-router';
import { journalDataRepository } from "@/services";
import Loader from "@/components/Loader";
import { TimeModal } from "@/components/modal/TimeModal";

export default function Sleep() {
    const [loading, setIsLoading] = useState(true);
    const router = useRouter();

    const [bedtime, setBedtime] = useState<string>('');
    const [alarm, setAlarm] = useState<string>('');

    // Modal visibility states
    const [isBedtimeModalVisible, setIsBedtimeModalVisible] = useState(false);
    const [isAlarmModalVisible, setIsAlarmModalVisible] = useState(false);

    useEffect(() => {
        const loadJournalData = async () => {
            try {
                setIsLoading(true);
                const dateToLoad = new Date().toISOString().split('T')[0];
                const existingJournal = await journalDataRepository.getJournalByDate(dateToLoad);

                if (existingJournal) {
                    setAlarm(existingJournal.alarmTime);
                    setBedtime(existingJournal.bedtime); 
                }
            } catch (error) {
                console.error("Error loading journal data:", error);
                Alert.alert("Error", `Failed to load journal data: ${error}`);
            } finally {
                setIsLoading(false);
            }
        };
        loadJournalData();
    }, []);

    const saveBedTimeToJournal = async (newBedtime: string) => {
        try {
            const dateToSave = new Date().toISOString().split('T')[0];
            const result = await journalDataRepository.editJournal({
                date: dateToSave,
                bedtime: newBedtime,
				sleepDuration: newBedtime && alarm ? '8 hours' : '', // TODO - calculate actual sleep duration
            }, dateToSave
            );
            if (result) {
                setBedtime(result.bedtime);
                Alert.alert("Success", "Bedtime saved successfully!");
            } else {
                Alert.alert("Error", "Failed to save bedtime");
            }
        } catch (error) {
            console.error("Error saving bedtime to journal:", error);
            Alert.alert("Error", `Failed to save bedtime: ${error}`);
        }
    };

    const saveAlarmToJournal = async (newAlarm: string) => {
        try {
            const dateToSave = new Date().toISOString().split('T')[0];
            const result = await journalDataRepository.editJournal({
                date: dateToSave,
                alarmTime: newAlarm,
				sleepDuration: bedtime && newAlarm ? '8 hours' : '', // TODO - calculate actual sleep duration
            }, dateToSave
            );
            if (result) {
                setAlarm(result.alarmTime);
                Alert.alert("Success", "Alarm time saved successfully!");
            } else {
                Alert.alert("Error", "Failed to save alarm time");
            }
        } catch (error) {
            console.error("Error saving alarm time to journal:", error);
            Alert.alert("Error", `Failed to save alarm time: ${error}`);
        }
    };

    const handleStartSleepSession = async () => {
        // Validate that bedtime and alarm are set
        if (!bedtime || !alarm || bedtime === 'Set Time' || alarm === 'Set Time') {
            Alert.alert("Missing Information", "Please set your Bedtime and Alarm before starting sleep mode.");
            return;
        }
        router.push('/(tabs)/sleep/sleep-mode'); // Navigate to sleep-mode.tsx
    };

    // Bedtime Modal Handlers
    const handleEditBedtime = () => {
        setIsBedtimeModalVisible(true);
    };

    const handleSaveBedtime = (time: string) => {
        setBedtime(time); // Time is already formatted by TimeModal
        saveBedTimeToJournal(time); // Save to journal
        setIsBedtimeModalVisible(false);
    };

    const handleCancelBedtime = () => {
        setIsBedtimeModalVisible(false);
    };

    // Alarm Modal Handlers
    const handleEditAlarm = () => {
        setIsAlarmModalVisible(true);
    };

    const handleSaveAlarm = (time: string) => {
        setAlarm(time); // Time is already formatted by TimeModal
        saveAlarmToJournal(time); // Save to journal
        setIsAlarmModalVisible(false);
    };

    const handleCancelAlarm = () => {
        setIsAlarmModalVisible(false);
    };

    if (loading) {
        return <Loader size="large" />;
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>

                <Text style={styles.headerText}>
                    Sleep Tracker
                </Text>

                {/* Sleep Tracker Visual */}
                <View style={styles.sleepTrackerContainer}>
                    <Image
                        source={require('@/assets/images/sleep-duration-wheel.png')}
                        style={styles.sleepDurationImage}
                    />
                </View>

                {/* Bedtime Section */}
                <View style={styles.inputCard}>
                    <Text style={styles.inputLabel}>Bedtime</Text>
                    <Text style={styles.inputValue}>{bedtime}</Text>
                    <TouchableOpacity onPress={handleEditBedtime}>
                        <Ionicons name="pencil-outline" size={20} color={'#ffffff'} />
                    </TouchableOpacity>
                </View>

                {/* Alarm Section */}
                <View style={styles.inputCard}>
                    <Text style={styles.inputLabel}>Alarm</Text>
                    <Text style={styles.inputValue}>{alarm}</Text>
                    <TouchableOpacity onPress={handleEditAlarm}>
                        <Ionicons name="pencil-outline" size={20} color={'#ffffff'} />
                    </TouchableOpacity>
                </View>

                {/* Sleep Now Button */}
                <TouchableOpacity
                    style={styles.sleepNowButton}
                    onPress={handleStartSleepSession}
                >
                    <Text style={styles.sleepNowButtonText}>SLEEP NOW</Text>
                </TouchableOpacity>

                {/* Bedtime TimeModal */}
                <TimeModal
                    isVisible={isBedtimeModalVisible}
                    label="Set Bedtime"
                    defaultTime={bedtime}
                    onSave={handleSaveBedtime}
                    onCancel={handleCancelBedtime}
                />

                {/* Alarm TimeModal */}
                <TimeModal
                    isVisible={isAlarmModalVisible}
                    label="Set Alarm"
                    defaultTime={alarm}
                    onSave={handleSaveAlarm}
                    onCancel={handleCancelAlarm}
                />
            </SafeAreaView>
        </View>
    );
};

// ========================================================================
// Styles
// ========================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    safeArea: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center', 
    },
    headerText: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        paddingTop: 30,
    },
    sleepTrackerContainer: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    sleepDurationImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain', 
        borderRadius: 100,
    },
    inputCard: {
        backgroundColor: Colors.lightBlack,
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    inputLabel: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '500',
        flex: 1,
    },
    inputValue: {
        color: '#ffffff',
        fontSize: 18,
        opacity: 0.8,
        marginRight: 10,
    },
    sleepNowButton: {
        backgroundColor: Colors.generalBlue,
        borderRadius: 12,
        paddingVertical: 18,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        shadowColor: Colors.generalBlue,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    sleepNowButtonText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});