import { View, Text } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, login, isCheckingAuth } = useAuthStore();

  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      console.log("Login successful");
      // Navigate to home screen
    } else {
      console.error("Login failed:", result.message);
      // Show error message to user
    }
  }

  return (
    <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
    >
      <Text>Login Screen</Text>
      <Link href="/register">Register</Link>
    </View>
  );
}