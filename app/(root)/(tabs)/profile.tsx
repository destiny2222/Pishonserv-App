import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TopHeader from "@/components/TopHeader";
import { settings } from "@/constants/data";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useAuth } from "@/hooks/useAuth";
import { StatusBar } from "expo-status-bar";

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
  const { logout, deleteAccount, user, isAuthenticated } = useAuth();
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Logout", "Logout successful");
      router.replace("/home");
    } catch (error) {

    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action is irreversible and will deactivate your access.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              const result = await deleteAccount();
              if (result.success) {
                Alert.alert("Success", "Your account has been deleted.");
                router.replace("/home");
              } else {
                Alert.alert("Error", result.error || "Failed to delete account");
              }
            } catch (error) {
              Alert.alert("Error", "An unexpected error occurred.");
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
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
        <StatusBar style="dark" />
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
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
              />
              {isImageLoading && (
                <View className="absolute inset-0 items-center justify-center bg-black/10 rounded-full">
                  <ActivityIndicator size="large" color="#0061FF" />
                </View>
              )}
            </View>
            <Text className="pt-4 font-poppins-semibold text-2xl text-textPrimary">
              {`${user?.name || ""} ${user?.lname || ""}`.trim()}
            </Text>
            {user?.email && (
              <Text className="text-textSecondary font-poppins text-base">
                {user.email}
              </Text>
            )}
          </View>
        </View>

        <View className="flex flex-col mt-8 pt-5">
          {settings.map((item, index) => (
            <SettingsItem
              key={index}
              icon={item.icon}
              title={item.title}
              textStyle={item.textStyle}
              onPress={() => {
                if (item.title === "Delete Account") {
                  handleDeleteAccount();
                  return;
                }
                if (item.href) {
                  if (item.href.startsWith("mailto:")) {
                    Linking.openURL(item.href);
                  } else {
                    router.push(item.href as any);
                  }
                }
              }}
            />
          ))}
        </View>

        <View className="flex flex-col mt-5">
          {isDeleting ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <SettingsItem
              icon={icons.logout}
              title="Logout"
              onPress={handleLogout}
              textStyle="text-red-500"
              showArrow={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
