import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useTransparencyStore } from '@/store/transparencyStore';
import { DataDestination, PrivacyRisk } from '@/constants/types/Transparency';
import { formatPrivacyViolations, getPrivacyRiskIcon, getPrivacyRiskLabel } from '@/utils/transparency';
import { SensorPrivacyIcon } from './SensorPrivacyIcon';

export const PrivacyJournalPage = () => {
    const { journalTransparency, accelerometerTransparency } = useTransparencyStore();
    const isAccelerometerMoreSevere = 
        (accelerometerTransparency.privacyRisk ?? PrivacyRisk.LOW) > 
        (journalTransparency.privacyRisk ?? PrivacyRisk.LOW);

    const renderJournalSection = () => {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Journal</Text>
                <Text style={styles.headerTitle}>
                    {getPrivacyRiskLabel(journalTransparency.privacyRisk || PrivacyRisk.LOW)}
                </Text>
                {!(journalTransparency.privacyRisk === PrivacyRisk.LOW) && 
                    <>
                        <Text style={styles.headerText}>
                            {formatPrivacyViolations(journalTransparency)}
                        </Text>
                        <TouchableOpacity style={styles.linkButton}>
                            <Text style={styles.linkText}>Relevant Privacy Policy Section - Link to Regulations</Text>
                        </TouchableOpacity>
                    </>
                }
                <View style={styles.subSectionContainer}>
                    <Text style={styles.subSectionText}>
                        <Text style={{fontWeight: 'bold'}}>Purpose: </Text> {journalTransparency.aiExplanation!.why}
                    </Text>
                    <Text style={styles.subSectionText}>
                        <Text style={{fontWeight: 'bold'}}>Storage: </Text> {journalTransparency.aiExplanation!.storage}
                    </Text>
                    <Text style={styles.subSectionText}>
                        <Text style={{fontWeight: 'bold'}}>Access: </Text> {journalTransparency.aiExplanation!.access}
                    </Text>
                </View>
            </View>
        )
    }

    const renderAccelerometerSection = () => {
        return (
            <View style={styles.section}>
                <View style={styles.activityHeader}>
                    <Text style={styles.sectionTitle}>Activity Tracker</Text>
                    <View style={styles.activityIconContainer}>
                        <SensorPrivacyIcon
                            sensorType="accelerometer"
                            iconName={getPrivacyRiskIcon(accelerometerTransparency.privacyRisk || PrivacyRisk.LOW)}
                            storageType={accelerometerTransparency.storageLocation === DataDestination.GOOGLE_CLOUD ? 'cloud' : 'local'}
                            handleIconPress={() => {}}
                        />
                    </View>
                </View>

                <Text style={styles.headerTitle}>
                    {getPrivacyRiskLabel(accelerometerTransparency.privacyRisk || PrivacyRisk.LOW)}
                </Text>
                {!(accelerometerTransparency.privacyRisk === PrivacyRisk.LOW) && 
                    <>
                        <Text style={styles.headerText}>
                            {formatPrivacyViolations(accelerometerTransparency)}
                        </Text>
                        <TouchableOpacity style={styles.linkButton}>
                            <Text style={styles.linkText}>Relevant Privacy Policy Section - Link to Regulations</Text>
                        </TouchableOpacity>
                    </>
                }
                <View style={styles.subSectionContainer}>
                    <Text style={styles.subSectionText}>
                        <Text style={{fontWeight: 'bold'}}>Purpose: </Text> {accelerometerTransparency.aiExplanation!.why}
                    </Text>
                    <Text style={styles.linkText}>OPT OUT</Text>
                    <Text style={styles.subSectionText}>
                        <Text style={{fontWeight: 'bold'}}>Storage: </Text> {accelerometerTransparency.aiExplanation!.storage}
                    </Text>
                    <Text style={styles.subSectionText}>
                        <Text style={{fontWeight: 'bold'}}>Access: </Text> {accelerometerTransparency.aiExplanation!.access}
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {isAccelerometerMoreSevere ?
                <>
                    {renderAccelerometerSection()}
                    {renderJournalSection()}
                </> :
                <>
                    {renderJournalSection()}
                    {renderAccelerometerSection()}
                </>
            }
        

            {/* Privacy Policy Link */}
            <TouchableOpacity style={styles.privacyPolicyButton}>
                <Text style={styles.privacyPolicyText}>View our Privacy Policy</Text>
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
        paddingVertical: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        paddingHorizontal: 15,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
        paddingHorizontal: 15,
    },
    headerText: {
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
        paddingHorizontal: 15,
    },
    linkButton: {
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    activityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    activityIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subSectionContainer: {
        marginBottom: 16,
        backgroundColor: Colors.lightBlack,
        padding: 15,
        borderRadius: 12,
    },
    subSectionLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    subSectionText: {
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    linkText: {
        color: Colors.hyperlinkBlue,
        textDecorationLine: 'underline',
    },
    privacyPolicyButton: {
        alignSelf: 'flex-start',
        marginTop: 20,
    },
    privacyPolicyText: {
        color: Colors.hyperlinkBlue,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});