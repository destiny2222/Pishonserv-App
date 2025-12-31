import React from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { router, Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Watermarks from "@/components/Watermarks";
import { useSignup } from "./_layout";
import { Picker } from "@react-native-picker/picker";

export default function Step3() {
  const { data, update } = useSignup();

  const register = async () => {
    if (!data.password || data.password !== data.confirmPassword || !data.role) return;

    // TODO: call your API here
    console.log("REGISTER DATA:", data);

    router.replace("/(auth)/login");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white px-6 pt-12 relative">
        <Watermarks showTopRight showBottomLeft />

        <TouchableOpacity onPress={() => router.back()} className="absolute top-12 left-6 z-10">
          <Ionicons name="arrow-back" size={22} color="#C9A24D" />
        </TouchableOpacity>

        <Text className="text-2xl font-poppins-semibold text-secondary text-center">Sign Up</Text>
        <Text className="text-xs text-gray-300 text-center mt-2">(Security)</Text>

        <View className="mt-10">
          <Text className="font-poppins-medium text-sm mb-2">Password <Text className="text-red-500">*</Text></Text>
          <TextInput
            value={data.password}
            onChangeText={(t) => update({ password: t })}
            placeholder="Input password"
            secureTextEntry
            className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium px-4 py-4"
          />
        </View>

        <View className="mt-6">
          <Text className="font-poppins-medium text-sm mb-2">Re-enter Password <Text className="text-red-500">*</Text></Text>
          <TextInput
            value={data.confirmPassword}
            onChangeText={(t) => update({ confirmPassword: t })}
            placeholder="Re-enter password"
            secureTextEntry
            className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium px-4 py-4"
          />
        </View>

        <View className="mt-6">
          <Text className="font-poppins-medium text-sm mb-2">Select Role <Text className="text-red-500">*</Text></Text>
          <View className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium overflow-hidden">
            <Picker
              selectedValue={data.role}
              onValueChange={(v) => update({ role: v })}
            >
              <Picker.Item label="Select a role" value="" />
              <Picker.Item label="Customer" value="customer" />
              <Picker.Item label="Agent" value="agent" />
              <Picker.Item label="Property Owner" value="owner" />
            </Picker>
          </View>
        </View>

        <View className="mt-10">
          <View className="bg-[#C9A24D] rounded-xl py-4 items-center" onTouchEnd={register}>
            <Text className="text-white font-poppins-semibold">Register</Text>
          </View>
        </View>

        <View className="mt-8 items-center">
          <Text className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/(auth)/login" className="text-secondary font-poppins-semibold underline">
              Login
            </Link>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
