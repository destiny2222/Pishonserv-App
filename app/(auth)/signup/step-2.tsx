import CustomAlert from "@/components/CustomAlert";
import TextInputField from "@/components/TextInputField";
import Watermarks from "@/components/Watermarks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { State } from "country-state-city";
import { Link, router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View, ActivityIndicator, ScrollView } from "react-native";
import { Dropdown } from "react-native-paper-dropdown";
import { useSignup } from "./_layout";

export default function Step2() {
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

  const states = useMemo(() => {
    if (!data.countryCode) return [];
    return State.getStatesOfCountry(data.countryCode);
  }, [data.countryCode]);

  const next = () => {
    if (!data.state || !data.address || !data.city || !data.phoneNumber) {
      showAlert("Missing Fields", "Please fill in all required fields marked with *.");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setTimeout(() => {
      router.push("/(auth)/signup/step-3");
      setIsLoading(false);
    }, 300);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
        <View className="flex-1 bg-white justify-center items-center py-10">
          <Watermarks showTopRight showBottomLeft />

          <TouchableOpacity onPress={() => router.back()} className="absolute top-20 left-6 z-10">
            <Ionicons name="arrow-back" size={22} color="#C9A24D" />
          </TouchableOpacity>

          <Text className="text-2xl font-poppins-semibold text-secondary text-center mt-10">Sign Up</Text>
          <Text className="text-xs text-gray-300 text-center mt-2">(Region & Contact)</Text>

          <View className="space-y-6 w-full px-8 mt-10">
            <Text className="font-poppins-medium text-sm mb-2">State <Text className="text-red-500">*</Text></Text>
            <Dropdown
              label="State"
              placeholder="Select state"
              options={states.map(state => ({
                label: state.name,
                value: state.isoCode
              }))}
              value={data.state}
              onSelect={(value) => update({ state: value })}
              mode="outlined"
              hideMenuHeader={true}
            />
          </View>

          <View className="space-y-6 w-full px-8 mt-5">
            <Text className="font-poppins-medium text-sm mb-2">Address <Text className="text-red-500">*</Text></Text>
            <TextInputField
              value={data.address}
              onChangeText={(t) => update({ address: t })}
              className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
              placeholder="Enter your address"
            />
          </View>

          <View className="space-y-6 w-full px-8 mt-5">
            <Text className="font-poppins-medium text-sm mb-2">City <Text className="text-red-500">*</Text></Text>
            <TextInputField
              value={data.city}
              onChangeText={(t) => update({ city: t })}
              className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
              placeholder="Enter your city"
            />
          </View>

          <View className="space-y-6 w-full px-8 mt-5">
            <Text className="font-poppins-medium text-sm mb-1">Phone Number <Text className="text-red-500">*</Text></Text>
            <View className="flex-row gap-3">
              <TextInputField
                value={data.phoneCode}
                onChangeText={(t) => update({ phoneCode: t })}
                className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium w-[90px]"
                placeholder="+234"
              />
              <TextInputField
                value={data.phoneNumber}
                onChangeText={(t) => update({ phoneNumber: t })}
                className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium flex-1"
                placeholder="0000 000 0000"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View className="space-y-6 w-full px-8 mt-5">
            <Text className="font-poppins-medium text-sm mb-2">
              NIN <Text className="text-gray-400">(Optional)</Text>
            </Text>
            <TextInputField
              value={data.nin}
              onChangeText={(t) => update({ nin: t })}
              className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
              placeholder="Enter your NIN"
              keyboardType="numeric"
            />
          </View>

          <View className="space-y-6 w-full px-8 mt-5">
            <Text className="font-poppins-medium text-sm mb-2">
              Referral Code <Text className="text-gray-400">(Optional)</Text>
            </Text>
            <TextInputField
              value={data.referral_code}
              onChangeText={(t) => update({ referral_code: t })}
              className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
              placeholder="Enter referral code"
              autoCapitalize="characters"
            />
          </View>

          <View className="space-y-6 w-full px-8 mt-8">
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

          <View className="mt-8 mb-10 items-center">
            <Text className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/(auth)/login" className="text-secondary font-poppins-semibold underline">
                Login
              </Link>
            </Text>
          </View>
        </View>

        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
