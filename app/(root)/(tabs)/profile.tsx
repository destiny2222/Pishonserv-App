import TopHeader from "@/components/TopHeader";
import { settings } from "@/constants/data";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useAuth } from "@/hooks/useAuth";
import { updateCurrentUser } from "@/libs/endpoints/auth";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const Profile = () => {
  const { logout, user, isAuthenticated, refreshUser } = useAuth();
  // const [uploadingImage, setUploadingImage] = useState(false);
  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch {
      // console.error("Error logging out:", error)
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  // const handleEditImage = async () => {
  //   const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (!perm.granted) {
  //     Alert.alert("Permission Required", "Please allow access to your photos.");
  //     return;
  //   }

  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ["images"],
  //     quality: 0.6,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     base64: true,
  //   });

  //   if (result.canceled || !result.assets[0]) return;

  //   // const asset = result.assets[0];
  //   // const base64Image = `data:${asset.mimeType ?? "image/jpeg"};base64,${asset.base64}`;

  //   setUploadingImage(true);
  //   try {
  //     await updateCurrentUser({ profile_image: result.assets[0] });
  //     await refreshUser();
  //     Alert.alert("Success", "Profile image updated successfully");
  //   } catch {
  //     // Alert.alert("Error", e?.data?.message || e?.message || "Could not update profile image.");
  //   } finally {
  //     setUploadingImage(false);
  //   }
  // };

  const profileImageSource = user?.profile_image
    ? { uri: user.profile_image }
    : images.avatar;

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32 px-2" >
        <TopHeader title="Profile" />
        <View className="flex flex-col items-center relative mt-5">
          <View className="flex flex-col items-center">
            <View className="relative">
              <Image
                source={profileImageSource}
                className="size-44 rounded-full"
              />
              {/* {uploadingImage && (
                <View className="absolute inset-0 rounded-full bg-black/40 items-center justify-center">
                  <ActivityIndicator color="#fff" size="large" />
                </View>
              )} */}
              {/* <TouchableOpacity
                className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow"
                onPress={handleEditImage}
                disabled={uploadingImage}
              >
                <Image source={icons.edit} className="size-7" />
              </TouchableOpacity> */}
            </View>
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
              onPress={() => router.push(item.href as any)}
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

export default Profile;
