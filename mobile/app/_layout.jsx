import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useEffect } from "react";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }


  return (
    <StripeProvider
      publishableKey={
        process.env
          .EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
      }
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(rider)" />
        <Stack.Screen name="(driver)" />
      </Stack>
    </StripeProvider>
  );
}