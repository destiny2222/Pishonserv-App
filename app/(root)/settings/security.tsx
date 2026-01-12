import { View, Text, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopHeader from '@/components/TopHeader'
import TextInputField from '@/components/TextInputField'

const security = () => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChanges = async () => {
        // Your save logic here
    }

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='flex-1'
            >
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName='px-4 pb-32  ' // flex-1 justify-center items-center
                    keyboardShouldPersistTaps='handled'
                    onScrollBeginDrag={Keyboard.dismiss}
                >
                    <TopHeader title='Security'/>
                    
                    <View className='w-full shadow-slate-50 shadow-sm mt-8 bg-slate-50 px-3 pt-8 pb-10 rounded-2xl'>
                        <View className='space-y-6 w-full px-4 mt-6'>
                            <Text className='font-poppins-medium text-base mb-2'>Current password</Text>
                            <TextInputField 
                                placeholder='Enter your password' 
                                secureTextEntry={true} 
                                className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium" 
                                onChangeText={setPassword}
                                value={password}
                            />
                        </View>
                        <View className='space-y-6 w-full px-4 mt-6'>
                            <Text className='font-poppins-medium text-base mb-2'>New password</Text>
                            <TextInputField 
                                placeholder='Enter your password' 
                                secureTextEntry={true} 
                                className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium" 
                                onChangeText={setNewPassword}
                                value={newPassword}
                            />
                        </View>
                        <View className='space-y-6 w-full px-4 mt-6'>
                            <Text className='font-poppins-medium text-base mb-2'>Confirm password</Text>
                            <TextInputField 
                                placeholder='Enter your password' 
                                secureTextEntry={true} 
                                className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium" 
                                onChangeText={setConfirmPassword}
                                value={confirmPassword}
                            />
                        </View>
                        <TouchableOpacity 
                            className='w-60 justify-center py-5 mx-auto items-center mt-10' 
                            style={{backgroundColor: '#C9A24D', paddingVertical: 16, borderRadius: 12}} 
                            onPress={handleChanges}
                        >
                            <Text className='text-white font-poppins-semibold text-lg'>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default security