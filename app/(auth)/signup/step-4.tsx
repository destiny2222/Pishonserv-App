import CustomAlert from "@/components/CustomAlert";
import TextInputField from "@/components/TextInputField";
import TurnstileWidget, { TurnstileWidgetRef } from "@/components/TurnstileWidget";
import Watermarks from "@/components/Watermarks";
import { useAuth } from "@/hooks/useAuth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSignup } from "./_layout";

export default function Step4() {
  const { data, update } = useSignup();
  const { register } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const turnstileRef = useRef<TurnstileWidgetRef>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [smsConsentError, setSmsConsentError] = useState("");
  const [mouError, setMouError] = useState("");
  const [turnstileError, setTurnstileError] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSmsConsentChange = () => {
    const nextValue = !data.sms_consent;
    update({ sms_consent: nextValue });
    setSmsConsentError(nextValue ? "" : "SMS consent is required.");
  };

  const handleMouChange = () => {
    const nextValue = data.agree_mou === 1 ? 0 : 1;
    update({ agree_mou: nextValue });
    setMouError(nextValue === 1 ? "" : "MOU agreement is required.");
  };

  const handlePasswordChange = (password: string) => {
    update({ password });
    setPasswordError(password ? "" : "Password is required.");
    if (data.confirmPassword) {
      setConfirmPasswordError(password === data.confirmPassword ? "" : "Passwords do not match.");
    }
  };

  const handleConfirmPasswordChange = (confirmPassword: string) => {
    update({ confirmPassword });
    setConfirmPasswordError(
      !confirmPassword
        ? "Please re-enter your password."
        : confirmPassword === data.password
          ? ""
          : "Passwords do not match.",
    );
  };

  const handleSubmit = async () => {
    if (!data.password) {
      setPasswordError("Password is required.");
      showAlert("Password Required", "Please enter a password.");
      return;
    }

    if (!data.confirmPassword) {
      setConfirmPasswordError("Please re-enter your password.");
      showAlert("Password Required", "Please re-enter your password.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      showAlert("Password Mismatch", "Passwords do not match. Please re-enter.");
      return;
    }

    if (data.role !== "buyer" && data.agree_mou !== 1) {
      setMouError("MOU agreement is required.");
      showAlert("MOU Required", "You must agree to the MOU to proceed.");
      return;
    }

    if (!data.sms_consent) {
      setSmsConsentError("SMS consent is required.");
      showAlert("Consent Required", "You must agree to receive SMS messages to proceed.");
      return;
    }

    if (!turnstileToken) {
      setTurnstileError("Security verification is required.");
      showAlert("Security Verification", "Please complete the security verification challenge.");
      return;
    }

    setIsLoading(true);
    try {
      const payload: Record<string, string | number | boolean> = {
        name: data.firstName,
        lname: data.lastName,
        email: data.email,
        phone: `${data.phoneCode}${data.phoneNumber}`,
        address: data.address,
        state: data.state,
        city: data.city,
        password: data.password,
        role: data.role,
        turnstile_token: turnstileToken,
        referral_code: data.referral_code || "",
        sms_consent: true,
        nin: data.nin || "",
      };

      if (data.role !== "buyer") {
        payload.agree_mou = 1;
        payload.signed_name = `${data.firstName} ${data.lastName}`;
      }

      const result = await register(payload);

      if (result.success) {
        router.push({
          pathname: "/(auth)/verify-otp",
          params: { email: data.email },
        });
        return;
      }

      if (result.status === 422 && result.error?.toLowerCase().includes("turnstile")) {
        showAlert("Verification Failed", "Security verification failed. Please try the challenge again.");
        turnstileRef.current?.reload();
        setTurnstileToken("");
        setTurnstileError("Security verification failed. Please try again.");
      } else {
        showAlert(
          result.status === 422 ? "Validation Error" : "Registration Failed",
          result.error || "An error occurred. Please try again.",
        );
      }
    } catch {
      showAlert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const canRegister = Boolean(
    data.password &&
    data.password === data.confirmPassword &&
    (data.role === "buyer" || data.agree_mou === 1) &&
    data.sms_consent &&
    turnstileToken,
  );

  return (
    <View className="flex-1 bg-white px-6 pt-40 relative">
      <Watermarks showTopRight showBottomLeft />

      <TouchableOpacity
        onPress={() => router.back()}
        className="p-2  bg-slate-400 rounded-full *:bg-white/30"
        style={{ position: "absolute", top: insets.top + 60, left: 16, zIndex: 10 }}
        hitSlop={{ top: 130, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={22} color="#0D3B66" />
      </TouchableOpacity>

      <Text className="text-2xl font-poppins-semibold text-secondary text-center">Sign Up</Text>
      <Text className="text-xs text-gray-300 text-center mt-2">(Consent & Verification)</Text>

      <ScrollView
        className="mt-8"
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text className="font-poppins-medium text-sm mb-2">Password <Text className="text-red-500">*</Text></Text>
          <View className="relative">
            <TextInputField
              value={data.password}
              onChangeText={handlePasswordChange}
              placeholder="Input password"
              secureTextEntry={!showPassword}
              style={{ color: "#000000", paddingRight: 50 }}
              className={`border focus:border-primary ${passwordError ? "border-red-500" : "border-gray-300"} bg-white text-base font-poppins-medium rounded-xl`}
            />
            <TouchableOpacity onPress={() => setShowPassword((visible) => !visible)} className="absolute right-4 top-4">
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#666" />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text className="text-xs text-red-500 font-poppins-medium mt-1">{passwordError}</Text> : null}
        </View>

        <View className="mt-6">
          <Text className="font-poppins-medium text-sm mb-2">Re-enter Password <Text className="text-red-500">*</Text></Text>
          <View className="relative">
            <TextInputField
              value={data.confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              placeholder="Re-enter password"
              secureTextEntry={!showConfirmPassword}
              style={{ color: "#000000", paddingRight: 50 }}
              className={`border focus:border-primary ${confirmPasswordError ? "border-red-500" : "border-gray-300"} bg-white text-base font-poppins-medium rounded-xl`}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword((visible) => !visible)} className="absolute right-4 top-4">
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#666" />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? <Text className="text-xs text-red-500 font-poppins-medium mt-1">{confirmPasswordError}</Text> : null}
        </View>

        {data.role && data.role !== "buyer" ? (
          <View className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-6">
            <Text className="font-poppins-bold text-sm mb-4 text-secondary">Agreement</Text>
            <TouchableOpacity onPress={handleMouChange} className="flex-row items-start">
              <View className={`w-6 h-6 border rounded mt-1 mr-3 items-center justify-center ${data.agree_mou === 1 ? "bg-primary border-primary" : "border-gray-400 bg-white"}`}>
                {data.agree_mou === 1 && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text className="text-[11px] font-poppins text-gray-700 leading-4 flex-1">
                I agree to the <Text className="text-primary font-bold">MOU</Text> terms and conditions.
                <Text className="text-red-500"> *</Text>
              </Text>
            </TouchableOpacity>
            {mouError ? <Text className="text-xs text-red-500 font-poppins-medium mt-2">{mouError}</Text> : null}
          </View>
        ) : null}

        <View className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4">
          <Text className="font-poppins-bold text-sm mb-4 text-secondary">SMS Consent</Text>
          <TouchableOpacity onPress={handleSmsConsentChange} className="flex-row items-start">
            <View className={`w-6 h-6 border rounded mt-1 mr-3 items-center justify-center ${data.sms_consent ? "bg-primary border-primary" : "border-gray-400 bg-white"}`}>
              {data.sms_consent && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text className="text-[11px] font-poppins text-gray-700 leading-4 flex-1">
              I agree to receive SMS messages from Pishonserv Property Hub regarding my registration, property inquiries, booking updates, and customer support. Message frequency varies. Reply STOP to opt out and HELP for assistance. Message and data rates may apply.
              <Text className="text-red-500"> *</Text>
            </Text>
          </TouchableOpacity>
          {smsConsentError ? <Text className="text-xs text-red-500 font-poppins-medium mt-2">{smsConsentError}</Text> : null}

          <View className="flex-row flex-wrap mt-3">
            <Text className="text-[10px] text-gray-500">By checking this, you also agree to our </Text>
            <TouchableOpacity onPress={() => Linking.openURL("https://pishonserv.com/privacy-policy.php")}>
              <Text className="text-[10px] text-primary font-poppins-semibold underline">Privacy Policy</Text>
            </TouchableOpacity>
            <Text className="text-[10px] text-gray-500"> and </Text>
            <TouchableOpacity onPress={() => Linking.openURL("https://pishonserv.com/terms-conditions.php")}>
              <Text className="text-[10px] text-primary font-poppins-semibold underline">Terms/SMS Terms</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6">
          <Text className="font-poppins-medium text-sm mb-2">Security Verification <Text className="text-red-500">*</Text></Text>
          <TurnstileWidget
            ref={turnstileRef}
            onTokenReceived={(token) => {
              setTurnstileToken(token);
              setTurnstileError(token ? "" : "Security verification is required.");
            }}
            onError={() => {
              setTurnstileError("Verification failed. Please try again.");
              showAlert("Security Error", "Verification failed. Please try again.");
            }}
          />
          {turnstileError ? <Text className="text-xs text-red-500 font-poppins-medium mt-1">{turnstileError}</Text> : null}
        </View>

        <TouchableOpacity
          className={`rounded-xl py-4 items-center mt-10 ${canRegister ? "bg-primary" : "bg-gray-300"}`}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text className="text-white font-poppins-semibold text-lg">Register</Text>}
        </TouchableOpacity>
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}
