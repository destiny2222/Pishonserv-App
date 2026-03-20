import { AuthGuard } from '@/components/AuthGuard';
import { UserProvider } from '@/contexts/UserContext';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import './global.css';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function StatusBarWrapper({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 ">
      <StatusBar animated style="auto" />
      {children}
    </View>
  );
}

function LoadingScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#C9A24D" />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    'poppins-bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'poppins-semibold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'poppins-medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'poppins-light': require('../assets/fonts/Poppins-Light.ttf'),
    'poppins-extrabold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'poppins-thin': require('../assets/fonts/Poppins-Thin.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <SafeAreaProvider>
        <LoadingScreen />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBarWrapper>
        <UserProvider>
          <AuthGuard>
            <Stack screenOptions={{ headerShown: false }} />
          </AuthGuard>
        </UserProvider>
      </StatusBarWrapper>
    </SafeAreaProvider>
  );
}
