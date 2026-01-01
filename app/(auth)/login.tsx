import { View, Text, Image, TouchableNativeFeedback, TouchableWithoutFeedback, Keyboard, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import TextInputField from '@/components/TextInputField';
import Button from '@/components/Button';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Watermarks from '@/components/Watermarks';


export default function login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);


  const handleSubmit = async () => {
    console.log("User logged in details", email, password)
    await AsyncStorage.removeItem("hasSeenOnboarding");

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
          <TextInputField placeholder='Enter your password' 
            secureTextEntry={true} 
            className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium" 
            onChangeText={setPassword}
            value={password}
          />
        </View>

        <View className='w-full px-8 mt-10'>
          <Pressable style={{backgroundColor: '#C9A24D', paddingVertical: 16, borderRadius: 12, alignItems: 'center'}} onPress={handleSubmit} >
            <Text className='text-white font-poppins-semibold font-semibold text-lg'>Login</Text>
          </Pressable>
        </View>
        <View className='mt-16'>
          <Link href="/reset-password" className='font-poppins-semibold underline font-semibold  text-lg text-secondary'>Forgot your password?</Link>
        </View>
        <View className='mt-16'>
          <Text className='font-poppins-semibold font-semibold text-lg text-black'>
            Don't have an account? <Link  href="/signup" className='text-secondary font-poppins-semibold font-semibold underline'>Sign Up</Link>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}