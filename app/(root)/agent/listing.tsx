import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ListingPropertyCard } from '@/components/Cards'
import { listing } from '@/constants/data'
import { router } from 'expo-router'

const Listing = () => {
    const handleListing = () => {
        router.replace("/(root)/agent/create-listing");
        console.log("Ding");
    }
    return (
        <SafeAreaView>
            <View>
                <FlatList
                    data={listing ?? []}
                    renderItem={
                        ({ item }) => (
                            <ListingPropertyCard item={item} />
                        )
                    }
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 32 }}
                    ListHeaderComponent={
                        <View className="mt-6 mb-8 px-5">
                            <Text className="text-secondary font-poppins-bold text-3xl">
                                Listed Properties (1)
                            </Text>
                        </View>
                    }
                    ListFooterComponent={
                        <View className="w-full px-4 mt-8">
                            <TouchableOpacity className="bg-primary p-4 rounded-xl w-52" onPress={handleListing}>
                                <Text className='font-poppins-semibold font-semibold text-white text-center  text-xl'>Add Listings +</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    ListEmptyComponent={
                        <View className="w-full px-4 mt-8">
                            <TouchableOpacity className="bg-primary p-4 rounded-xl w-52" onPress={handleListing}>
                                <Text className='font-poppins-semibold font-semibold text-white text-center  text-xl'>Add Listings +</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    )
}

export default Listing