import CustomAlert from "@/components/CustomAlert";
import TextInputField from "@/components/TextInputField";
import Watermarks from "@/components/Watermarks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useSignup } from "./_layout";

export default function Step1() {
  const { data, update } = useSignup();
  const [isLoading, setIsLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const next = () => {
    // basic validation
    if (!data.firstName || !data.lastName || !data.email) {
      showAlert("Missing Fields", "Please fill in all required fields (First Name, Last Name, and Email).");
      return;
    }
    
    if (isLoading) return;

    setIsLoading(true);
    setTimeout(() => {
      router.push("/(auth)/signup/step-2");
      setIsLoading(false);
    }, 300);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white justify-center items-center">
        <Watermarks showTopRight showBottomLeft />

        <TouchableOpacity onPress={() => router.back()} className="absolute top-20 left-6 z-10">
          <Ionicons name="arrow-back" size={22} color="#C9A24D" />
        </TouchableOpacity>

        <Text className="text-2xl font-poppins-semibold text-secondary text-center">Sign Up</Text>
        <Text className="text-xs text-gray-300 text-center mt-2">(Personal Details)</Text>

        <View className="space-y-6 w-full px-8 mt-5">
          <Text className="font-poppins-medium text-sm mb-1">First Name <Text className="text-red-500">*</Text></Text>
          <TextInputField
            value={data.firstName}
            onChangeText={(t) => update({ firstName: t })}
            placeholder="Enter your first name"
            className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
          />
        </View>

        <View className="space-y-6 w-full px-8 mt-5">
          <Text className="font-poppins-medium text-sm mb-1">Last Name <Text className="text-red-500">*</Text></Text>
          <TextInputField
            value={data.lastName}
            onChangeText={(t) => update({ lastName: t })}
            placeholder="Enter your last name"
            className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
          />
        </View>

        <View className="space-y-6 w-full px-8 mt-5">
          <Text className="font-poppins-medium text-sm mb-1">Email <Text className="text-red-500">*</Text></Text>
          <TextInputField
            value={data.email}
            onChangeText={(t) => update({ email: t })}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
          />
        </View>

        

        <View className="space-y-6 w-full px-8 mt-6">
          <TouchableOpacity 
            style={{ backgroundColor: '#C9A24D', paddingVertical: 16, borderRadius: 12, alignItems: 'center', opacity: isLoading ? 0.7 : 1 }} 
            onPress={next}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-poppins-semibold">Next</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-9 items-center">
          <Text className="text-lg text-gray-600">
            Already have an account?{" "}
            <Link href="/(auth)/login" className="text-secondary font-poppins-semibold underline">
              Login
            </Link>
          </Text>
        </View>

        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
