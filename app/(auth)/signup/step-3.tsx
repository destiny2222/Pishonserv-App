import CustomAlert from "@/components/CustomAlert";
import Watermarks from "@/components/Watermarks";
import { useAuth } from "@/hooks/useAuth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, Keyboard, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
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

  // Role Selection State
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const roles = [
    { label: "Customer", value: "buyer" },
    { label: "Agent", value: "agent" },
    { label: "Property Owner", value: "owner" },
    { label: "Hotel Owner", value: "hotel_owner" },
    { label: "Developer", value: "developer" },
    { label: "Host", value: "host" },
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

  const handleSubmit = async () => {
    if (!data.password || data.password !== data.confirmPassword || !data.role) return;

    // Validation for non-buyer roles
    if (data.role !== 'buyer') {
      if (!data.agree_mou) {
        showAlert("MOU Required", "You must agree to the MOU to proceed.");
        return;
      }
    }

    setIsLoading(true);
    try {
      const payload: any = {
        name: data.firstName,
        lname: data.lastName,
        email: data.email,
        phone: `${data.phoneCode}${data.phoneNumber}`,
        address: data.address,
        state: data.state,
        city: data.city,
        password: data.password,
        role: data.role,
      };

      if (data.role !== 'buyer') {
        payload.agree_mou = 1;
        // Auto-populate signed_name
        payload.signed_name = `${data.firstName} ${data.lastName}`;
      }

      const result = await register(payload);

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
      showAlert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    const basicValid = data.password && data.password === data.confirmPassword && data.role;
    if (!basicValid) return false;

    if (data.role !== 'buyer') {
      return data.agree_mou === 1;
    }

    return true;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white px-6 pt-32 relative">
        <Watermarks showTopRight showBottomLeft />

        <TouchableOpacity onPress={() => router.back()} className="absolute top-16 left-6 z-10">
          <Ionicons name="arrow-back" size={22} color="#C9A24D" />
        </TouchableOpacity>

        <Text className="text-2xl font-poppins-semibold text-secondary text-center">Sign Up</Text>
        <Text className="text-xs text-gray-300 text-center mt-2">(Security)</Text>

        <View className="mt-8">
          <Text className="font-poppins-medium text-sm mb-2">Password <Text className="text-red-500">*</Text></Text>
          <View className="relative">
            <TextInput
              value={data.password}
              onChangeText={(t) => update({ password: t })}
              placeholder="Input password"
              secureTextEntry={!showPassword}
              className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium px-4 py-4 pr-12 rounded-xl"
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
              className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium px-4 py-4 pr-12 rounded-xl"
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
          <TouchableOpacity
            onPress={() => setRoleModalVisible(true)}
            className="border border-gray-300 bg-white px-4 py-4 rounded-xl flex-row justify-between items-center"
          >
            <Text className={`text-base font-poppins-medium ${data.role ? 'text-black' : 'text-gray-400'}`}>
              {getRoleLabel(data.role)}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Conditional Fields for Non-Buyer Roles */}
        {data.role && data.role !== 'buyer' && (
          <View className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <Text className="font-poppins-bold text-sm mb-4 text-secondary">Agreement</Text>

            <TouchableOpacity
              onPress={() => update({ agree_mou: data.agree_mou === 1 ? 0 : 1 })}
              className="flex-row items-center mb-4"
            >
              <View className={`w-6 h-6 border rounded mr-3 items-center justify-center ${data.agree_mou === 1 ? 'bg-primary border-primary' : 'border-gray-400 bg-white'}`}>
                {data.agree_mou === 1 && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text className="text-sm font-poppins text-gray-700 flex-1">
                I agree to the <Text className="text-primary font-bold">MOU</Text> terms and conditions.
              </Text>
            </TouchableOpacity>

            {/* Hidden field logic: signed_name is auto-populated on submit */}
          </View>
        )}

        <View className="mt-10 mb-10">
          <TouchableOpacity className={`rounded-xl py-4 items-center ${isFormValid() ? 'bg-primary' : 'bg-gray-300'}`}
            onPress={handleSubmit}
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-poppins-semibold text-lg">Register</Text>
            )}
          </TouchableOpacity>
        </View>

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
                          update({ role: item.value });
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
    </TouchableWithoutFeedback>
  );
}
