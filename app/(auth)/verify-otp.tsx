import CustomAlert from '@/components/CustomAlert'
import Watermarks from '@/components/Watermarks'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useRef, useState } from 'react'
import { ActivityIndicator, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
// import { useAuth } from '@/hooks/useAuth'

// Mocking useAuth for now as per previous context or keeping it if it works. 
// The user file content showed `import { useAuth } from '@/hooks/useAuth'`. I will keep it.
import { useAuth } from '@/hooks/useAuth'

const VerifyOtp = () => {
  const params = useLocalSearchParams()
  const email = params.email as string
  const { verifyOtp, resendOtp } = useAuth()

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef < TextInput[] > ([])

  // Custom Alert State
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertTitle, setAlertTitle] = useState("")
  const [alertMessage, setAlertMessage] = useState("")
  const [alertAction, setAlertAction] = useState < (() => void) | null > (null)

  const showAlert = (title: string, message: string, action?: () => void) => {
    setAlertTitle(title)
    setAlertMessage(message)
    if (action) setAlertAction(() => action)
    setAlertVisible(true)
  }

  const handleAlertClose = () => {
    setAlertVisible(false)
    if (alertAction) {
      alertAction()
      setAlertAction(null)
    }
  }

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpCode = otp.join('')

    if (otpCode.length !== 6) {
      showAlert('Error', 'Please enter the complete 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      const result = await verifyOtp(email, otpCode)

      if (result.success) {
        showAlert('Success', 'Email verified successfully!', () => {
          router.replace('/(root)/(tabs)/home')
        })
      } else {
        showAlert('Verification Failed', result.error || 'Invalid OTP code')
      }
    } catch (error) {
      showAlert('Error', 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true)
    try {
      const result = await resendOtp(email)

      if (result.success) {
        showAlert('Success', 'A new OTP has been sent to your email')
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      } else {
        showAlert('Error', result.error || 'Failed to resend OTP')
      }
    } catch (error) {
      showAlert('Error', 'Failed to resend OTP')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='flex-1 bg-white justify-center items-center'>
        <Watermarks showTopRight showBottomLeft />

        <TouchableOpacity onPress={() => router.back()} className="absolute top-12 left-6 z-10">
          <Ionicons name="arrow-back" size={22} color="#C9A24D" />
        </TouchableOpacity>

        <Text className='text-2xl font-poppins-semibold text-secondary text-center'>Verify Email</Text>
        <Text className='text-sm text-gray-500 text-center mt-4 px-8'>
          Enter the 6-digit code sent to{'\n'}
          <Text className='font-poppins-semibold text-secondary'>{email}</Text>
        </Text>

        <View className='flex-row justify-center items-center gap-3 mt-10 px-8'>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref
              }}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType='number-pad'
              maxLength={1}
              className='w-12 h-14 border-2 border-gray-300 rounded-xl text-center text-2xl font-poppins-semibold text-secondary'
              style={{ borderColor: digit ? '#C9A24D' : '#d1d5db' }}
            />
          ))}
        </View>

        <View className='w-full px-8 mt-10'>
          <TouchableOpacity
            style={{
              backgroundColor: '#C9A24D',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              opacity: isLoading ? 0.7 : 1
            }}
            onPress={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className='text-white font-poppins-semibold text-lg'>Verify</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className='mt-8 items-center'>
          <Text className='text-sm text-gray-600 font-poppins-medium'>
            Didn't receive the code?
          </Text>
          <TouchableOpacity onPress={handleResendOtp} disabled={isResending} className='mt-2'>
            {isResending ? (
              <ActivityIndicator size="small" color="#C9A24D" />
            ) : (
              <Text className='text-secondary font-poppins-semibold text-base underline'>
                Resend OTP
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={handleAlertClose}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

export default VerifyOtp