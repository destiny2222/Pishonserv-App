import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AppLayout() {
    const [isLoading, setIsLoading] = useState(false)

    // useEffect(() => {
    //     const boot = async () => {
    //     const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
    //     //   setIsLoading(true)
    //     if (hasSeenOnboarding === "true") {
    //         router.replace("/(auth)/login");
    //     } else {
    //         router.replace("/(onboarding)");
    //     }
    //        setIsLoading(false);
    //     }

    //     boot();
    // }, []);

    if (isLoading) {
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size="large" color="#C9A24D" />
            </View>
        );
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
