import CustomAlert from "@/components/CustomAlert";
import TextInputField from "@/components/TextInputField";
import Watermarks from "@/components/Watermarks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, Modal, RefreshControl, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSignup } from "./_layout";

export default function Step3() {
  const { data, update } = useSignup();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [roleError, setRoleError] = useState("");

  // Role Selection State
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const roles = [
    { label: "Customer", value: "buyer" },
    { label: "Agent", value: "agent" },
    { label: "Property Owner", value: "owner" },
    { label: "Hotel Owner", value: "hotel_owner" },
    { label: "Developer", value: "developer" },
    { label: "Host", value: "host" },
    // { label: "Admin", value: "admin" },
    // { label: "Super Admin", value: "superadmin" },
  ];

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const getRoleLabel = (value: string) => {
    const role = roles.find((r) => r.value === value);
    return role ? role.label : "Select a role";
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    update({ role: "", agree_mou: 0 });
    setRoleError("");
    await new Promise((resolve) => setTimeout(resolve, 400));
    setRefreshing(false);
  };

  const handleRoleChange = (role: string) => {
    update({ role, agree_mou: role === "buyer" ? 0 : data.agree_mou });
    setRoleError("");
  };

  const handleNext = () => {
    if (!data.role) {
      setRoleError("Role is required.");
      showAlert("Role Required", "Please select a role to proceed.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      router.push("/(auth)/signup/step-4");
      setIsLoading(false);
    }, 300);
  };

  const isFormValid = () => {
    return Boolean(data.role);
  };

  return (
      <View className="flex-1 bg-white px-6 pt-56 relative">
        <Watermarks showTopRight showBottomLeft />

        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 bg-slate-400 rounded-full *:bg-white/30"
          style={{ position: 'absolute', top: insets.top + 60, left: 16, zIndex: 10 }}
          hitSlop={{ top: 130, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color="#0D3B66" />
        </TouchableOpacity>

        <Text className="text-2xl font-poppins-semibold text-secondary text-center">Sign Up</Text>
        <Text className="text-xs text-gray-300 text-center mt-2">(Account Type)</Text>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          className="mt-8"
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          alwaysBounceVertical={true}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#C9A24D"]} tintColor="#C9A24D" />}
        >
          <View className="mt-6 mb-6">
            <Text className="font-poppins-medium text-sm mb-2">Select Role <Text className="text-red-500">*</Text></Text>
            <TouchableOpacity
              onPress={() => setRoleModalVisible(true)}
              className={`border ${roleError ? "border-red-500" : "border-gray-300"} bg-white px-4 py-4 rounded-xl flex-row justify-between items-center`}
            >
              <Text className={`text-base font-poppins-medium ${data.role ? 'text-black' : 'text-gray-400'}`}>
                {getRoleLabel(data.role)}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {roleError ? (
              <Text className="text-xs text-red-500 font-poppins-medium mt-1">{roleError}</Text>
            ) : null}
          </View>

          <View>
            <Text className="font-poppins-medium text-sm mb-2">
              NIN <Text className="text-gray-400">(Optional)</Text>
            </Text>
            <TextInputField
              value={data.nin}
              onChangeText={(nin) => update({ nin })}
              className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
              placeholder="Enter your NIN"
              keyboardType="numeric"
            />
          </View>

          <View className="mt-6">
            <Text className="font-poppins-medium text-sm mb-2">
              Referral Code <Text className="text-gray-400">(Optional)</Text>
            </Text>
            <TextInputField
              value={data.referral_code}
              onChangeText={(referral_code) => update({ referral_code })}
              className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
              placeholder="Enter referral code"
              autoCapitalize="characters"
            />
          </View>

          <View className="mt-10 mb-10">
            <TouchableOpacity className={`rounded-xl py-4 items-center ${isFormValid() ? 'bg-primary' : 'bg-gray-300'}`}
              onPress={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-poppins-semibold text-lg">Next</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />

        {/* Role Selection Modal */}
        <Modal
          visible={roleModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setRoleModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setRoleModalVisible(false)}>
            <View className="flex-1 bg-black/50 justify-end">
              <TouchableWithoutFeedback>
                <View className="bg-white rounded-t-3xl p-6 h-1/2">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-poppins-bold text-secondary">Select Role</Text>
                    <TouchableOpacity onPress={() => setRoleModalVisible(false)}>
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={roles}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          handleRoleChange(item.value);
                          setRoleModalVisible(false);
                        }}
                        className={`py-4 border-b border-gray-100 flex-row justify-between items-center ${data.role === item.value ? 'bg-gray-50' : ''}`}
                      >
                        <Text className={`text-base font-poppins-medium ${data.role === item.value ? 'text-primary' : 'text-gray-700'}`}>
                          {item.label}
                        </Text>
                        {data.role === item.value && (
                          <Ionicons name="checkmark-circle" size={20} color="#C9A24D" />
                        )}
                      </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </View>
  );
}
