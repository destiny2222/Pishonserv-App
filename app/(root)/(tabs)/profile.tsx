import TopHeader from "@/components/TopHeader";
import { settings } from "@/constants/data";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useAuth } from "@/hooks/useAuth";
import { Href, router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { getCurrentUser } from "@/libs/endpoints/auth";

interface SettingsItemProps {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}: SettingsItemProps) => (
  <TouchableOpacity
    className="flex flex-row items-center justify-between bg-white py-6 px-3 mb-4 rounded-lg shadow-sm shadow-zinc-200"
    onPress={onPress}
  >
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-8" />
      <Text
        className={`text-xl font-medium font-poppins-medium text-colors-black-300 ${textStyle}`}
      >
        {title}
      </Text>
    </View>
    {showArrow && <Image source={icons.rightArrow} className="size-5" />}
  </TouchableOpacity>
);

const profile = () => {
  const { logout, user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.replace("/(auth)/login");
    } else {
      Alert.alert("Error", result.error || "Logout failed. Please try again.");
    }
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  // Guest user view
  if (!isAuthenticated) {
    return (
      <SafeAreaView className="h-full bg-gray-200" edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-32 px-2"
        >
          <TopHeader title="Profile" />
          <View className="flex flex-col items-center justify-center mt-20 px-5">
            <Image
              source={images.avatar}
              className="size-32 rounded-full mb-6"
            />
            <Text className="text-2xl font-poppins-semibold text-secondary mb-3">
              Welcome, Guest!
            </Text>
            <Text className="text-center text-gray-600 font-poppins mb-8">
              Sign in to access your profile, track orders, and manage your
              account
            </Text>
            <TouchableOpacity
              className="bg-primary-300 py-4 px-8 rounded-lg w-full"
              onPress={handleLogin}
            >
              <Text className="text-white text-center font-poppins-semibold text-lg">
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-4 py-4 px-8"
              onPress={() => router.push("/(auth)/signup")}
            >
              <Text className="text-primary-300 text-center font-poppins-semibold">
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Authenticated user view
  return (
    <SafeAreaView className="h-full bg-gray-200" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}  contentContainerClassName="pb-32 px-2" >
        <TopHeader title="Profile" />
        <View className="flex flex-col items-center relative mt-5">
          <View className="flex flex-col items-center">
            <Image
              source={{ uri: user?.profile_image || images.avatar }}
              className="size-44 relative rounded-full"
            />
            <TouchableOpacity className="absolute bottom-11 right-2">
              <Image source={icons.edit} className="size-9" />
            </TouchableOpacity>
            <Text className="pt-4 font-poppins-semibold text-2xl text-secondary font-semibold">
              {user?.name || ""} {user?.lname || ""}
            </Text>
          </View>
        </View>

        <View className="flex flex-col mt-8 pt-5 border-primary-200">
          {settings.map((item, index) => (
            <SettingsItem
              key={index}
              icon={item.icon}
              title={item.title}
              onPress={() => router.push(item.href as Href)}
            />
          ))}
        </View>

        <View className="flex flex-col mt-5 pt-5 border-primary-200">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            onPress={handleLogout}
            textStyle="text-red-500"
            showArrow={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;
