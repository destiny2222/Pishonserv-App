import React from "react";
import { Keyboard, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { router, Link } from "expo-router";
import Watermarks from "@/components/Watermarks";
import { useSignup } from "./_layout";
import TextInputField from "@/components/TextInputField";
import Button from "@/components/Button";

export default function Step1() {
  const { data, update } = useSignup();

  const next = () => {
    // basic validation
    if (!data.firstName || !data.lastName || !data.email) return;
    router.push("/(auth)/signup/step-2");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white justify-center items-center">
        <Watermarks showTopRight showBottomLeft />

        <Text className="text-2xl font-poppins-semibold text-secondary text-center">Sign Up</Text>
        <Text className="text-xs text-gray-300 text-center mt-2">(Personal Details)</Text>

        <View className="'space-y-6 w-full px-8 mt-10">
          <Text className="font-poppins-medium text-sm mb-2">First Name <Text className="text-red-500">*</Text></Text>
          <TextInputField
            value={data.firstName}
            onChangeText={(t) => update({ firstName: t })}
            placeholder="Enter your first name"
            className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
          />
        </View>

        <View className="'space-y-6 w-full px-8 mt-7">
          <Text className="font-poppins-medium text-sm mb-2">Last Name <Text className="text-red-500">*</Text></Text>
          <TextInputField
            value={data.lastName}
            onChangeText={(t) => update({ lastName: t })}
            placeholder="Enter your last name"
            className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
          />
        </View>

        <View className="'space-y-6 w-full px-8 mt-7">
          <Text className="font-poppins-medium text-sm mb-2">Email <Text className="text-red-500">*</Text></Text>
          <TextInputField
            value={data.email}
            onChangeText={(t) => update({ email: t })}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
          />
        </View>

        <View className="space-y-6 w-full px-8 mt-10">
          <Button style={{backgroundColor: '#C9A24D', paddingVertical: 16, borderRadius: 12, alignItems: 'center'}} onTouchEnd={next}  >
            <Text className="text-white font-poppins-semibold">Next</Text>
          </Button>
        </View>

        <View className="mt-9 items-center">
          <Text className="text-lg text-gray-600">
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
