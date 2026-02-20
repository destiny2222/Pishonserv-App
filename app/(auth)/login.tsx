import CustomAlert from '@/components/CustomAlert';
import TextInputField from '@/components/TextInputField';
import Watermarks from '@/components/Watermarks';
import { useAuth } from '@/hooks/useAuth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const { login } = useAuth();

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      showAlert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success === true) {
        if (result.data?.verification_required) {
          router.replace({
            pathname: '/(auth)/verify-otp',
            params: { email: email }
          });
        } else {
          router.replace('/(root)/(tabs)/home');
        }
      } else {
        showAlert('Login Failed', result.error || 'An unexpected error occurred.');
      }
    } catch (error: any) {
      showAlert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='flex-1 bg-white justify-center items-center'>
        <Watermarks showTopRight showBottomLeft />
        <Text className='font-bold text-2xl text-secondary font-poppins-semibold'>Login</Text>

        <View className='space-y-6 w-full px-8 mt-10'>
          <Text className='font-poppins-medium text-base mb-2'>Email</Text>
          <TextInputField placeholder='Enter your email'
            keyboardType='email-address'
            className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className='space-y-6 w-full px-8 mt-6'>
          <Text className='font-poppins-medium text-base mb-2'>Password</Text>
          <View className="relative">
            <TextInputField placeholder='Enter your password'
              secureTextEntry={!showPassword}

              className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4"
            >
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View className='w-full px-8 mt-10'>
          <Pressable 
            style={{ 
              backgroundColor: '#C9A24D', 
              paddingVertical: 16, 
              borderRadius: 12, 
              alignItems: 'center',
              opacity: isLoading ? 0.7 : 1 
            }} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className='text-white font-poppins-semibold font-semibold text-lg'>Login</Text>
            )}
          </Pressable>
        </View>
        <View className='mt-16'>
          <Link href="/(auth)/reset-password" className='font-poppins-semibold underline font-semibold  text-lg text-secondary'>Forgot your password?</Link>
        </View>
        <View className='mt-16'>
          <Text className='font-poppins-semibold font-semibold text-lg text-black'>
            Don't have an account? <Link href="/signup" className='text-secondary font-poppins-semibold font-semibold underline'>Sign Up</Link>
          </Text>
        </View>
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}