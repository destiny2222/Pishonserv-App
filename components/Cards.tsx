import icons from '@/constants/icons';
import images from '@/constants/images';
import { Property } from '@/libs/endpoints/property';
import { addToWishlist, removeFromWishlist, WishlistItem } from '@/libs/endpoints/wishlist';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import CustomAlert from './CustomAlert';


interface Props {
  item?: Property;
  onPress: () => void;
  isInWishlist?: boolean;
  onWishlistToggle?: (propertyId: number, added: boolean) => void;
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
  item?: WishlistItem;
  onPress: () => void;
  onDelete?: (id: number) => void;
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

interface ListingProperty {
  item?: ListingItem;
  onPress: () => void;
}

interface ImageSourcePropType {
  uri: string;
}



const toImageSource = (img: any, fallback: ImageSourcePropType): ImageSourcePropType => {
  if (!img) return fallback;

  // local image: require("...") returns a number
  if (typeof img === "number") return img;
  if (typeof img === "string") return { uri: img };
  if (typeof img === "object" && typeof img.uri === "string") return img;
  return fallback;
};


export const FeaturedCard = ({ onPress, item, isInWishlist = false, onWishlistToggle }: Props) => {
  const [isFavorite, setIsFavorite] = useState(isInWishlist);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const imageSource = toImageSource(item?.image, images.featured1);
  const formattedPrice = item?.price ? `₦${Number(item.price).toLocaleString()}` : '₦0';

  useEffect(() => {
    setIsFavorite(isInWishlist);
  }, [isInWishlist]);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleWishlistToggle = async (e: any) => {
    e.stopPropagation();
    if (!item?.id || loading) return;

    // Check if user is authenticated
    const token = await SecureStore.getItemAsync('access_token');
    if (!token) {
      showAlert('Authentication Required', 'Please log in to add items to your wishlist.');
      return;
    }

    setLoading(true);
    try {
      const response = await addToWishlist(item.id);
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);
      onWishlistToggle?.(item.id, newFavoriteState);
      
      // Check response to determine if added or removed
      const message = response.data?.added 
        ? 'Added to wishlist' 
        : response.data?.removed 
        ? 'Removed from wishlist'
        : response.message || 'Wishlist updated';
      
      showAlert('Success', message);
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to update wishlist';
      showAlert('Error', errorMessage);
      // Revert state on error
      setIsFavorite(isFavorite);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <TouchableOpacity onPress={onPress} className='w-60 h-80 bg-white rounded-2xl mr-7  items-start relative flex flex-col gap-6'>
      <Image source={imageSource} className="size-full  rounded-2xl" resizeMode="cover" />
      <Image source={images.cardGradient} className="size-full  rounded-2xl absolute bottom-0" resizeMode="cover" />
      {/* <View className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full flex-row items-center">
        <Ionicons name="star" size={14} color="#C9A24D" />
        <Text className="ml-1 text-xs font-semibold text-black">{rating}</Text>
      </View> */}
      <View className="absolute bottom-0 left-0 right-0 px-3 py-3 inset-x-5">
        <Text className="text-white text-base font-poppins-semibold" numberOfLines={2}>
          {item?.title}
        </Text>
        <Text className="text-white/90 text-xs font-poppins py-1">{item?.location}</Text>
        <View className='flex flex-row items-center justify-between w-full'>
          <Text className='text-xl text-white font-poppins-semibold'>{formattedPrice}</Text>
          <TouchableOpacity onPress={handleWishlistToggle} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={20} 
                color={isFavorite ? "#FF6B6B" : "#fff"} 
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </TouchableOpacity>
  )
}

export const Card = ({ onPress, item, isInWishlist = false, onWishlistToggle }: Props) => {
  const [isFavorite, setIsFavorite] = useState(isInWishlist);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const imageSource = toImageSource(item?.image, images.featured1);
  const formattedPrice = item?.price ? `₦${Number(item.price).toLocaleString()}` : '₦0';

  useEffect(() => {
  setIsFavorite(isInWishlist);
}, [isInWishlist]);

    const showAlert = (title: string, message: string) => {
      setAlertTitle(title);
      setAlertMessage(message);
      setAlertVisible(true);
    };

    const handleWishlistToggle = async (e: any) => {
      e.stopPropagation();
      if (!item?.id || loading) return;
  
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        showAlert('Authentication Required', 'Please log in to add items to your wishlist.');
        return;
      }
  
      setLoading(true);
      try {
        const response = await addToWishlist(item.id);
        const newFavoriteState = !isFavorite;
        setIsFavorite(newFavoriteState);
        onWishlistToggle?.(item.id, newFavoriteState);
        const message = response.data?.added 
          ? 'Added to wishlist' 
          : response.data?.removed 
          ? 'Removed from wishlist'
          : response.message || 'Wishlist updated';
        
        showAlert('Success', message);
      } catch (error: any) {
        const errorMessage = error?.data?.message || error?.message || 'Failed to update wishlist';
        showAlert('Error', errorMessage);
        setIsFavorite(isFavorite);
      } finally {
        setLoading(false);
      }
    };

  return (
    <TouchableOpacity onPress={onPress} className='w-full flex-1 mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative'>
      <Image source={imageSource} className="w-full rounded-lg h-40" resizeMode="cover" />
      <View className="flex flex-col mt-2">
        <Text className="text-black-300 text-base font-poppins-semibold" numberOfLines={1}>
          {item?.title}
        </Text>
        <Text className="text-black-300 text-xs font-poppins py-1">{item?.location}</Text>
        <View className='flex flex-row items-center justify-between w-full mt-2'>
          <Text className='text-xl text-black-300 font-poppins-semibold'>{formattedPrice}</Text>
          <TouchableOpacity onPress={handleWishlistToggle} disabled={loading} className="p-1">
            {loading ? (
              <ActivityIndicator size="small" color="#C9A24D" />
            ) : (
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={20} 
                color={isFavorite ? "#FF6B6B" : "#C9A24D"} 
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </TouchableOpacity>
  )
}

export const FavoriteCard = ({ onPress, item, onDelete }: FavoriteProperty) => {
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  
  if (!item) return null;

  const firstImage = item.images ? item.images.split(',')[0].trim() : undefined;
  const imageSource = firstImage 
  ? { uri: `https://yourdomain.com/storage/${firstImage}` } 
  : images.featured1;

  
  const formattedPrice = `₦${Number(item.price).toLocaleString()}`;

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };


  const handleDelete = async (e: any) => {
    e.stopPropagation();
    if (!item?.id || loading) return;
    try {      
      setLoading(true);
      const response = await removeFromWishlist(item.id);
      showAlert('Removed', 'Property removed from wishlist');
       onDelete?.(item.id);
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to remove from wishlist';
      showAlert('Error', errorMessage);
    }
    finally {      
      setLoading(false);
    }
  };

  const handleConfirmClose = async () => {
    setConfirmVisible(false);
    setLoading(true);
    try {
      await removeFromWishlist(item.id);
      onDelete?.(item.id);
      showAlert('Success', 'Removed from wishlist');
    } catch (error: any) {
      showAlert('Error', 'Failed to remove from wishlist');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View className="relative bg-slate-50 py-4 mx-4 shadow-slate-100 shadow-xl rounded-2xl px-3 mb-10 flex-row items-center overflow-hidden">
        <View className="relative">
          <Image source={imageSource} className="w-36 h-36 rounded-lg" resizeMode="cover" />
        </View>
        <View className="flex-1 pl-3 pr-20">
          <Text className="text-secondary font-poppins-bold text-xl mb-1" numberOfLines={2}>
            {item?.title}
          </Text>
          <Text className="text-gray-600 font-poppins-regular text-base mb-3" numberOfLines={1}>
            {item?.location}
          </Text>
          <Text className="text-green-600 font-poppins-bold text-2xl">
            {formattedPrice}
          </Text>
        </View>
        <TouchableOpacity  onPress={handleDelete} disabled={loading} className="absolute right-4"  style={{ top: "50%", transform: [{ translateY: 22 }] }} >
          <View className="bg-red-50 p-3 rounded-full">
            {loading ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <Image source={icons.deleteicon} className="w-6 h-6" tintColor="#EF4444" />
            )}
          </View>
        </TouchableOpacity>
      </View>
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      <CustomAlert
        visible={confirmVisible}
        title="Remove from Wishlist"
        message="Are you sure you want to remove this property from your wishlist?"
        onClose={handleConfirmClose}
      />
    </TouchableOpacity>
  );
};

export const ListingPropertyCard  = ({onPress, item}: ListingProperty ) => {
  const imageSource = toImageSource(item?.image, images.featured1);
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View className="relative bg-slate-50 py-4 mx-4 shadow-slate-100 shadow-xl rounded-2xl px-3 mb-10 flex-row items-center overflow-hidden">
        <View className="relative">
          <Image source={imageSource} className="w-36 h-36 rounded-lg" resizeMode="cover" />
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
