import CustomAlert from "@/components/CustomAlert";
import TopHeader from "@/components/TopHeader";
import images from "@/constants/images";
import { addBankAccount, BankAccount, getBankAccounts } from "@/libs/endpoints/bankAccounts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [bank, setBank] = useState < BankOption | null > (null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [bankAccounts, setBankAccounts] = useState < BankAccount[] > ([]);

  // Custom Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await getBankAccounts();
      if (data) {
        setBankAccounts(data);
      }
    } catch (error) {
        
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const onAddAccount = async () => {
    if (!bank) {
      showAlert("Error", "Please select a bank");
      return;
    }
    if (accountNumber.trim().length < 10) {
      showAlert("Error", "Account number should be at least 10 digits");
      return;
    }
    if (!accountName.trim()) {
      showAlert("Error", "Please enter account name");
      return;
    }

    setIsAdding(true);
    try {
      await addBankAccount({
        bank_name: bank.label,
        account_number: accountNumber,
        account_name: accountName,
      });
      showAlert("Success", "Bank account added successfully");
      setBank(null);
      setAccountNumber("");
      setAccountName("");
      fetchBankAccounts(); // Refresh list
    } catch (error: any) {
      
      showAlert("Error", "Failed to add bank account. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };



  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="px-4 pt-5">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              className="border p-2 rounded-full border-primary"
              onPress={() => router.replace('/earnings')}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={24} color="#C9A24D" />
            </TouchableOpacity>
      
            <Text className="flex-1 text-center text-2xl font-poppins-semibold text-black-300 mx-3">
               Return to earnings 
            </Text>
      
            {/* Right side spacer so title stays centered */}
            {/* <View className="w-10" /> */}
          </View>

          {/* Title */}
          <View className="my-6">
            <Text className="text-secondary text-2xl font-poppins-semibold">
              Manage Bank Account
            </Text>
          </View>

          {/* Loading State */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#C9A24D" className="my-5" />
          ) : (
            <>
              {/* Existing Bank Accounts */}
              {bankAccounts.length > 0 ? (
                <View className="mb-6">
                  <Text className="text-secondary text-lg font-poppins-semibold mb-3">
                    Your Accounts
                  </Text>
                  {bankAccounts.map((account) => (
                    <View key={account.id} className="relative bg-slate-50 py-4 shadow-slate-100 shadow-xl rounded-2xl px-3 flex-row items-center overflow-hidden mb-4">
                      {/* <Image source={getBankLogo(account.bank_name)} className="w-20 h-20 rounded-lg" resizeMode="cover" /> */}
                      <Ionicons name="wallet" size={70} color="#C9A24D"  className="w-20 h-20 rounded-lg"/>
                      <View className="flex-1 pl-5 pr-10">
                        <Text className="text-secondary font-poppins-bold font-bold text-xl mb-1" numberOfLines={2}>
                          {account.account_name}
                        </Text>
                        <Text className="text-black-300 font-poppins-semibold text-base font-semibold mb-2" numberOfLines={1}>
                          {account.account_number}
                        </Text>
                        <Text className="text-black-300 font-poppins-semibold text-base font-semibold">
                          {account.bank_name}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-gray-500 font-poppins text-base mb-6 text-center">
                  No bank accounts added yet.
                </Text>
              )}
            </>
          )}

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
              {bank?.label || "Select"}
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
            disabled={isAdding}
            className={`bg-[#C9A24D] rounded-xl py-4 items-center ${isAdding ? 'opacity-70' : ''}`}
          >
            {isAdding ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-poppins-bold text-lg">Add Account</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bank Dropdown Modal */}
      <Modal transparent visible={openBank} animationType="fade" onRequestClose={() => setOpenBank(false)}>
        <Pressable className="flex-1 bg-black/25 justify-end" onPress={() => setOpenBank(false)}>
          <View className="bg-white rounded-t-3xl px-5 pt-5 pb-8">
            <Text className="font-poppins-bold text-lg text-black-300 mb-4">Select Bank</Text>

            {BANKS.map((b) => {
              const selected = b.value === bank?.value;
              return (
                <TouchableOpacity
                  key={b.value}
                  onPress={() => {
                    setBank(b);
                    setOpenBank(false);
                  }}
                  className="py-4 flex-row items-center justify-between border-b border-gray-100"
                >
                  <Text className="font-poppins text-black-300">{b.label}</Text>
                  {selected ? <Ionicons name="checkmark" size={20} color="#C9A24D" /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
};

export default ManageBank;
