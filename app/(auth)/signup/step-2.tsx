import CustomAlert from "@/components/CustomAlert";
import TextInputField from "@/components/TextInputField";
import Watermarks from "@/components/Watermarks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { State } from "country-state-city";
import { Link, router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Keyboard, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import { useSignup } from "./_layout";

export default function Step2() {
  const { data, update } = useSignup();
  const [isLoading, setIsLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [countryError, setCountryError] = useState("");
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const [stateError, setStateError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [cityError, setCityError] = useState("");
  const [phoneCodeError, setPhoneCodeError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const normalizePhoneCode = (phoneCode: string) => `+${phoneCode.replace(/[^\d]/g, "")}`;
  const validatePhoneCode = (phoneCode: string) => /^\+\d{1,6}$/.test(phoneCode.trim());
  const validatePhoneNumber = (phoneNumber: string) => /^\+?[0-9]{7,15}$/.test(phoneNumber.replace(/\s/g, ""));

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const states = useMemo(() => {
    if (!data.countryCode) return [];
    return State.getStatesOfCountry(data.countryCode);
  }, [data.countryCode]);

  const selectedStateName = useMemo(() => {
    return states.find((state) => state.isoCode === data.state)?.name || "";
  }, [data.state, states]);

  const filteredStates = useMemo(() => {
    const query = stateSearch.trim().toLowerCase();
    if (!query) return states;

    return states.filter((state) => (
      state.name.toLowerCase().includes(query) ||
      state.isoCode.toLowerCase().includes(query)
    ));
  }, [stateSearch, states]);

  const handleCountryChange = (country: Country) => {
    const phoneCode = normalizePhoneCode(country.callingCode[0] || "");
    const countryName = typeof country.name === "string" ? country.name : country.name.common;

    update({
      country: countryName,
      countryCode: country.cca2,
      phoneCode,
      state: "",
    });
    setCountryError("");
    setStateError("");
    setPhoneCodeError(validatePhoneCode(phoneCode) ? "" : "Enter a valid code.");
    setCountryModalVisible(false);
  };

  const handleStateChange = (value?: string) => {
    update({ state: value || "" });
    setStateError(value ? "" : "State is required.");
    setStateSearch("");
    setStateModalVisible(false);
  };

  const handleAddressChange = (text: string) => {
    update({ address: text });
    setAddressError(text.trim() ? "" : "Address is required.");
  };

  const handleCityChange = (text: string) => {
    update({ city: text });
    setCityError(text.trim() ? "" : "City is required.");
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

  const handleNinChange = (text: string) => {
    update({ nin: text });
  };

  const handleReferralCodeChange = (text: string) => {
    update({ referral_code: text });
  };

  const next = () => {
    if (!data.country || !data.countryCode || !data.state || !data.address.trim() || !data.city.trim() || !data.phoneNumber) {
      setCountryError(data.country && data.countryCode ? "" : "Country is required.");
      setStateError(data.state ? "" : "State is required.");
      setAddressError(data.address.trim() ? "" : "Address is required.");
      setCityError(data.city.trim() ? "" : "City is required.");
      setPhoneNumberError(data.phoneNumber ? "" : "Phone number is required.");
      showAlert("Missing Fields", "Please fill in all required fields marked with *.");
      return;
    }

    if (!validatePhoneCode(data.phoneCode) || !validatePhoneNumber(data.phoneNumber)) {
      setPhoneCodeError(validatePhoneCode(data.phoneCode) ? "" : "Enter a valid code.");
      setPhoneNumberError(validatePhoneNumber(data.phoneNumber) ? "" : "Enter a valid phone number.");
      showAlert("Invalid Phone Number", "Please enter a valid phone number.");
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
            <Text className="font-poppins-medium text-sm mb-2">Country <Text className="text-red-500">*</Text></Text>
            <TouchableOpacity
              onPress={() => setCountryModalVisible(true)}
              className={`border ${countryError ? "border-red-500" : "border-gray-300"} bg-white px-5 py-4 rounded-lg flex-row justify-between items-center`}
            >
              <Text className={`text-base font-poppins-medium flex-1 pr-2 ${data.country ? "text-black" : "text-gray-400"}`} numberOfLines={1}>
                {data.country || "Select country"}
              </Text>
              <View className="flex-row items-center gap-2">
                {data.phoneCode ? (
                  <Text className="text-sm text-gray-500 font-poppins-medium">{data.phoneCode}</Text>
                ) : null}
                <Ionicons name="chevron-down" size={20} color="#666" />
              </View>
            </TouchableOpacity>
            {countryError ? (
              <Text className="text-xs text-red-500 font-poppins-medium mt-1">{countryError}</Text>
            ) : null}
          </View>

          <View className="space-y-6 w-full px-8 mt-10">
            <Text className="font-poppins-medium text-sm mb-2">State <Text className="text-red-500">*</Text></Text>
            <TouchableOpacity
              onPress={() => setStateModalVisible(true)}
              className={`border ${stateError ? "border-red-500" : "border-gray-300"} bg-white px-5 py-4 rounded-lg flex-row justify-between items-center`}
            >
              <Text className={`text-base font-poppins-medium flex-1 pr-2 ${selectedStateName ? "text-black" : "text-gray-400"}`} numberOfLines={1}>
                {selectedStateName || "Select state"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {stateError ? (
              <Text className="text-xs text-red-500 font-poppins-medium mt-1">{stateError}</Text>
            ) : null}
          </View>

          <View className="space-y-6 w-full px-8 mt-5">
            <Text className="font-poppins-medium text-sm mb-2">Address <Text className="text-red-500">*</Text></Text>
            <TextInputField
              value={data.address}
              onChangeText={handleAddressChange}
              className={`border focus:border-primary ${addressError ? "border-red-500" : "border-gray-300"} bg-white text-base font-poppins-medium`}
              placeholder="Enter your address"
            />
            {addressError ? (
              <Text className="text-xs text-red-500 font-poppins-medium mt-1">{addressError}</Text>
            ) : null}
          </View>

          <View className="space-y-6 w-full px-8 mt-5">
            <Text className="font-poppins-medium text-sm mb-2">City <Text className="text-red-500">*</Text></Text>
            <TextInputField
              value={data.city}
              onChangeText={handleCityChange}
              className={`border focus:border-primary ${cityError ? "border-red-500" : "border-gray-300"} bg-white text-base font-poppins-medium`}
              placeholder="Enter your city"
            />
            {cityError ? (
              <Text className="text-xs text-red-500 font-poppins-medium mt-1">{cityError}</Text>
            ) : null}
          </View>

          <View className="space-y-6 w-full px-8 mt-5">
            <Text className="font-poppins-medium text-sm mb-1">Phone Number <Text className="text-red-500">*</Text></Text>
            <View className="flex-row gap-3">
              <TextInputField
                value={data.phoneCode}
                onChangeText={handlePhoneCodeChange}
                className={`border focus:border-primary ${phoneCodeError ? "border-red-500" : "border-gray-300"} bg-white text-base font-poppins-medium w-[90px]`}
                placeholder="+234"
                keyboardType="phone-pad"
              />
              <TextInputField
                value={data.phoneNumber}
                onChangeText={handlePhoneNumberChange}
                className={`border focus:border-primary ${phoneNumberError ? "border-red-500" : "border-gray-300"} bg-white text-base font-poppins-medium flex-1`}
                placeholder="0000 000 0000"
                keyboardType="phone-pad"
              />
            </View>
            {phoneCodeError || phoneNumberError ? (
              <Text className="text-xs text-red-500 font-poppins-medium mt-1">{phoneCodeError || phoneNumberError}</Text>
            ) : null}
          </View>

          <View className="space-y-6 w-full px-8 mt-5">
            <Text className="font-poppins-medium text-sm mb-2">
              NIN <Text className="text-gray-400">(Optional)</Text>
            </Text>
            <TextInputField
              value={data.nin}
              onChangeText={handleNinChange}
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
              onChangeText={handleReferralCodeChange}
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

        <Modal
          visible={countryModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCountryModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setCountryModalVisible(false)}>
            <View className="flex-1 justify-end bg-black/40">
              <TouchableWithoutFeedback>
                <View className="bg-white rounded-t-3xl overflow-hidden" style={{ height: "75%" }}>
                  <CountryPicker
                    countryCode={(data.countryCode || "NG") as CountryCode}
                    visible
                    withModal={false}
                    withFilter
                    withFlag
                    withEmoji
                    withCallingCode
                    withCountryNameButton={false}
                    withCallingCodeButton={false}
                    withFlagButton={false}
                    withCloseButton
                    onSelect={handleCountryChange}
                    onClose={() => setCountryModalVisible(false)}
                    preferredCountries={["NG", "US", "GB", "CA", "GH", "ZA"]}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          visible={stateModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setStateModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setStateModalVisible(false)}>
            <View className="flex-1 justify-end bg-black/40">
              <TouchableWithoutFeedback>
                <View className="bg-white rounded-t-3xl px-6 pt-5 pb-8" style={{ height: "75%" }}>
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-poppins-semibold text-secondary">Select State</Text>
                    <TouchableOpacity onPress={() => setStateModalVisible(false)} className="p-1">
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>

                  <TextInputField
                    value={stateSearch}
                    onChangeText={setStateSearch}
                    placeholder="Search state"
                    className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium mb-4"
                  />

                  <FlatList
                    data={filteredStates}
                    keyExtractor={(item) => item.isoCode}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                      const selected = item.isoCode === data.state;

                      return (
                        <TouchableOpacity
                          onPress={() => handleStateChange(item.isoCode)}
                          className={`py-4 border-b border-gray-100 flex-row justify-between items-center ${selected ? "bg-gray-50" : ""}`}
                        >
                          <View className="flex-1 pr-3">
                            <Text className={`text-base font-poppins-medium ${selected ? "text-primary" : "text-gray-800"}`} numberOfLines={1}>
                              {item.name}
                            </Text>
                            <Text className="text-xs text-gray-500 font-poppins-medium">{item.isoCode}</Text>
                          </View>
                          {selected ? <Ionicons name="checkmark-circle" size={20} color="#C9A24D" /> : null}
                        </TouchableOpacity>
                      );
                    }}
                    ListEmptyComponent={
                      <Text className="text-center text-gray-500 font-poppins-medium py-8">
                        No state found.
                      </Text>
                    }
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

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
