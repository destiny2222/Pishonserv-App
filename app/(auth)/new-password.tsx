import CustomAlert from '@/components/CustomAlert';
import TextInputField from '@/components/TextInputField';
import Watermarks from '@/components/Watermarks';
import { resetPassword } from '@/libs/endpoints/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function NewPassword() {
  const params = useLocalSearchParams<{ email?: string; otp?: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  console.log('Reset Params:', params);

  const handleSubmit = async () => {
    // Validate inputs
    if (!password || !confirmPassword) {
      showAlert('Error', 'Please enter both password fields');
      return;
    }

    if (password.length < 8) {
      showAlert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Error', 'Passwords do not match');
      return;
    }

    if (!params.email || !params.otp) {
      showAlert('Error', 'Invalid reset request. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
        console.log('Submitting new password for:', params.email, 'with OTP:', params.otp);
      const response = await resetPassword({
        email: params.email,
        otp: params.otp,
        new_password: password,
      });

      if (response.status === 'ok') {
        showAlert('Success', 'Your password has been reset successfully');
        // Navigate to login after 2 seconds
        setTimeout(() => {
          setAlertVisible(false);
          router.replace('/(auth)/login');
        }, 2000);
      } else {
        showAlert('Error', response.message || 'Failed to reset password');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An unexpected error occurred. Please try again.';
      showAlert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='flex-1 bg-white'>
        <Watermarks showTopRight showBottomLeft />
        
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => router.back()}
          className="absolute top-12 left-6 z-10 bg-white/80 rounded-full p-2"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View className='flex-1 justify-center items-center px-8'>
          {/* Header */}
          <View className='items-center mb-8'>
            <Ionicons name="key-outline" size={64} color="#C9A24D" />
            <Text className='font-bold text-2xl text-secondary font-poppins-semibold mt-4'>
              Create New Password
            </Text>
            <Text className='text-gray-600 font-poppins text-center mt-3'>
              Your new password must be different from previously used passwords
            </Text>
          </View>

          {/* Password Input */}
          <View className='w-full space-y-2 mb-4'>
            <Text className='font-poppins-medium text-base mb-2'>New Password</Text>
            <View className="relative">
              <TextInputField 
                placeholder='Enter new password'
                secureTextEntry={!showPassword}
                className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4"
              >
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#666" />
              </TouchableOpacity>
            </View>
            <Text className='text-xs text-gray-500 font-poppins mt-1'>
              Must be at least 8 characters
            </Text>
          </View>

          {/* Confirm Password Input */}
          <View className='w-full space-y-2'>
            <Text className='font-poppins-medium text-base mb-2'>Confirm Password</Text>
            <View className="relative">
              <TextInputField 
                placeholder='Re-enter new password'
                secureTextEntry={!showConfirmPassword}
                className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4"
              >
                <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <View className='w-full mt-8'>
            <Pressable 
              onPress={handleSubmit}
              disabled={isLoading}
              style={{ 
                backgroundColor: '#C9A24D', 
                paddingVertical: 16, 
                borderRadius: 12, 
                alignItems: 'center',
                opacity: isLoading ? 0.7 : 1 
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className='text-white text-base font-poppins-semibold'>
                  Reset Password
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Alert */}
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
