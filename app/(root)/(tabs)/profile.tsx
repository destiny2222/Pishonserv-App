import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TopHeader from "@/components/TopHeader";
import { settings } from "@/constants/data";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useAuth } from "@/hooks/useAuth";

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
    className="flex flex-row items-center justify-between bg-white py-6 px-3 mb-4 rounded-lg shadow-sm"
    onPress={onPress}
  >
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="w-8 h-8" />
      <Text
        className={`text-xl font-poppins-medium text-textPrimary ${textStyle || ""}`}
      >
        {title}
      </Text>
    </View>
    {showArrow && <Image source={icons.rightArrow} className="w-5 h-5" />}
  </TouchableOpacity>
);

export default function Profile() {
  const { logout, user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error) {
      // console.log("Logout error", error);
    }
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };


  const profileImageSource = user?.profile_image
    ? { uri: user.profile_image }
    : images.avatar;



  if (!isAuthenticated) {
    return (
      <SafeAreaView key="guest-profile" className="flex-1 bg-background" edges={['top']}>
        <View className="pb-32 px-5">
          <TopHeader title="Profile" />
          <View className="flex flex-col items-center justify-center mt-20">
            <Image
              source={images.avatar}
              className="w-32 h-32 rounded-full mb-6"
            />
            <Text className="text-2xl font-poppins-semibold text-secondary mb-3">
              Welcome, Guest!
            </Text>
            <Text className="text-center text-textSecondary font-poppins mb-8">
              Sign in to access your profile, track orders, and manage your account
            </Text>
            <TouchableOpacity
              className="bg-primary py-4 px-8 rounded-lg w-60"
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
              <Text className="text-primary text-center font-poppins-semibold">
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView key="auth-profile" className="flex-1 bg-background" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32 px-2">
        <TopHeader title="Profile" />
        <View className="flex flex-col items-center relative mt-5">
          <View className="flex flex-col items-center">
            <View className="relative">
              <Image
                source={profileImageSource}
                className="w-44 h-44 rounded-full"
              />
            </View>
            <Text className="pt-4 font-poppins-semibold text-2xl text-textPrimary">
              {`${user?.name || ""} ${user?.lname || ""}`.trim()}
            </Text>
          </View>
        </View>

        <View className="flex flex-col mt-8 pt-5">
          {settings.map((item, index) => (
            <SettingsItem
              key={index}
              icon={item.icon}
              title={item.title}
              onPress={() => {
                if (item.href) router.push(item.href as any);
              }}
            />
          ))}
        </View>

        <View className="flex flex-col mt-5">
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
}