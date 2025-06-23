import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import AuthInput from '@/components/AuthInput';
import GeneralButton from '@/components/GeneralButton';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isLoading, register } = useAuthStore();
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    const result = await register(firstName, lastName, email, password);
    if (result.success) {
      console.log('Registration successful');
      // Navigate to home screen
    } else {
      console.error('Registration failed:', result.message);
      // Show error message to user
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      <View style={styles.content}>
        <Text style={styles.title}>Register Now!</Text>
        <Text style={styles.subtitle}>Create an account</Text>

        <View style={styles.form}>
          <AuthInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AuthInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

		  <AuthInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />

          <AuthInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            showPasswordToggle={true}
          />

          <AuthInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            showPasswordToggle={true}
          />

          <GeneralButton
            title="Register"
            onPress={handleRegister}
            isLoading={isLoading}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Do you have an account? </Text>
			<TouchableOpacity onPress={() => router.push('/')}>
				<Text style={styles.loginLink}>Sign In</Text>
			</TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ===========================================================================
// Styles
// ===========================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 40,
  },
  form: {
    flex: 1,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  loginLink: {
    color: Colors.hyperlinkBlue,
    fontSize: 16,
    fontWeight: '600',
  },
});