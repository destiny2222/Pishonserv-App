import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

type TopHeaderProps = {
  title: string;
};

const TopHeader = ({ title }: TopHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <TouchableOpacity
        className="border p-2 rounded-full border-primary"
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={24} color="#C9A24D" />
      </TouchableOpacity>

      <Text className="flex-1 text-center text-2xl font-poppins-semibold text-black-300 mx-3">
        {title}
      </Text>

      {/* Right side spacer so title stays centered */}
      {/* <View className="w-10" /> */}
    </View>
  );
};

export default TopHeader;
