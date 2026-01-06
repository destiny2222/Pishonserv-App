import { View, Text, TouchableOpacity, Pressable, ImageBackground, FlatList, Image } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import images from '@/constants/images';
import icons from '@/constants/icons';

interface Props {
    item?: any;
    onPress: () => void;
}

export const FeaturedCard = ({ onPress, item }: Props) => {
  return (
    <TouchableOpacity className='w-60 h-80 bg-white rounded-2xl mr-7  items-start relative flex flex-col gap-6'>
      <Image source={item.image} className="size-full  rounded-2xl" resizeMode="cover"/>
      <Image source={images.cardGradient} className="size-full  rounded-2xl absolute bottom-0" resizeMode="cover"/>
      <View className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full flex-row items-center">
          <Ionicons name="star" size={14} color="#C9A24D" />
          <Text className="ml-1 text-xs font-semibold text-black">{item.rating}</Text>
      </View>
      <View className="absolute bottom-0 left-0 right-0 px-3 py-3 inset-x-5">
          <Text className="text-white text-base font-poppins-semibold">
              {item.title}
          </Text>
          <Text className="text-white/90 text-xs font-poppins py-1">{item.location}</Text>
          <View className='flex flex-row items-center justify-between w-full'>
              <Text className='text-xl text-white font-poppins-semibold'>{item.price}</Text>
              <Image source={icons.heart} className='size-5'/>
          </View>
      </View>
    </TouchableOpacity>
  )
}

export const Card = ({ onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} className='w- flex-1 mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative'>
      <View className="absolute top-5 right-5 bg-white/90 p-1 z-50 rounded-full flex-row items-center">
        <Ionicons name="star" size={14} color="#C9A24D" />
        <Text className="ml-0.5 text-xs font-semibold text-primary-300">4.7</Text>
      </View>
      <Image source={images.featured4} className="w-full rounded-lg h-40" resizeMode="cover"/>
      {/* absolute bottom-0 left-0 right-0 px-3 py-3 inset-x-5 */}
      <View className="flex flex-col mt-2">
        <Text className="text-black-300 text-base font-poppins-semibold">
            Cozy Apartment
        </Text>
        <Text className="text-black-300 text-xs font-poppins py-1">Lagos, Nigeria</Text>
        <View className='flex flex-row items-center justify-between w-full mt-2'>
            <Text className='text-xl text-black-300 font-poppins-semibold'>₦2,500,000</Text>
            <Image source={icons.heart} className='w-5 h-5 mr-2 ' tintColor="#C9A24D"/>
        </View>
      </View>
    </TouchableOpacity>
  )
}

// export default Cards