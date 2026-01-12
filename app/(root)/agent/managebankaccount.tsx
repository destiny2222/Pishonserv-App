import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import TopHeader from "@/components/TopHeader";
import images from "@/constants/images";
import icons from "@/constants/icons";

type BankOption = { label: string; value: string };

const BANKS: BankOption[] = [
  { label: "Opay Digital Bank", value: "opay" },
  { label: "GTBank", value: "gtb" },
  { label: "Access Bank", value: "access" },
  { label: "First Bank", value: "firstbank" },
  { label: "Kuda", value: "kuda" },
];

const ManageBank = () => {
  const [openBank, setOpenBank] = useState(false);
  const [bank, setBank] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const bankLabel = useMemo(
    () => BANKS.find((b) => b.value === bank)?.label,
    [bank]
  );

  const onAddAccount = () => {
    // basic validation (adjust to your needs)
    if (!bank) return console.log("Select a bank");
    if (accountNumber.trim().length < 10) return console.log("Account number should be 10 digits");
    if (!accountName.trim()) return console.log("Enter account name");

    const payload = { bank, accountNumber, accountName };
    console.log("ADD ACCOUNT:", payload);

    // call your API here...
    // then reset
    // setBank(""); setAccountNumber(""); setAccountName("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="px-4 pt-5">
          <TopHeader title="Return to earnings" />

          {/* Title */}
          <View className="my-6">
            <Text className="text-secondary text-2xl font-poppins-semibold">
              Manage Bank Account
            </Text>
          </View>

          {/* Existing Bank Card */}
          <View className="mb-6">
            <TouchableOpacity activeOpacity={0.9}>
              <View className="relative bg-slate-50 py-4 shadow-slate-100 shadow-xl rounded-2xl px-3 flex-row items-center overflow-hidden">
                <Image source={images.opay} className="w-20 h-20 rounded-lg" resizeMode="cover" />

                <View className="flex-1 pl-3 pr-20">
                  <Text className="text-secondary font-poppins-bold text-xl mb-1" numberOfLines={2}>
                    David Amiri
                  </Text>
                  <Text className="text-gray-600 font-poppins text-base mb-2" numberOfLines={1}>
                    9011237281
                  </Text>
                  <Text className="text-black-300 font-poppins-semibold text-base">
                    Opay Digital Bank
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => console.log("delete")}
                  className="absolute right-4"
                  style={{ top: "35%", transform: [{ translateY: 22 }] }}
                >
                  <View className="bg-red-50 p-3 rounded-full">
                    <Image source={icons.deleteicon} className="w-6 h-6" tintColor="#EF4444" />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>

          {/* Add New Bank Account */}
          <Text className="text-secondary text-2xl font-poppins-semibold mb-5">
            Add New Bank Account
          </Text>

          {/* Select Bank */}
          <Text className="font-poppins text-black-300 mb-2">Select Bank</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setOpenBank(true)}
            className="border border-gray-200 rounded-lg px-4 py-4 flex-row items-center justify-between bg-white mb-6"
          >
            <Text className={`font-poppins ${bank ? "text-black-300" : "text-gray-300"}`}>
              {bankLabel || "Select"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#111827" />
          </TouchableOpacity>

          {/* Account Number */}
          <Text className="font-poppins text-black-300 mb-2">Account Number</Text>
          <TextInput
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
            maxLength={10}
            placeholder=" "
            placeholderTextColor="#B8B8B8"
            className="border border-gray-200 rounded-lg px-4 py-4 font-poppins text-black-300 mb-6"
          />

          {/* Account Name */}
          <Text className="font-poppins text-black-300 mb-2">Account Name</Text>
          <TextInput
            value={accountName}
            onChangeText={setAccountName}
            placeholder=" "
            placeholderTextColor="#B8B8B8"
            className="border border-gray-200 rounded-lg px-4 py-4 font-poppins text-black-300 mb-8"
          />

          {/* Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onAddAccount}
            className="bg-[#C9A24D] rounded-xl py-4 items-center"
          >
            <Text className="text-white font-poppins-bold text-lg">Add Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bank Dropdown Modal */}
      <Modal transparent visible={openBank} animationType="fade" onRequestClose={() => setOpenBank(false)}>
        <Pressable className="flex-1 bg-black/25 justify-end" onPress={() => setOpenBank(false)}>
          <Pressable className="bg-white rounded-t-3xl px-5 pt-5 pb-8">
            <Text className="font-poppins-bold text-lg text-black-300 mb-4">Select Bank</Text>

            {BANKS.map((b) => {
              const selected = b.value === bank;
              return (
                <TouchableOpacity
                  key={b.value}
                  onPress={() => {
                    setBank(b.value);
                    setOpenBank(false);
                  }}
                  className="py-4 flex-row items-center justify-between border-b border-gray-100"
                >
                  <Text className="font-poppins text-black-300">{b.label}</Text>
                  {selected ? <Ionicons name="checkmark" size={20} color="#C9A24D" /> : null}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default ManageBank;
