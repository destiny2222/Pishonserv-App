import images from '@/constants/images';
import { getFurnitureDetail, FurnitureItem } from '@/libs/endpoints/furniture';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const FurnitureDetail = () => {
    const { id } = useLocalSearchParams();
    const [furniture, setFurniture] = useState<FurnitureItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (id) {
            fetchFurnitureDetail();
        }
    }, [id]);

    const fetchFurnitureDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const furnitureItem = await getFurnitureDetail(Number(id));
            
            if (furnitureItem) {
                setFurniture(furnitureItem);
            } else {
                setError('Furniture not found');
            }
        } catch (err: any) {
            const errorMessage = err?.message || err?.data?.message || 'Failed to load furniture details';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const formatDescription = (description: string) => {
        if (!description) return 'No description available for this item.';
        return description
            .replace(/&nbsp;/gi, ' ')
            .replace(/&amp;/gi, '&')
            .replace(/&quot;/gi, '"')
            .replace(/&lt;/gi, '<')
            .replace(/&gt;/gi, '>')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<[^>]+>/g, '')
            .replace(/\\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    };

    const handleBookCall = () => {
        Linking.openURL('tel:08122040965');
    };

    const handleAddToCart = () => {
        // Implement add to cart logic
        
    };

    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-200" edges={['top']}>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#C9A24D" />
                    <Text className="mt-4 text-gray-600">Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !furniture) {
        return (
            <SafeAreaView className="flex-1 bg-gray-200" edges={['top']}>
                <View className="flex-1 justify-center items-center px-4">
                    <Text className="text-red-500 text-lg mb-4">{error || 'Furniture not found'}</Text>
                    <TouchableOpacity onPress={() => router.back()} className="bg-primary px-6 py-3 rounded-lg">
                        <Text className="text-white font-semibold">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-200" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-gray-100">
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-lg font-poppins-semibold text-gray-900 ps-4">Furniture Details</Text>
                {/* <TouchableOpacity onPress={handleToggleFavorite} className="p-2 rounded-full bg-gray-100">
                    <Ionicons 
                        name={isFavorite ? "heart" : "heart-outline"} 
                        size={24} 
                        color={isFavorite ? "#FF6B6B" : "#000"} 
                    />
                </TouchableOpacity> */}
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Image Section */}
                <View className="relative">
                    <Image
                        source={(() => {
                            if (furniture.image_url) return { uri: furniture.image_url };
                            if (furniture.image) return { uri: furniture.image };
                            if (furniture.images) {
                                if (Array.isArray(furniture.images) && furniture.images.length > 0) {
                                    return { uri: furniture.images[0] };
                                }
                                if (typeof furniture.images === 'string') {
                                    const firstImage = furniture.images.split(',')[0].trim();
                                    return { uri: firstImage };
                                }
                            }
                            return images.featured1;
                        })()}
                        className="w-full h-96"
                        resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black/10" />
                </View>

                {/* Content Section */}
                <View className="px-5 py-6">
                    {/* Title and Price */}
                    <View className="mb-4">
                        <Text className="text-2xl font-poppins-bold text-gray-900 mb-2">
                            {furniture.name}
                        </Text>
                        <View className="flex-row items-center gap-3">
                            <Text className="text-3xl font-poppins-bold text-primary">
                                ₦{Number(furniture.sale_price).toLocaleString()}
                            </Text>
                            {furniture.regular_price !== furniture.sale_price && (
                                <Text className="text-lg font-poppins-medium text-gray-400 line-through">
                                    ₦{Number(furniture.regular_price).toLocaleString()}
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="h-px bg-gray-200 my-4" />

                    {/* Description */}
                    <View className="mb-6">
                        <Text className="text-lg font-poppins-semibold text-gray-900 mb-3">
                            Description
                        </Text>
                        <Text className="text-base font-poppins text-gray-600 leading-7">
                            {formatDescription(furniture.description)}
                        </Text>
                    </View>

                    {/* Specifications */}
                    <View className="mb-6">
                        <Text className="text-lg font-poppins-semibold text-gray-900 mb-3">
                            Specifications
                        </Text>
                        <View className="bg-gray-50 rounded-lg p-4 gap-3">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-sm font-poppins text-gray-600">Product ID</Text>
                                <Text className="text-sm font-poppins-semibold text-gray-900">#{furniture.id}</Text>
                            </View>
                            <View className="h-px bg-gray-200" />
                            <View className="flex-row justify-between items-center">
                                <Text className="text-sm font-poppins text-gray-600">Material</Text>
                                <Text className="text-sm font-poppins-semibold text-gray-900">High Quality Wood</Text>
                            </View>
                            <View className="h-px bg-gray-200" />
                            <View className="flex-row justify-between items-center">
                                <Text className="text-sm font-poppins text-gray-600">Availability</Text>
                                <Text className="text-sm font-poppins-semibold text-green-600">{furniture.visibility === 'visible' ? 'In Stock' : 'Out of Stock'}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Quantity Selector */}
                    {/* <View className="mb-6">
                        <Text className="text-lg font-poppins-semibold text-gray-900 mb-3">
                            Quantity
                        </Text>
                        <View className="flex-row items-center gap-4">
                            <TouchableOpacity 
                                onPress={decrementQuantity}
                                className="w-12 h-12 rounded-lg bg-gray-100 items-center justify-center"
                            >
                                <Ionicons name="remove" size={20} color="#000" />
                            </TouchableOpacity>
                            <Text className="text-xl font-poppins-semibold text-gray-900 w-12 text-center">
                                {quantity}
                            </Text>
                            <TouchableOpacity 
                                onPress={incrementQuantity}
                                className="w-12 h-12 rounded-lg bg-primary items-center justify-center"
                            >
                                <Ionicons name="add" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View> */}
                </View>

                {/* Bottom Padding */}
                <View className="h-32" />
            </ScrollView>

            {/* Fixed Bottom Actions */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4 shadow-2xl ">
                <View className="flex-row gap-3">
                    {/* <TouchableOpacity 
                        onPress={handleAddToCart}
                        className="flex-1 bg-primary py-4 rounded-xl items-center justify-center flex-row gap-2"
                    >
                        <Ionicons name="cart-outline" size={20} color="#fff" />
                        <Text className="text-white text-base font-poppins-semibold">
                            Add to Cart
                        </Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity 
                        className="bg-gray-900 py-4 px-6 rounded-xl items-center justify-center"
                    >
                        <Ionicons name="call-outline" size={20} color="#fff" />
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={handleBookCall}
                        className="flex-1 bg-primary py-4 rounded-xl items-center justify-center flex-row gap-2"
                    >
                        <Ionicons name="call-outline" size={20} color="#fff" />
                        <Text className="text-white text-base font-poppins-semibold"> Book a Call </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default FurnitureDetail;
