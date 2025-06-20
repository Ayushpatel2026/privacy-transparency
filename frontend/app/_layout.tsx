import { useAuthStore } from "@/store/authStore";
import { Stack, useRouter, useSegments, SplashScreen} from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  // Get where the user is in the navigation stack
  const segments = useSegments();

  const { checkAuth, user, token } = useAuthStore();
  const [fontsLoaded] = useFonts({
    "SpaceMono-Regular": require("@/assets/fonts/SpaceMono-Regular.ttf"),
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

  }, [fontsLoaded]);

  useEffect(() => {
    checkAuth()
  }, []);

  // handle the navigation based on authentication state
  useEffect(() => {
    const inAuthStack = segments[0] === "(auth)";
    // TODO - figure out how to handle the routing of the onboarding stack
    const inOnboardingStack = segments[0] === "(onboarding)";

    const isAuthenticated = user && token;

    if (!isAuthenticated && !inAuthStack) {
      router.replace("/(auth)");
    }
    else if (isAuthenticated && inAuthStack) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments]);


  return <Stack screenOptions={{headerShown: false}}>
    <Stack.Screen name="(onboarding)" />
    <Stack.Screen name="(tabs)" />
    <Stack.Screen name="(auth)" />
  </Stack>;
}
