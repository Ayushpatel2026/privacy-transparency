import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    StatusBar,
    TouchableOpacity,
    Platform,
    SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { journalDataRepository, sensorBackgroundTaskManager } from '@/services'; 
import { useProfileStore } from '@/store/userProfileStore';
import { Colors } from '@/constants/Colors';

export default function SleepMode() {
    const router = useRouter();
    const { isSleepModeActive, setIsSleepModeActive, userConsentPreferences } = useProfileStore();

    const [currentTime, setCurrentTime] = useState<string>('');
    const [alarmTime, setAlarmTime] = useState<string>('');

    // State and ref for long press
    const [pressDuration, setPressDuration] = useState(0);
    const pressIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const requiredPressDuration = 2000; // 2 seconds

    useEffect(() => {
        // Update current time every second
        const intervalId = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId)
    }, []);

    useEffect(() => {
        const fetchAlarm = async () => {
            const dateToLoad = new Date().toISOString().split('T')[0];
            const journal = await journalDataRepository.getJournalByDate(dateToLoad);
            if (journal && journal.alarmTime) {
                setAlarmTime(journal.alarmTime);
            }
        };
        fetchAlarm();
        const enterSleepMode = async () => {
            setIsSleepModeActive(true);
            await sensorBackgroundTaskManager.updateConfig({
                audioEnabled: userConsentPreferences.microphoneEnabled,
                lightEnabled: userConsentPreferences.lightSensorEnabled,
            });
        }
        enterSleepMode();
    }, []);

    const handlePressIn = () => {
        setPressDuration(0); // Reset duration
        pressIntervalRef.current = setInterval(() => {
            setPressDuration(prev => {
                const newDuration = prev + 100;
                if (newDuration >= requiredPressDuration) {
                    clearInterval(pressIntervalRef.current!);
                    handleWakeUp(); // Trigger wake up action
                }
                return newDuration;
            });
        }, 100); // Check every 100ms
    };

    const handlePressOut = () => {
        if (pressIntervalRef.current) {
            clearInterval(pressIntervalRef.current);
            pressIntervalRef.current = null;
            setPressDuration(0); // Reset if released too early
        }
    };

    const handleWakeUp = async () => {
        await sensorBackgroundTaskManager.updateConfig({
            audioEnabled: false, // Turn off microphone
            lightEnabled: false, // Turn off light sensor
        });

        // This replaces 'sleep-mode.tsx' with 'index.tsx' in the sleep tab's stack.
        // This is crucial to ensure that when the user returns to the sleep tab later,
        // they land on 'sleep/index' and not 'sleep/sleep-mode'.
        router.replace('/(tabs)/sleep'); 
        setTimeout(() => {
            router.replace('/(tabs)/statistics');
        }, 50); // small delay to ensure the navigation stack is updated
    };

    const progress = (pressDuration / requiredPressDuration) * 100;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={require('@/assets/images/sleep-mode-bg.png')} 
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <SafeAreaView style={styles.safeArea}>
                    {/* Current Time Display */}
                    <View style={styles.currentTimeContainer}>
                        <Text style={styles.currentTimeText}>{currentTime}</Text>
                    </View>

                    {/* Alarm Box */}
                    <View style={styles.alarmBox}>
                        <Text style={styles.alarmLabel}>Alarm</Text>
                        <Text style={styles.alarmTime}>{alarmTime}</Text>
                    </View>

                    {/* Wake Up Button */}
                    <TouchableOpacity
                        style={styles.wakeUpButton}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        activeOpacity={1} // Prevents opacity change on press
                    >
                        <View style={[styles.progressBar, { width: `${progress}%` }]} />
                        <Text style={styles.wakeUpButtonText}>
                            {pressDuration >= requiredPressDuration ? "Releasing..." : "Wake up"}
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black', 
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    safeArea: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        justifyContent: 'space-between', // Distribute content vertically
    },
    currentTimeContainer: {
        flex: 1, // Allows it to take available space
        justifyContent: 'center', // Center current time vertically
        alignItems: 'center',
        marginBottom: 150, // Push it up a bit
    },
    currentTimeText: {
        color: '#FFFFFF',
        fontSize: 60,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    alarmBox: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        marginBottom: 20, // Space above the wake up button
    },
    alarmLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        opacity: 0.8,
    },
    alarmTime: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    wakeUpButton: {
        backgroundColor: Colors.generalBlue, // Blue button
        borderRadius: 12,
        paddingVertical: 20,
        width: '90%',
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? 40 : 20, // Adjust for bottom safe area
        overflow: 'hidden', // Required for progress bar
    },
    wakeUpButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        zIndex: 1, // Ensure text is above progress bar
    },
    progressBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)', 
        borderRadius: 12, 
    },
});