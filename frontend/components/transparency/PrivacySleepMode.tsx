import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useTransparencyStore } from '@/store/transparencyStore';
import { PrivacyRisk } from '@/constants/types/Transparency';
import { formatPrivacyViolations, getPrivacyRiskLabel } from '@/utils/transparency';

const privacyRiskOrder: Record<PrivacyRisk, number> = {
  [PrivacyRisk.LOW]: 0,
  [PrivacyRisk.MEDIUM]: 1,
  [PrivacyRisk.HIGH]: 2,
};

export const PrivacySleepMode = () => {
    const { lightSensorTransparency, accelerometerTransparency, microphoneTransparency } = useTransparencyStore();
    
    // Sort sensors by privacy risk severity (highest first)
    const sensors = [
        {
            name: 'Accelerometer',
            data: accelerometerTransparency,
        },
        {
            name: 'Light Sensor',
            data: lightSensorTransparency,
        },
        {
            name: 'Microphone',
            data: microphoneTransparency,
        }
    ].sort((a, b) => {
        const riskA = privacyRiskOrder[a.data.privacyRisk ?? PrivacyRisk.LOW];
        const riskB = privacyRiskOrder[b.data.privacyRisk ?? PrivacyRisk.LOW];
        return riskB - riskA; // Sort highest first
    });

    const renderSensorSection = (sensor : any) => {
        const riskLevel = sensor.data.privacyRisk || PrivacyRisk.LOW;
        const isHighRisk = riskLevel !== PrivacyRisk.LOW;
        
        return (
            <View key={sensor.name} style={styles.section}>
                <Text style={styles.sectionTitle}>{sensor.name}</Text>
                <Text style={styles.headerTitle}>
                    {getPrivacyRiskLabel(sensor.data.privacyRisk || PrivacyRisk.LOW)}
                </Text>
                {!isHighRisk && (
                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={styles.linkText}>Relevant Privacy Policy Section - Link to Regulations</Text>
                        <Text style={styles.linkText}>OPT OUT</Text>
                    </TouchableOpacity>
                )}
                {isHighRisk && 
                    <>
                        <Text style={styles.headerText}>
                            {formatPrivacyViolations(sensor.data)}
                        </Text>
                        <TouchableOpacity style={styles.linkButton}>
                            <Text style={styles.linkText}>Relevant Privacy Policy Section - Link to Regulations</Text>
                            <Text style={styles.linkText}>OPT OUT</Text>
                        </TouchableOpacity>
                    </>
                }
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.sensorsContainer}>
                {sensors.map(sensor => renderSensorSection(sensor))}
            </View>

            <TouchableOpacity style={styles.privacyPolicyButton}>
                <Text style={styles.privacyPolicyText}>View Privacy Policy</Text>
            </TouchableOpacity>
        </View>
    );
};

// =============================================================
// Styles
// =============================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 45,
    },
    sensorsContainer: {
        flex: 1,
    },
    section: {
        marginBottom: 14,
        backgroundColor: Colors.lightBlack,
        padding: 12,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 6,
        paddingHorizontal: 8,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        paddingHorizontal: 8,
        marginBottom: 4,
    },
    headerText: {
        color: '#FFFFFF',
        fontSize: 13,
        lineHeight: 17,
        marginBottom: 8,
        paddingHorizontal: 8,
        opacity: 0.9,
    },
    linkButton: {
        alignSelf: 'flex-start',
        marginTop: 4,
        marginBottom: 6,
        paddingHorizontal: 8,
    },
    subSectionContainer: {
        marginBottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 10,
        borderRadius: 6,
        marginTop: 8,
    },
    subSectionText: {
        color: '#FFFFFF',
        fontSize: 13,
        lineHeight: 17,
        marginBottom: 6,
    },
    linkText: {
        color: Colors.hyperlinkBlue,
        textDecorationLine: 'underline',
        fontSize: 13,
        fontWeight: '500',
    },
    privacyPolicyButton: {
        alignSelf: 'center',
        marginTop: 12,
        paddingVertical: 6,
    },
    privacyPolicyText: {
        color: Colors.hyperlinkBlue,
        fontSize: 14,
        textDecorationLine: 'underline',
        textAlign: 'center',
        fontWeight: '500',
    },
});