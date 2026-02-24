import { AuthGuard } from '@/components/AuthGuard';
import { UserProvider } from '@/contexts/UserContext';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    'poppins-bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'poppins-semibold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'poppins-medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'poppins-light': require('../assets/fonts/Poppins-Light.ttf'),
    'poppins-extrabold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'poppins-thin': require('../assets/fonts/Poppins-Thin.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#C9A24D" className='flex-1 justify-center items-center' />;
  }
  // return <Stack screenOptions={{ headerShown: false }} />;
  return (
    <SafeAreaProvider>
      <UserProvider>
        <AuthGuard>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthGuard>
      </UserProvider>
    </SafeAreaProvider>
  )
}
