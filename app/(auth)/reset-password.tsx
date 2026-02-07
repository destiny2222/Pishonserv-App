import CustomAlert from '@/components/CustomAlert';
import TextInputField from '@/components/TextInputField';
import Watermarks from '@/components/Watermarks';
import { requestPasswordReset } from '@/libs/endpoints/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSubmit = async () => {
    // Validate email
    if (!email) {
      showAlert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await requestPasswordReset({ email });
      
      if (response.status === 'ok') {
        showAlert('Success', response.message || 'OTP has been sent to your email');
        
        // Navigate to verify OTP screen after 2 seconds
        setTimeout(() => {
          setAlertVisible(false);
          router.push({
            pathname: '/(auth)/verify-reset-otp',
            params: { email: email }
          });
        }, 2000);
      } else {
        showAlert('Error', response.message || 'Failed to send OTP');
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
            <Ionicons name="lock-closed-outline" size={64} color="#C9A24D" />
            <Text className='font-bold text-2xl text-secondary font-poppins-semibold mt-4'>
              Reset Password
            </Text>
            <Text className='text-gray-600 font-poppins text-center mt-3'>
              Enter your email address and we'll send you an OTP to reset your password
            </Text>
          </View>

          {/* Email Input */}
          <View className='w-full space-y-2'>
            <Text className='font-poppins-medium text-base mb-2'>Email Address</Text>
            <TextInputField 
              placeholder='Enter your email'
              keyboardType='email-address'
              autoCapitalize='none'
              className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />
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
                  Send OTP
                </Text>
              )}
            </Pressable>
          </View>

          {/* Back to Login */}
          <View className='flex-row justify-center mt-6'>
            <Text className='text-gray-600 font-poppins'>
              Remember your password?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className='text-primary font-poppins-semibold'>
                Login
              </Text>
            </TouchableOpacity>
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
 