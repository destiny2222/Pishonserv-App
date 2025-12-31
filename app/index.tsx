import { useEffect  } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    const boot = async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      if (hasSeenOnboarding === "true") {
        router.replace("/(auth)/login"); // or "/(tabs)/home" if already logged in
      } else {
        router.replace("/(onboarding)");
      }
    };

    boot();
  }, []);
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#0000ff" />
      {/* <Text className="text-lg font-semibold text-red-800">Edit app/index.tsx to edit this screen.</Text> */}
    </View>
  );
}
