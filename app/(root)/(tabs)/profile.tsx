import { View, Text, ScrollView, Image, TouchableOpacity, ImageSourcePropType, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import images from '@/constants/images';
import { settings } from '@/constants/data';
import TopHeader from '@/components/TopHeader';
import { Href, router } from 'expo-router';

interface SettingsItemProps {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({ icon, title, onPress, textStyle, showArrow = true }: SettingsItemProps) => (
  <TouchableOpacity className='flex flex-row items-center justify-between bg-white py-4 px-3 mb-4 rounded-lg shadow-sm shadow-zinc-200' onPress={onPress}>
    <View className='flex flex-row items-center gap-3'>
      <Image source={icon} className='size-6'/>
      <Text className={`text-lg font-poppi-medium text-colors-black-300 ${textStyle}`}>{title}</Text>
    </View>
    {showArrow && <Image source={icons.rightArrow} className='size-5' />}
  </TouchableOpacity>
)

const profile = () => {

  const handleLogout = async () => {
    const result = await logout();
    if(result){
      Alert.alert("Success", "Logout successful.");
    }else{
      Alert.alert("Error", "Logout failed. Please try again.");
    }   
  }

  return (
    <SafeAreaView className='h-full bg-white'>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName='pb-32 px-2'>
        <TopHeader title='Profile'/>
        <View className='flex flex-col items-center relative mt-5'>
          <View className='flex flex-col items-center'>
            <Image source={images.avatar} className='size-44 relative rounded-full' />
            <TouchableOpacity className='absolute bottom-11 right-2'>
              <Image source={icons.edit} className='size-9' />
            </TouchableOpacity>
            <Text className='pt-4 font-poppins-semibold text-2xl text-secondary font-semibold'>Adrian Hajdin</Text>
          </View>
        </View>

        <View className='flex flex-col mt-8 pt-5 border-primary-200'>
          {settings.map((item, index) => ( 
            <SettingsItem
              key={index}
              icon={item.icon}
              title={item.title}
              onPress={() => router.push(item.href as Href)}
            />
          ))}
        </View>

        <View className='flex flex-col mt-5 pt-5 border-primary-200'>
          <SettingsItem 
            icon={icons.logout} 
            title="Logout" 
            onPress={handleLogout} 
            textStyle="text-red-500" 
            showArrow={false} 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default profile