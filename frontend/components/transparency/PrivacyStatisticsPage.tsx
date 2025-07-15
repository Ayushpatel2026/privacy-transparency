import { Colors } from '@/constants/Colors';
import { PrivacyRisk } from '@/constants/types/Transparency';
import { useTransparencyStore } from '@/store/transparencyStore';
import { formatPrivacyViolations, getPrivacyRiskLabel } from '@/utils/transparency';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * TODO - this page is exact same as PrivacySleepPage.tsx, turn this into a generic component that can be reused
 */
export const PrivacyStatisticsPage = () => {
    const { statisticsTransparency } = useTransparencyStore();
    
    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>
                    {getPrivacyRiskLabel(statisticsTransparency.privacyRisk || PrivacyRisk.LOW)}
                </Text>
                {!(statisticsTransparency.privacyRisk === PrivacyRisk.LOW) && 
                    <>
                        <Text style={styles.headerText}>
                            {formatPrivacyViolations(statisticsTransparency)}
                        </Text>
                        <TouchableOpacity style={styles.linkButton}>
                            <Text style={styles.linkText}>Relevant Privacy Policy Section - Link to Regulations</Text>
                        </TouchableOpacity>
                    </>
                }
            </View>

            <View style={styles.section}>
                <View style={styles.subSectionContainer}>
                    <Text style={styles.subSectionText}>
                        <Text style={{fontWeight: 'bold'}}>Purpose: </Text> {statisticsTransparency.aiExplanation!.why}
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.subSectionContainer}>
                    <Text style={styles.subSectionText}>
                        <Text style={{fontWeight: 'bold'}}>Storage: </Text> {statisticsTransparency.aiExplanation!.storage}
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.subSectionContainer}>
                    <Text style={styles.subSectionText}>
                        <Text style={{fontWeight: 'bold'}}>Access: </Text> {statisticsTransparency.aiExplanation!.access}
                    </Text>
                </View>
            </View>

            {/* Privacy Policy Link */}
            <TouchableOpacity style={styles.privacyPolicyButton}>
                <Text style={styles.privacyPolicyText}>View our Full Privacy Policy</Text>
            </TouchableOpacity>
        </View>
    );
};

// ===============================================================
// Styles
// ===============================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    headerSection: {
        marginBottom: 30,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
    },
    headerText: {
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    linkButton: {
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    linkText: {
        color: Colors.hyperlinkBlue,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    section: {
        marginBottom: 20,
    },
    subSectionContainer: {
        backgroundColor: Colors.lightBlack,
        padding: 15,
        borderRadius: 12,
    },
    subSectionText: {
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 20,
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
