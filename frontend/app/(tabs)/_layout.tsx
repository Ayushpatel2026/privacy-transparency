import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";


const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
				headerShown: false, 
        tabBarStyle: styles.tabBarStyle, 
        tabBarItemStyle: { justifyContent: "center" },
        animation: 'shift', // Set animation type
      }}
    >
      <Tabs.Screen
        name="index" // Route for the sleep screen, which is the default tab
        options={{
          title: "Sleep", 
        }}
      />
      <Tabs.Screen
        name="journal" 
        options={{
          title: "Journal", 
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistics",
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
    position: "absolute",
    bottom: "4%",
    marginHorizontal: "10%", 
    width: "80%", 
    height: "6%", 
    backgroundColor: 'grey',
    borderRadius: 100, 
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center", 
  },
});

export default TabLayout;