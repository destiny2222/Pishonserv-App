import React, {useState} from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { router, Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Watermarks from "@/components/Watermarks";
import { useSignup } from "./_layout";
import { Picker } from "@react-native-picker/picker";
import Button from "@/components/Button";
import TextInputField from "@/components/TextInputField";
import CountryPicker, { Country } from "react-native-country-picker-modal";

function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

export default function Step2() {
  const { data, update } = useSignup();
  const [open, setOpen] = useState(false);

  const onSelectCountry = (c: Country) => {
    update({
      country: c.name?.common ?? "",
      countryCode: c.cca2 ?? "",
      phoneCode: c.callingCode?.[0] ? `+${c.callingCode[0]}` : data.phoneCode,
    });
    setOpen(false);
  };

  const next = () => {
    if (!data.country || !data.state || !data.phoneNumber) return;
    router.push("/(auth)/signup/step-3");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white justify-center items-center">
        <Watermarks showTopRight showBottomLeft />

        <TouchableOpacity onPress={() => router.back()} className="absolute top-12 left-6 z-10">
          <Ionicons name="arrow-back" size={22} color="#C9A24D" />
        </TouchableOpacity>

        <Text className="text-2xl font-poppins-semibold text-secondary text-center">Sign Up</Text>
        <Text className="text-xs text-gray-300 text-center mt-2">(Region)</Text>

        <View className="space-y-6 w-full px-8 mt-10">
           <Text className="font-poppins-medium text-sm mb-2">Country <Text className="text-red-500">*</Text></Text>
           <TouchableOpacity  onPress={() => setOpen(true)}  activeOpacity={0.85}
            className="border border-gray-300 rounded-xl px-4 py-4 flex-row items-center justify-between"  >
                <View className="flex-row items-center">
                <Text className="text-xl">
                    {data.countryCode ? getFlagEmoji(data.countryCode) : "🏳️"}
                </Text>

                <Text className={`ml-3 ${data.country ? "text-black" : "text-gray-400"}`}>
                    {data.country || "Select a country"}
                </Text>
                </View>
                <Ionicons name="chevron-down" size={18} color="#666" />
            </TouchableOpacity>
            <CountryPicker  visible={open}  onClose={() => setOpen(false)}
              onSelect={onSelectCountry} withFilter   withFlag  withCallingCode withEmoji 
            />
        </View>

        <View className="space-y-6 w-full px-8 mt-10">
          <Text className="font-poppins-medium text-sm mb-2">State <Text className="text-red-500">*</Text></Text>
          <View className="border border-gray-300 rounded-xl overflow-hidden">
            <Picker
              selectedValue={data.state}
              onValueChange={(v) => update({ state: v })}
            >
              <Picker.Item label="Select a state" value="" />
              <Picker.Item label="Lagos" value="Lagos" />
              <Picker.Item label="Abuja" value="Abuja" />
              <Picker.Item label="Rivers" value="Rivers" />
            </Picker>
          </View>
        </View>

        <View className="space-y-6 w-full px-8 mt-10">
          <Text className="font-poppins-medium text-sm mb-2">Phone Number <Text className="text-red-500">*</Text></Text>
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

        <View className="space-y-6 w-full px-8 mt-10">
          <Text className="font-poppins-medium text-sm mb-2">
            National Identification Number (NIN) <Text className="text-gray-400">(Optional)</Text>
          </Text>
          <TextInputField
            value={data.nin}
            onChangeText={(t) => update({ nin: t })}
            className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
            placeholder="Enter your 11-Digits NIN"
            keyboardType="number-pad"
          />
        </View>

        <View className="space-y-6 w-full px-8 mt-10">
          <Button style={{backgroundColor: '#C9A24D', paddingVertical: 16, borderRadius: 12, alignItems: 'center'}} onTouchEnd={next}>
            <Text className="text-white font-poppins-semibold">Next</Text>
          </Button>
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
