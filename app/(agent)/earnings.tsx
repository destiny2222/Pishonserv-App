import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import AgentHeader from '@/components/AgentHeader'
import { router } from 'expo-router'

const Earnings = () => {
    const handleRedirect = async () => {
        router.replace('/(root)/agent/managebankaccount');
    }
    return (
        <SafeAreaView className=''>
            <AgentHeader />
            <View className='px-4 mt-4'>
               <View className='mb-4 mt-4'>
                    <Text className='text-secondary font-poppins-semibold font-semibold text-2xl'>My Earnings</Text>
                </View>
                <View className='bg-white shadow-sm px-5 py-6   mb-5'>
                    <Image source={icons.wallet} className='w-6 h-6 size-5' resizeMode='contain' />
                    <Text className='font-semibold font-poppins-semibold text-xl'>Wallet Balance</Text>
                    <View className='mt-8'>
                        <Text className='font-semibold font-poppins-semibold text-4xl text-primary'>N622,000.00</Text>
                    </View>
                </View>
                <View className='mb-4'>
                    <TouchableOpacity className="bg-primary p-4 rounded-xl" onPress={handleRedirect}>
                        <Text className='font-poppins-semibold font-semibold text-white text-center  text-xl'>Manage Bank Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* 
            
             */}
        </SafeAreaView>
    )
}

export default Earnings