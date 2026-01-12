import { View, Text, TouchableOpacity, Pressable, ImageBackground, FlatList, Image } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import images from '@/constants/images';
import icons from '@/constants/icons';
import { Property } from '@/libs/endpoints/property';
import { favorites } from '@/constants/data'


interface Props {
  item?: Property;
  onPress: () => void;
}

type FavoriteItem = {
  id: string;
  name: string;
  location: string;
  price: string;
  image: any;
  status: string;
  type: string;
};

interface FavoriteProperty {
  item?: FavoriteItem;
  onPress: () => void;
}

type ListingItem = {
  id: string;
  name: string;
  location: string;
  price: string;
  image: any;
  status: string;
  type: string;
}


interface ListingProperty{
  item?: ListingItem;
  onPress: () => void;
}


interface ImageSourcePropType {
  uri: string;
}

function toImageSource(img: any): ImageSourcePropType {
  if (typeof img === "string") return { uri: img };
  if (typeof img === "number") return img;
  if (img && typeof img === "object" && "uri" in img) return img as ImageSourcePropType;

  return images.featured1;
}

export const FeaturedCard = ({ onPress, item }: Props) => {
  // console.log("Property: ", item);
  const mainImage = toImageSource(item?.image);


  return (
    <TouchableOpacity onPress={onPress} className='w-60 h-80 bg-white rounded-2xl mr-7  items-start relative flex flex-col gap-6'>
      <Image source={mainImage} className="size-full  rounded-2xl" resizeMode="cover" />
      <Image source={images.cardGradient} className="size-full  rounded-2xl absolute bottom-0" resizeMode="cover" />
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
          <Image source={icons.heart} className='size-5' />
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
      <Image source={images.featured4} className="w-full rounded-lg h-40" resizeMode="cover" />
      <View className="flex flex-col mt-2">
        <Text className="text-black-300 text-base font-poppins-semibold">
          Cozy Apartment
        </Text>
        <Text className="text-black-300 text-xs font-poppins py-1">Lagos, Nigeria</Text>
        <View className='flex flex-row items-center justify-between w-full mt-2'>
          <Text className='text-xl text-black-300 font-poppins-semibold'>₦2,500,000</Text>
          <Image source={icons.heart} className='w-5 h-5 mr-2 ' tintColor="#C9A24D" />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export const FavoriteCard = ({ onPress, item }: FavoriteProperty) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View className="relative bg-slate-50 py-4 mx-4 shadow-slate-100 shadow-xl rounded-2xl px-3 mb-10 flex-row items-center overflow-hidden">
        <View className="relative">
          <Image source={item?.image} className="w-36 h-36 rounded-lg" resizeMode="cover" />
          <View className="absolute top-0  right-0 bg-green-500 px-3 py-2 rounded-b-lg">
            <Text className="text-white font-poppins-semibold text-sm">
              {item?.status}
            </Text>
          </View>
        </View>
        <View className="flex-1 pl-3 pr-20">
          <Text className="text-secondary font-poppins-bold text-xl mb-1" numberOfLines={2}>
            {item?.name}
          </Text>
          <Text className="text-gray-600 font-poppins-regular text-base mb-3" numberOfLines={1}>
            {item?.location}
          </Text>
          <Text className="text-green-600 font-poppins-bold text-2xl">
            {item?.price}
          </Text>
        </View>
        <View className="absolute top-4 right-4 bg-[#F5E6D3] px-4 py-2 rounded-full">
          <Text className="text-[#8B7355] font-poppins-semibold text-sm">
            {item?.type}
          </Text>
        </View>
        <TouchableOpacity  onPress={() => { }}  className="absolute right-4"  style={{ top: "50%", transform: [{ translateY: 22 }] }} >
          <View className="bg-red-50 p-3 rounded-full">
            <Image source={icons.deleteicon} className="w-6 h-6" tintColor="#EF4444" />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export const ListingPropertyCard  = ({onPress, item}: ListingProperty ) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View className="relative bg-slate-50 py-4 mx-4 shadow-slate-100 shadow-xl rounded-2xl px-3 mb-10 flex-row items-center overflow-hidden">
        <View className="relative">
          <Image source={item?.image} className="w-36 h-36 rounded-lg" resizeMode="cover" />
          {/* <View className="absolute top-0  right-0 bg-green-500 px-3 py-2 rounded-b-lg">
            <Text className="text-white font-poppins-semibold text-sm">
              {item?.status}
            </Text>
          </View> */}
        </View>
        <View className="flex-1 pl-3 pr-20">
          <Text className="text-secondary font-poppins-bold text-xl mb-1" numberOfLines={2}>
            {item?.name}
          </Text>
          <Text className="text-gray-600 font-poppins-regular text-base mb-3" numberOfLines={1}>
            {item?.location}
          </Text>
          <Text className="text-green-600 font-poppins-bold text-2xl">
            {item?.price}
          </Text>
        </View>
        <View className="absolute top-4 right-4 bg-[#F5E6D3] px-4 py-2 rounded-full">
          <Text className="text-[#8B7355] font-poppins-semibold text-sm">
            {item?.type}
          </Text>
        </View>
        <TouchableOpacity  onPress={() => { }}  className="absolute right-4"  style={{ top: "50%", transform: [{ translateY: 22 }] }} >
          <View className="bg-red-50 p-3 rounded-full">
            <Image source={icons.deleteicon} className="w-6 h-6" tintColor="#EF4444" />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
