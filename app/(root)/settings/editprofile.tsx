import { View, Text, ScrollView, Image, TouchableOpacity, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopHeader from '@/components/TopHeader'
import images from '@/constants/images'
import icons from '@/constants/icons'
import TextInputField from '@/components/TextInputField'
import Button from '@/components/Button'

const editprofile = () => {
    const [email, setEmail] = useState('');
    const handleChanges = async () => {

    }
  return (
    <SafeAreaView className='h-full bg-white'>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1'>
        <ScrollView showsVerticalScrollIndicator={false} 
            keyboardShouldPersistTaps='handled'
            onScrollBeginDrag={Keyboard.dismiss} 
            contentContainerClassName='pb-32 px-2'>
            <TopHeader title='Personal Profile'/>
            <View className='flex flex-col items-center relative mt-5'>
            <View className='flex flex-col items-center'>
                <Image source={images.avatar} className='size-44 relative rounded-full' />
                <TouchableOpacity className='absolute bottom-11 right-2'>
                <Image source={icons.edit} className='size-9' />
                </TouchableOpacity>
                <Text className='pt-4 font-poppins-semibold text-2xl text-secondary font-semibold'>Adrian Hajdin</Text>
            </View>
            </View>

            <View className='shadow-slate-50 shadow-sm mt-8 bg-slate-50 px-3 pt-8 pb-10 rounded-2xl'>
                <View className='space-y-6 w-full px-4 mt-10'>
                    <Text className='font-poppins-medium text-xl mb-2 '>First Name</Text>
                    <TextInputField 
                        secureTextEntry={true} 
                        onChangeText=''
                        value=''
                        className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
                    />
                </View>
                <View className='space-y-6 w-full px-4 mt-10'>
                    <Text className='font-poppins-medium text-xl mb-2 '>Last Name</Text>
                    <TextInputField 
                        secureTextEntry={true} 
                        onChangeText=''
                        value=''
                        className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
                    />
                </View>
                <View className='space-y-6 w-full px-4 mt-10'>
                    <Text className='font-poppins-medium text-base mb-2'>Email</Text>
                    <TextInputField  
                    keyboardType='email-address' 
                    className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium" 
                    value={email}
                    onChangeText={setEmail}
                    />
                </View>
                <View className='space-y-6 w-full px-4 mt-10'>
                    <Text className='font-poppins-medium text-xl mb-2 '>Phone</Text>
                    <TextInputField 
                        secureTextEntry={true} 
                        onChangeText=''
                        value=''
                        className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
                    />
                </View>
                <TouchableOpacity className='w-60 py-5 justify-center mx-auto items-center mt-10' style={{backgroundColor: '#C9A24D', paddingVertical: 16, borderRadius: 12, alignItems: 'center'}}  onPress={handleChanges}>
                    <Text className='text-white font-poppins-semibold font-semibold text-lg'>Save Changes</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default editprofile