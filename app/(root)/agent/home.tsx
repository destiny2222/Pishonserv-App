import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AgentHeader from '@/components/AgentHeader'
import icons from '@/constants/icons'
import EarningsChartCard from '@/components/EarningsChartCard'

const home = () => {
    return (
        <SafeAreaView className='bg-[#f9fafb]'>
            <AgentHeader />
            <ScrollView className='mt-4 px-4 mb-20'>
                <View className='py-5'>
                    <Text className='font-poppins-light font-light py-1'>Welcome!</Text>
                    <Text className=' text-black font-poppins-semibold font-semibold text-xl'>Adrian Hajdin</Text>
                </View>
                <View className='bg-white shadow-sm px-5 py-6   mb-5'>
                    <Image source={icons.wallet} className='w-6 h-6 size-5' resizeMode='contain' />
                    <Text className='font-semibold font-poppins-semibold text-xl'>Wallet Balance</Text>
                    <View className='mt-8'>
                        <Text className='font-semibold font-poppins-semibold text-4xl text-primary'>N622,000.00</Text>
                    </View>
                </View>
                <View className='bg-white shadow-sm px-5 py-6   mb-5'>
                    <Image source={icons.wallet} className='w-6 h-6 size-5' resizeMode='contain' />
                    <Text className='font-semibold font-poppins-semibold text-xl'>Wallet Balance</Text>
                    <View className='mt-8'>
                        <Text className='font-semibold font-poppins-semibold text-4xl text-primary'>N622,000.00</Text>
                    </View>
                </View>
                <View className='flex-row justify-center items-center gap-5 mb-4'>
                    <View className="flex-row gap-4">
                        <View className="flex-1 bg-white shadow-sm rounded-xl p-5 h-[135px]">
                            <Image source={icons.wallet} className="w-6 h-6" resizeMode="contain" />
                            <Text className="font-poppins-semibold text-base mt-2">Total Properties</Text>
                            <Text className="font-poppins-semibold text-2xl text-primary mt-auto">N622,000.00</Text>
                        </View>

                        <View className="flex-1 bg-white shadow-sm rounded-xl p-5 h-[135px]">
                            <Image source={icons.wallet} className="w-6 h-6" resizeMode="contain" />
                            <Text className="font-poppins-semibold text-base mt-2">Pending Inquiries</Text>
                            <Text className="font-poppins-semibold text-2xl text-primary mt-auto">N622,000.00</Text>
                        </View>
                    </View>
                </View>
                <EarningsChartCard />
                <View className='bg-white shadow-sm px-5 py-6   mb-5'>
                    <Image source={icons.task} className='w-6 h-6 size-5 mb-4' resizeMode='contain' />
                    <Text className='font-semibold font-poppins-semibold text-xl'>Wallet Balance</Text>
                    <View className='mt-8'>
                        <Text className='font-semibold font-poppins-semibold text-sm text-black'>No tasks assigned</Text>
                    </View>
                </View>
                <View className='bg-white shadow-sm px-5 py-6   mb-5'>
                    <Image source={icons.line} className='w-6 h-6 size-5 mb-4' resizeMode='contain' />
                    <Text className='font-semibold font-poppins-semibold text-2xl'>Recent Activities</Text>
                    <View className='mt-8'>
                        <Text className='font-semibold font-poppins-semibold text-sm text-black'>No recent activities</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default home