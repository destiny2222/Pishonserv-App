import CustomAlert from '@/components/CustomAlert';
import TextInputField from '@/components/TextInputField';
import TurnstileWidget, { TurnstileWidgetRef } from '@/components/TurnstileWidget';
import Watermarks from '@/components/Watermarks';
import { useAuth } from '@/hooks/useAuth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const turnstileRef = useRef<TurnstileWidgetRef>(null);
  const { login } = useAuth();
  const insets = useSafeAreaInsets();

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // validation of email 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateEmail = (email: string) => emailRegex.test(email);

  const handleEmailChange = (text: string) => {
    setEmail(text);

    if (!text) {
      setEmailError("Email is required.");
      return;
    }

    setEmailError(validateEmail(text) ? "" : "Please enter a valid email address.");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError(text ? "" : "Password is required.");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setEmail('');
    setPassword('');
    setTurnstileToken('');
    setEmailError('');
    setPasswordError('');
    setShowPassword(false);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setRefreshing(false);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setEmailError(email ? "" : "Email is required.");
      setPasswordError(password ? "" : "Password is required.");
      showAlert('Error', 'Please enter both email and password');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      showAlert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password, turnstileToken);
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
        if (result.status === 422) {
          showAlert('Verification Failed', 'Security verification failed. Please try again.');
          turnstileRef.current?.reload();
          setTurnstileToken("");
        } else {
          showAlert('Login Failed', result.error || 'An unexpected error occurred.');
        }
      }
    } catch {
      showAlert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <View className='flex-1 bg-white justify-center items-center pt-52 relative' style={{ paddingTop: insets.top + 16 }}>
        <StatusBar style="dark" />
        <Watermarks showTopRight showBottomLeft />
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: 'absolute', top: insets.top + 30, left: 16, zIndex: 10 }}
          hitSlop={{ top: 30, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color="#0D3B66" />
        </TouchableOpacity>
        <Text className='font-bold text-2xl text-secondary font-poppins-semibold mt-16'>Login</Text>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          className="w-full px-8 mt-10"
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          alwaysBounceVertical={true}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#C9A24D']} tintColor="#C9A24D" />}
        >
          <View>
            <Text className='font-poppins-medium text-base mb-2'>Email</Text>
            <TextInputField placeholder='Enter your email'
              keyboardType='email-address'
              autoCapitalize='none'
              className={`border focus:border-primary ${emailError ? "border-red-500" : "border-gray-300"} bg-white text-base font-poppins-medium`}
              value={email}
              onChangeText={handleEmailChange}
            />
            {emailError ? (
              <Text className="text-xs text-red-500 font-poppins-medium mt-1">{emailError}</Text>
            ) : null}
          </View>

          <View className='mt-6'>
            <Text className='font-poppins-medium text-base mb-2'>Password</Text>
            <View className="relative">
              <TextInputField placeholder='Enter your password'
                secureTextEntry={!showPassword}
                className={`border focus:border-primary ${passwordError ? "border-red-500" : "border-gray-300"} bg-white text-base font-poppins-medium`}
                onChangeText={handlePasswordChange}
                value={password}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4"
              >
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#666" />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text className="text-xs text-red-500 font-poppins-medium mt-1">{passwordError}</Text>
            ) : null}
          </View>

          <View className="mt-6">
            <TurnstileWidget 
              ref={turnstileRef}
              onTokenReceived={setTurnstileToken} 
              onError={(err) => showAlert("Security Error", "Verification failed. Please try again.")}   
            />
          </View>

          <View className='mt-4'>
            <Pressable 
              style={{ 
                backgroundColor: '#C9A24D', 
                paddingVertical: 16, 
                borderRadius: 12, 
                alignItems: 'center',
                opacity: (isLoading || !turnstileToken) ? 0.7 : 1 
              }} 
              onPress={handleSubmit}
              disabled={isLoading || !turnstileToken}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className='text-white font-poppins-semibold font-semibold text-lg'>Login</Text>
              )}
            </Pressable>
          </View>
          <View className='mt-4' style={{alignItems: 'center'}}>
          <Link href="/(auth)/reset-password" testID='forgot-password-link' className='font-poppins-semibold underline font-semibold  text-lg text-secondary'>Forgot your password?</Link>
        </View>
        <View className='mt-4 ' style={{alignItems: 'center'}}>
          <Text className='font-poppins-semibold font-semibold text-lg text-black'>
            Don&apos;t have an account? <Link href="/signup" className='text-secondary font-poppins-semibold font-semibold underline'>Sign Up</Link>
          </Text>
        </View>
        </ScrollView>
        
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </View>
  )
}
