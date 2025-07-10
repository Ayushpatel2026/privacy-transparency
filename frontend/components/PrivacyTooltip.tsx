import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Tooltip from 'react-native-walkthrough-tooltip';
import privacyHighIcon from '../assets/images/privacy-high.png';
import privacyMediumIcon from '../assets/images/privacy-medium.png';
import privacyLowIcon from '../assets/images/privacy-low.png';
import privacyHighOpenIcon from '../assets/images/privacy-high-open.png';
import privacyMediumOpenIcon from '../assets/images/privacy-medium-open.png';
import privacyLowOpenIcon from '../assets/images/privacy-low-open.png';

interface PrivacyTooltipProps {
  color: string;
  iconSize?: number;
  iconName: string;
  violationsDetected: string;
  purpose: string;
  storage: string;
  access: string;
  optOutLink?: string;
  privacyPolicyLink?: string;
  privacyPolicySectionLink?: string;
  dataType: string;
}

const iconMap: { [key: string]: any } = {
  'privacy-high': privacyHighIcon,
  'privacy-medium': privacyMediumIcon,
  'privacy-low': privacyLowIcon,
  'privacy-high-open': privacyHighOpenIcon,
  'privacy-medium-open': privacyMediumOpenIcon,
  'privacy-low-open': privacyLowOpenIcon,
};

export const PrivacyTooltip = ({
  color,
  iconSize = 20,
  iconName,
  violationsDetected,
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
	const iconRef = useRef<TouchableOpacity>(null);

  const iconKey = showTooltip ? `${iconName}-open` : iconName;
  const iconImageUrl = iconMap[iconKey] || privacyLowIcon;

	const screenHeight = Dimensions.get('window').height;

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
    <View style={styles.tooltipContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{dataType} Privacy</Text>
        <TouchableOpacity onPress={() => setShowTooltip(false)}>
          <Ionicons name="close" size={18} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Privacy Violations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Violations Detected:</Text>
          <Text style={styles.sectionText}>
            {violationsDetected}
          </Text>
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
    </View>
  );

  return (
    <Tooltip
      isVisible={showTooltip}
      content={renderTooltipContent()}
      onClose={() => setShowTooltip(false)}
      contentStyle={[styles.tooltipContainer, { backgroundColor: color }]}
      arrowStyle={styles.tooltipArrow}
      placement={tooltipPlacement}
    >
      <TouchableOpacity
        onPress={() => handleIconPress()}
        style={styles.iconButton}
				ref={iconRef}
      >
        <Image
          source={iconImageUrl}
          style={{ width: iconSize, height: iconSize }}
        />
      </TouchableOpacity>
    </Tooltip>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 4,
  },
  tooltipContainer: {
    width: 300,
    padding: 0,
  },
  tooltipContent: {
    borderRadius: 8,
    overflow: 'hidden',
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
    color: '#333',
  },
  content: {
    padding: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  sectionText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
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
  },
});

export default PrivacyTooltip;