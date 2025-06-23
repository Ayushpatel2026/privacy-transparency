import { View, Text, TouchableOpacity } from "react-native";
import { useAuthStore } from "@/store/authStore";

export default function Profile() {

  const { user, logout } = useAuthStore();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Profile Screen</Text>
      <TouchableOpacity onPress={() => logout()}>
        <Text>
          LOGOUT
        </Text>
      </TouchableOpacity>
    </View>
  );
}