import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: Colors.generalBlue, // Blue color for active tab
        tabBarInactiveTintColor: Colors.grey, // Gray color for inactive tabs
        animation: 'shift',
      }}
    >
      <Tabs.Screen
        name="index" // Sleep screen as default
        options={{
          title: "Sleep",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="moon-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistics",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

// ==========================================================================
// Styles
// ==========================================================================

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: Colors.lightBlack, // this is slightly lighter than the black background
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: Colors.lightBlack
  },
});

export default TabLayout;