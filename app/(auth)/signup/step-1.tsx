import CustomAlert from "@/components/CustomAlert";
import TextInputField from "@/components/TextInputField";
import Watermarks from "@/components/Watermarks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Keyboard, RefreshControl, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSignup } from "./_layout";

export default function Step1() {
  const { data, update } = useSignup();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneCodeError, setPhoneCodeError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateEmail = (email: string) => emailRegex.test(email);

  const validatePhoneCode = (phoneCode: string) => /^\+\d{1,6}$/.test(phoneCode.trim());
  const validatePhoneNumber = (phoneNumber: string) => /^\+?[0-9]{7,15}$/.test(phoneNumber.replace(/\s/g, ""));

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleFirstNameChange = (text: string) => {
    update({ firstName: text });
    setFirstNameError(text.trim() ? "" : "First name is required.");
  };

  const handleLastNameChange = (text: string) => {
    update({ lastName: text });
    setLastNameError(text.trim() ? "" : "Last name is required.");
  };

  const handleEmailChange = (text: string) => {
    update({ email: text });

    if (!text) {
      setEmailError("Email is required.");
      return;
    }

    setEmailError(validateEmail(text) ? "" : "Please enter a valid email address.");
  };

  const handlePhoneCodeChange = (text: string) => {
    update({ phoneCode: text });

    if (!text) {
      setPhoneCodeError("Phone code is required.");
      return;
    }

    setPhoneCodeError(validatePhoneCode(text) ? "" : "Enter a valid code.");
  };

  const handlePhoneNumberChange = (text: string) => {
    update({ phoneNumber: text });

    if (!text) {
      setPhoneNumberError("Phone number is required.");
      return;
    }

    setPhoneNumberError(validatePhoneNumber(text) ? "" : "Enter a valid phone number.");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    update({ firstName: "", lastName: "", email: "", phoneCode: "", phoneNumber: "" });
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPhoneCodeError("");
    setPhoneNumberError("");
    await new Promise((resolve) => setTimeout(resolve, 400));
    setRefreshing(false);
  };

  const next = () => {
    // basic validation
    if (!data.firstName || !data.lastName || !data.email || !data.phoneNumber) {
      setFirstNameError(data.firstName ? "" : "First name is required.");
      setLastNameError(data.lastName ? "" : "Last name is required.");
      setEmailError(data.email ? "" : "Email is required.");
      setPhoneNumberError(data.phoneNumber ? "" : "Phone number is required.");
      showAlert("Missing Fields", "Please fill in all required fields (First Name, Last Name, Email, and Phone Number).");
      return;
    }

    if (!validateEmail(data.email)) {
      setEmailError("Please enter a valid email address.");
      showAlert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!validatePhoneCode(data.phoneCode) || !validatePhoneNumber(data.phoneNumber)) {
      setPhoneCodeError(validatePhoneCode(data.phoneCode) ? "" : "Enter a valid code.");
      setPhoneNumberError(validatePhoneNumber(data.phoneNumber) ? "" : "Enter a valid phone number.");
      showAlert("Invalid Phone", "Please enter a valid phone number.");
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
      <View className="flex-1 bg-white justify-center items-center relative" style={{ paddingTop: insets.top + 150 }}>
        <Watermarks showTopRight showBottomLeft />

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: 'absolute', top: insets.top + 80, left: 16, zIndex: 10 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="z-10 backdrop:blur-sm bg-white/30 rounded-full p-2"
        >
          <Ionicons name="arrow-back" size={22} color="#0D3B66" />
        </TouchableOpacity>

        <Text className="text-2xl font-poppins-semibold text-secondary text-center">Sign Up</Text>
        <Text className="text-xs text-gray-300 text-center mt-2">(Personal Details)</Text>

        <ScrollView
          className="w-full"
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "flex-start", paddingBottom: 24, paddingTop: 12 }}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={true}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#C9A24D"]} tintColor="#C9A24D" />}
        >
        <View className="space-y-6 w-full px-8 mt-5">
          <Text className="font-poppins-medium text-sm mb-1">First Name <Text className="text-red-500">*</Text></Text>
          <TextInputField
            value={data.firstName}
            onChangeText={handleFirstNameChange}
            placeholder="Enter your first name"
            className={`border focus:border-primary ${firstNameError ? "border-red-500" : "border-gray-300"} bg-white text-base font-poppins-medium`}
          />
          {firstNameError ? (
            <Text className="text-xs text-red-500 font-poppins-medium mt-1">{firstNameError}</Text>
          ) : null}
        </View>

        <View className="space-y-6 w-full px-8 mt-5">
          <Text className="font-poppins-medium text-sm mb-1">Last Name <Text className="text-red-500">*</Text></Text>
          <TextInputField
            value={data.lastName}
            onChangeText={handleLastNameChange}
            placeholder="Enter your last name"
            className={`border focus:border-primary ${lastNameError ? "border-red-500" : "border-gray-300"} bg-white text-base font-poppins-medium`}
          />
          {lastNameError ? (
            <Text className="text-xs text-red-500 font-poppins-medium mt-1">{lastNameError}</Text>
          ) : null}
        </View>

        <View className="space-y-6 w-full px-8 mt-5">
          <Text className="font-poppins-medium text-sm mb-1">Email <Text className="text-red-500">*</Text></Text>
          <TextInputField
            value={data.email}
            onChangeText={handleEmailChange}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            className={`border focus:border-primary ${emailError ? "border-red-500" : "border-gray-300"} bg-white text-base font-poppins-medium`}
          />
          {emailError ? (
            <Text className="text-xs text-red-500 font-poppins-medium mt-1">{emailError}</Text>
          ) : null}
        </View>

        <View className="space-y-6 w-full px-8 mt-5">
          <Text className="font-poppins-medium text-sm mb-1">Phone Number <Text className="text-red-500">*</Text></Text>
          <View className="flex-row gap-3">
            <TextInputField
              value={data.phoneCode}
              onChangeText={handlePhoneCodeChange}
              placeholder="+234"
              keyboardType="phone-pad"
              className={`border focus:border-primary ${phoneCodeError ? "border-red-500" : "border-gray-300"} bg-white text-base font-poppins-medium w-[90px]`}
            />
            <TextInputField
              value={data.phoneNumber}
              onChangeText={handlePhoneNumberChange}
              placeholder="0000 000 0000"
              keyboardType="phone-pad"
              className={`border focus:border-primary ${phoneNumberError ? "border-red-500" : "border-gray-300"} bg-white text-base font-poppins-medium flex-1`}
            />
          </View>
          {(phoneCodeError || phoneNumberError) ? (
            <Text className="text-xs text-red-500 font-poppins-medium mt-1">{phoneCodeError || phoneNumberError}</Text>
          ) : null}
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
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
