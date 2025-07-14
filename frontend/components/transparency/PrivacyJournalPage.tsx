import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { useTransparencyStore } from '@/store/transparencyStore';
import privacyIcon from '@/assets/images/accelerometer-local.png'

export const PrivacyJournalPage = () => {
    const { journalTransparency, accelerometerTransparency } = useTransparencyStore();
    return (
        <View style={styles.container}>
            {/* Journal Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Journal</Text>
                <View style={styles.subSectionContainer}>
                    <Text style={styles.subSectionLabel}>Purpose:</Text>
                    <Text style={styles.subSectionText}>
                        {journalTransparency.aiExplanation!.why}
                    </Text>
                    <Text style={styles.subSectionLabel}>Storage:</Text>
                    <Text style={styles.subSectionText}>
                        {journalTransparency.aiExplanation!.storage}
                    </Text>
                    <Text style={styles.subSectionLabel}>Access:</Text>
                    <Text style={styles.subSectionText}>
                        {journalTransparency.aiExplanation!.access}
                    </Text>
                </View>
            </View>

            {/* Activity Tracker Section */}
            <View style={styles.section}>
                <View style={styles.activityHeader}>
                    <Text style={styles.sectionTitle}>Activity Tracker</Text>
                    <View style={styles.activityIconContainer}>
                        <Image
                            source={privacyIcon}
                            style={{ width: 109, height: 38 }} // these dimensions are from the figma design
                        />
                    </View>
                </View>
                
                <View style={styles.subSectionContainer}>
                    <Text style={styles.subSectionLabel}>Purpose:</Text>
                    <Text style={styles.subSectionText}>
                        {accelerometerTransparency.aiExplanation!.why}
                        <Text style={styles.linkText}>OPT OUT</Text>
                    </Text>
                    <Text style={styles.subSectionLabel}>Storage:</Text>
                    <Text style={styles.subSectionText}>
                        {accelerometerTransparency.aiExplanation!.storage}
                    </Text>
                    <Text style={styles.subSectionLabel}>Access:</Text>
                    <Text style={styles.subSectionText}>
                        {accelerometerTransparency.aiExplanation!.access}
                    </Text>
                </View>
            </View>

            {/* Privacy Policy Link */}
            <TouchableOpacity style={styles.privacyPolicyButton}>
                <Text style={styles.privacyPolicyText}>View our Privacy Policy</Text>
            </TouchableOpacity>
        </View>
    );
};

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
        padding: 20,
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