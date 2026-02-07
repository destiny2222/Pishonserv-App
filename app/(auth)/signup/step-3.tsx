import CustomAlert from "@/components/CustomAlert";
import Watermarks from "@/components/Watermarks";
import { useAuth } from "@/hooks/useAuth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useSignup } from "./_layout";

export default function Step3() {
  const { data, update } = useSignup();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

const handleSubmit = async () => {
  if (!data.password || data.password !== data.confirmPassword || !data.role) return;

  setIsLoading(true);
  try {
    const result = await register({
      name: data.firstName,
      lname: data.lastName,
      email: data.email,
      phone: `${data.phoneCode}${data.phoneNumber}`,
      address: data.address,
      state: data.state,
      city: data.city,
      password: data.password,
      role: data.role,
    });

    if (result.success) {
      showAlert("Success", "Registration successful! Please verify your email.");
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { email: data.email }
      });
    } else {
      const errorMessage = result.error.includes("409")
        ? "This email is already registered. Please use a different email."
        : result.error || "An error occurred. Please try again.";
      showAlert("Error", errorMessage);
    }
  } catch (error) {
    // Removed console.log to prevent error details from being displayed in the console
    showAlert("Error", "An unexpected error occurred. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-white  px-6 pt-40 relative">
          <Watermarks showTopRight showBottomLeft />

          <TouchableOpacity onPress={() => router.back()} className="absolute top-20 left-6 z-10">
            <Ionicons name="arrow-back" size={22} color="#C9A24D" />
          </TouchableOpacity>

          <Text className="text-2xl font-poppins-semibold text-secondary text-center">Sign Up</Text>
          <Text className="text-xs text-gray-300 text-center mt-2">(Security)</Text>

          <View className="mt-10">
            <Text className="font-poppins-medium text-sm mb-2">Password <Text className="text-red-500">*</Text></Text>
            <View className="relative">
              <TextInput
                value={data.password}
                onChangeText={(t) => update({ password: t })}
                placeholder="Input password"
                secureTextEntry={!showPassword}
                className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium px-4 py-4 pr-12"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4"
              >
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-6">
            <Text className="font-poppins-medium text-sm mb-2">Re-enter Password <Text className="text-red-500">*</Text></Text>
            <View className="relative">
              <TextInput
                value={data.confirmPassword}
                onChangeText={(t) => update({ confirmPassword: t })}
                placeholder="Re-enter password"
                secureTextEntry={!showConfirmPassword}
                className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium px-4 py-4 pr-12"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4"
              >
                <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-6">
            <Text className="font-poppins-medium text-sm mb-2">Select Role <Text className="text-red-500">*</Text></Text>
            <View className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium overflow-hidden">
              <Picker
                selectedValue={data.role}
                onValueChange={(v) => update({ role: v })}
              >
                <Picker.Item label="Select a role" value="" />
                <Picker.Item label="Customer" value="buyer" />
                <Picker.Item label="Agent" value="agent" />
                <Picker.Item label="Property Owner" value="owner" />
              </Picker>
            </View>
          </View>

          <View className="mt-10">
            <TouchableOpacity className="bg-primary rounded-xl py-4 items-center" 
              onPress={handleSubmit}
              disabled={isLoading || !data.password || data.password !== data.confirmPassword || !data.role}
              >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-poppins-semibold">Register</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-8 items-center">
            <Text className="text-sm text-gray-600">
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
