import CustomAlert from '@/components/CustomAlert';
import Watermarks from '@/components/Watermarks';
import { resendOtp } from '@/libs/endpoints/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { ActivityIndicator, Keyboard, Pressable, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function VerifyResetOtp() {
  const params = useLocalSearchParams<{ email?: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      showAlert('Error', 'Please enter the complete 6-digit OTP');
      return;
    }

    if (!params.email) {
      showAlert('Error', 'Email not found. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      // Navigate to new password screen with email and OTP
      router.push({
        pathname: '/(auth)/new-password',
        params: { 
          email: params.email,
          otp: otpCode 
        }
      });
    } catch (error: any) {
      showAlert('Error', error?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || !params.email) return;

    setResending(true);
    try {
      const response = await resendOtp({ email: params.email });
      
      if (response.status === 'ok') {
        showAlert('Success', 'OTP has been resent to your email');
        setCountdown(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        showAlert('Error', response.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      showAlert('Error', error?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
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
            <Ionicons name="mail-outline" size={64} color="#C9A24D" />
            <Text className='font-bold text-2xl text-secondary font-poppins-semibold mt-4'>
              Verify OTP
            </Text>
            <Text className='text-gray-600 font-poppins text-center mt-3'>
              We&apos;ve sent a 6-digit code to{'\n'}
              <Text className='font-poppins-semibold text-primary'>{params.email}</Text>
            </Text>
          </View>

          {/* OTP Input */}
          <View className='flex-row justify-between w-full mb-6'>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                className='w-12 h-14 border-2 border-gray-300 rounded-lg text-center text-xl font-poppins-semibold focus:border-primary text-secondary'
                maxLength={1}
                keyboardType='number-pad'
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                editable={!isLoading}
              />
            ))}
          </View>

          {/* Resend OTP */}
          <View className='flex-row justify-center items-center mb-8'>
            <Text className='text-gray-600 font-poppins'>
              Didn&apos;t receive the code?{' '}
            </Text>
            {canResend ? (
              <TouchableOpacity onPress={handleResendOtp} disabled={resending}>
                <Text className='text-primary font-poppins-semibold'>
                  {resending ? 'Sending...' : 'Resend'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className='text-gray-400 font-poppins-semibold'>
                Resend in {countdown}s
              </Text>
            )}
          </View>

          {/* Verify Button */}
          <View className='w-full'>
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
                  Verify OTP
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
