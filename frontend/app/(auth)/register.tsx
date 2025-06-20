import { View, Text } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function Register() {
	
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const {user, token, isLoading, register} = useAuthStore();

	const handleRegister = async () => {
		const result = await register(firstName, lastName, email, password);
		if (result.success) {
			console.log("Registration successful");
			// Navigate to home screen
		} else {
			console.error("Registration failed:", result.message);
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
			<Text>Register Screen</Text>
			<Link href="/">Login</Link>
		</View>
	);
}