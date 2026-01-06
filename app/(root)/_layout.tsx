import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Slot, Stack } from 'expo-router';

export default function AppLayout() {
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const boot = async () => {
        const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
        //   setIsLoading(true)
        if (hasSeenOnboarding === "true") {
            router.replace("/(tabs)/home");
        } else {
            router.replace("/(onboarding)");
        }
           setIsLoading(false);
        }

        boot();
    }, []);

    if (isLoading) {
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator  />
            </View>
        );
    }

    return <Stack  screenOptions={{ headerShown: false }} />;
}
