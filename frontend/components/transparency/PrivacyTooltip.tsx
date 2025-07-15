import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, Image, Dimensions, ScrollView } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { PrivacyIcon } from './PrivacyIcon';
import { getPrivacyRiskLabel } from '@/utils/transparency';
import { PrivacyRisk } from '@/constants/types/Transparency';

interface PrivacyTooltipProps {
  color: string;
  iconSize?: number;
  iconName: string;
  violationsDetected: string;
  privacyViolations?: string;
  purpose: string;
  storage: string;
  access: string;
  optOutLink?: string;
  privacyPolicyLink?: string;
  privacyPolicySectionLink?: string;
  dataType: string;
}

/**
 * TODO - fix the scrolling on the tool tips, currently scrolling is very sensitive and hard to do
 * and the tooltip often closes when you scroll. Not a priority fix, as generally tooltip should not be too long.
 * May need to make a custom tooltip component for this. 
 */
export const PrivacyTooltip = ({
  color,
  iconSize = 20,
  iconName,
  violationsDetected,
  privacyViolations,
  purpose,
  storage,
  access,
  optOutLink,
  privacyPolicyLink,
  privacyPolicySectionLink,
  dataType
}: PrivacyTooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
	const [tooltipPlacement, setTooltipPlacement] = useState<'top' | 'bottom'>('bottom');
	const iconRef = useRef<TouchableOpacity>(null); // VS code shows type error but this still works

	const screenHeight = Dimensions.get('window').height;
	const screenWidth = Dimensions.get('window').width;

	const handleIconPress = () => {
		if (iconRef.current) {
			console.log("Icon pressed, measuring position");
			iconRef.current.measure((x : number, y : number, width : number, height : number, pageX : number, pageY : number) => {
				if (pageY > screenHeight / 2) {
					setTooltipPlacement('top');
					setShowTooltip(true);
				} else {
					setTooltipPlacement('bottom');
					setShowTooltip(true);
				}
				
			});
		}
	};


  const handleLinkPress = async (url: string, linkType: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open ${linkType} link`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to open ${linkType} link`);
    }
  };

  const renderTooltipContent = () => (
    <ScrollView 
      style={[styles.tooltipContent, { height: 400 }]}
      contentContainerStyle={styles.scrollContentContainer}
      showsVerticalScrollIndicator={true}
      persistentScrollbar={true}
      bounces={true}
      nestedScrollEnabled={true}
      scrollEventThrottle={16}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        {/* Privacy Violations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{violationsDetected}</Text>
          {(violationsDetected !== getPrivacyRiskLabel(PrivacyRisk.LOW)) && (
            <Text style={styles.sectionText}>
              {privacyViolations}
            </Text>
          )}
        </View>

        {/* Purpose */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Purpose:</Text>
          <Text style={styles.sectionText}>{purpose}</Text>
        </View>

        {/* Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage:</Text>
          <Text style={styles.sectionText}>{storage}</Text>
        </View>

        {/* Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Access:</Text>
          <Text style={styles.sectionText}>{access}</Text>
        </View>

        {/* Links */}
        {(optOutLink || privacyPolicyLink || privacyPolicySectionLink) && (
          <View style={styles.linksSection}>
            {privacyPolicySectionLink && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => handleLinkPress(privacyPolicySectionLink, 'Privacy Policy Section')}
              >
                <Text style={styles.linkText}>Link to privacy policy section</Text>
              </TouchableOpacity>
            )}

            {optOutLink && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => handleLinkPress(optOutLink, 'Opt Out')}
              >
                <Text style={styles.linkText}>Link to Opt Out</Text>
              </TouchableOpacity>
            )}

            {privacyPolicyLink && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => handleLinkPress(privacyPolicyLink, 'Privacy Policy')}
              >
                <Text style={styles.linkText}>Link to Full Privacy Policy</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <Tooltip
      isVisible={showTooltip}
      content={renderTooltipContent()}
      onClose={() => setShowTooltip(false)}
      contentStyle={[styles.tooltipContainer, { backgroundColor: color, width: screenWidth * 0.8 }]}
      arrowStyle={styles.tooltipArrow}
      placement={tooltipPlacement}
    >
      <PrivacyIcon
        handleIconPress={handleIconPress}
        isOpen={showTooltip}
        iconName={iconName}
        iconSize={iconSize}
        iconRef={iconRef}
      />
    </Tooltip>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    padding: 0,
    height: 400, 
  },
  tooltipContent: {
    borderRadius: 8,
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 10, 
  },
  tooltipArrow: {
    // Custom arrow styling if needed
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  content: {
    padding: 16, 
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 2,
  },
  sectionText: {
    fontSize: 12,
    color: 'black',
    lineHeight: 16,
    flexWrap: 'wrap',
  },
  linksSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  linkButton: {
    paddingVertical: 6,
  },
  linkText: {
    fontSize: 12,
    color: '#007AFF',
    textDecorationLine: 'underline',
    flexWrap: 'wrap',
  },
});

export default PrivacyTooltip;