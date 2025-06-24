import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
}

const OnboardingHeader = ({ title, onBackPress }: HeaderProps) => {
  return (
    <View style={styles.header}>
      {onBackPress && <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={Colors.generalBlue} />
      </TouchableOpacity>}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

// =============================================================
// STYLES
// =============================================================

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: 60,
    paddingBottom: 20, 
    position: 'relative',
    minHeight: 120,
  },
  backButton: {
    position: 'absolute',
    top: 60, 
    left: 20,
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 1, 
  },
  headerTitle: {
    position: 'absolute',
    left: 0, 
    right: 0,
    top: 75,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', 
  }
});

export default OnboardingHeader;