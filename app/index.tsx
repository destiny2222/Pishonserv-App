import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
    const [isFirstLaunch, setIsFirstLaunch] = useState < boolean | null > (null);

    useEffect(() => {
        const checkFirstLaunch = async () => {
            try {
                const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
                setIsFirstLaunch(hasSeenOnboarding !== 'true');
            } catch {
                setIsFirstLaunch(true);
            }
        };

        checkFirstLaunch();
    }, []);

    if (isFirstLaunch === null) {
        return (  
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#C9A24D" />
            </View>
        );
    }

    if (isFirstLaunch) {
        return <Redirect href="/(onboarding)" />;
    }

    return <Redirect href="/(root)/(tabs)/home" />;
}
