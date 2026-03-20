import icons from '@/constants/icons'
import { deleteProperty, getAgentProperties, Property } from '@/libs/endpoints/agent/createListing'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ListingPropertyProps {
    item: Property;
    onPress: () => void;
    onDelete: (id: number) => void;
}

const ListingPropertyCard = ({ item, onPress, onDelete }: ListingPropertyProps) => {
    // Handle image rendering: check if comma separated string
    const firstImage = item.images ? item.images.split(',')[0] : null;
    const isBase64 = firstImage?.startsWith('data:');
    const imageSource = firstImage
        ? (isBase64 ? { uri: firstImage } : { uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}/storage/${firstImage}` }) // Adjust path as per backend storage
        // Fallback or placeholder if needed, current code implies valid images
        : icons.home; // Fallback icon if available, or empty

    // Format price
    const formattedPrice = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(item.price));

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <View className="relative bg-slate-50 py-4 mx-4 shadow-slate-100 shadow-xl rounded-2xl px-3 mb-10 flex-row items-center overflow-hidden">
                <View className="relative">
                    <Image
                        source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource}
                        className="w-36 h-36 rounded-lg"
                        resizeMode="cover"
                    />
                </View>
                <View className="flex-1 pl-3 pr-20">
                    <Text className="text-secondary font-poppins-bold text-xl mb-1" numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text className="text-gray-600 font-poppins-regular text-base mb-3" numberOfLines={1}>
                        {item.location}
                    </Text>
                    <Text className="text-green-600 font-poppins-bold text-lg">
                        {formattedPrice}
                    </Text>
                </View>
                <View className="absolute top-4 right-4 bg-[#F5E6D3] px-2 py-1 rounded-full">
                    <Text className="text-[#8B7355] font-poppins-semibold text-xs capitalize">
                        {item.listing_type?.replace('_', ' ')}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => onDelete(item.id)} className="absolute right-4" style={{ top: "50%", transform: [{ translateY: 22 }] }} >
                    <View className="bg-red-50 p-3 rounded-full">
                        <Image source={icons.deleteicon} className="w-6 h-6" tintColor="#EF4444" />
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const Listing = () => {
    const [properties, setProperties] = useState < Property[] > ([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchProperties = async () => {
        try {
            const response = await getAgentProperties();
            if (response.status === 'success' || response.status === 'ok') {
                setProperties(response.data.items);
            }
        } catch (error) {
            
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProperties();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchProperties();
    };

    const handleDelete = (id: number) => {
        Alert.alert(
            "Delete Property",
            "Are you sure you want to delete this property/listing?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await deleteProperty(id);
                            if (response.status === 'success' || response.data.success) {
                                Alert.alert("Success", "Property deleted successfully");
                                fetchProperties(); // Refresh list
                            } else {
                                Alert.alert("Error", "Failed to delete property");
                            }
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete property");
                        }
                    }
                }
            ]
        );
    };

    const handleListing = () => {
        router.push("/create-listing");
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-300">
                <ActivityIndicator size="large" color="#C9A24D" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-300">
            <FlatList
                data={properties}
                renderItem={({ item }) => (
                    <ListingPropertyCard
                        item={item}
                        onPress={() => { /* router.push(`/property/${item.id}`) */ }}
                        onDelete={handleDelete}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }} // Increased padding for FAB/Button room
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#C9A24D"]} />
                }
                ListHeaderComponent={
                    <View className="mt-6 mb-5 px-5 flex-row justify-between items-center">
                        <Text className="text-secondary font-poppins-bold text-2xl">
                            My Listings ({properties.length})
                        </Text>
                    </View>
                }
                ListFooterComponent={
                    <View className="items-center mt-5 mb-10">
                        {/* Floating Action Button style or simple button */}
                        {/* Using the button from design, but centered or positioned better */}
                    </View>
                }
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center mt-20 px-5">
                        <Image source={icons.home} className="w-20 h-20 opacity-20 mb-4" resizeMode="contain" tintColor="#000" />
                        <Text className="font-poppins-semibold text-lg text-black mb-2">No properties found</Text>
                        <Text className="font-poppins text-black text-center mb-6">You haven&apos;t listed any properties yet.</Text>

                        <TouchableOpacity className="bg-primary px-8 py-3 rounded-xl" onPress={handleListing}>
                            <Text className='font-poppins-semibold text-white text-lg'>Create First Listing</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* Floating Action Button for Adding Listings (visible if not empty, or handled by ListEmpty) */}
            {properties.length > 0 && (
                <View className="absolute bottom-10 right-5">
                    <TouchableOpacity
                        className="bg-primary w-14 h-14 rounded-full justify-center items-center shadow-lg"
                        onPress={handleListing}
                        activeOpacity={0.8}
                    >
                        {/* <Image source={icons.plus} className="w-6 h-6" tintColor="white" /> */}
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Listing