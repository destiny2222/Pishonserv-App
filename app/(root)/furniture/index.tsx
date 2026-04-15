import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import images from '@/constants/images';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, FlatList, Image, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFurnitureList, FurnitureItem, FurnitureParams } from '@/libs/endpoints/furniture';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Search from '@/components/Search';
import FurnitureFilters from '@/components/FurnitureFilters';

interface FurnitureCardProps {
    item: FurnitureItem;
    onPress: (id: number) => void;
}

export const FurnitureCard = ({ item, onPress }: FurnitureCardProps) => {
    return (
        <View className='mb-8 w-full px-4'>
            <TouchableOpacity onPress={onPress} className='w-full rounded-xl bg-white shadow-md shadow-black/20'>
                <View className='relative'>
                    <Image source={{ uri: item.image_url }} className="w-full rounded-t-xl h-60" resizeMode="cover" />
                    <View className="absolute inset-0 bg-black/30 rounded-t-xl" />
                    {/* <View className="absolute top-3 right-3 bg-white/90 p-1 z-10 rounded-full flex-row items-center">
                        <Ionicons name="star" size={14} color="#C9A24D" />
                        <Text className="ml-0.5 text-xs font-semibold text-primary-300">4.8</Text>
                    </View> */}
                    <View className="absolute bottom-3 left-3 right-3 flex-row justify-between items-end">
                        <Text className="text-xl font-poppins-semibold text-white flex-shrink max-w-[60%]" numberOfLines={2}>
                            {item.name}
                        </Text>
                        <Text className='text-xl font-poppins-semibold text-white'>₦{Number(item.sale_price).toLocaleString()}</Text>
                    </View>
                </View>
                <View className='flex-row mt-0 justify-between items-center px-4 py-4'>
                    <TouchableOpacity className="px-6 py-2.5 bg-primary rounded-lg" onPress={() => onPress(item.id)}>
                        <Text className="text-sm font-poppins-semibold text-white">View Details</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity className="p-2.5 bg-gray-100 rounded-lg" >
                        <Ionicons name="star-outline" size={20} color="#C9A24D" />
                    </TouchableOpacity> */}
                </View>
            </TouchableOpacity>
        </View>
    );
};


const index = () => {
    const [furnitureList, setFurnitureList] = useState<FurnitureItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    const router = useRouter();
    const params = useLocalSearchParams<{ query?: string; category?: string }>();

    const onPress = (id: number) => {
        router.push(`/furniture/${id}`);
    };

    const fetchFurniture = useCallback(async (pageNum = 1, shouldAppend = false) => {
        try {
            if (pageNum === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            
            setError(null);
            
            const fetchParams: FurnitureParams = {
                q: params.query,
                category: params.category && params.category !== 'All' ? params.category : undefined,
                page: pageNum,
                limit: 20
            };

            const response = await getFurnitureList(fetchParams);
            const newItems = response.data.items || [];
            
            if (shouldAppend) {
                setFurnitureList(prev => [...prev, ...newItems]);
            } else {
                setFurnitureList(newItems);
            }
            
            setHasMore(newItems.length === 20);
            setPage(pageNum);
        } catch (err: any) {
            const errorMessage = err?.message || err?.data?.message || 'Failed to load furniture items';
            setError(errorMessage);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [params.query, params.category]);

    useEffect(() => {
        fetchFurniture(1, false);
    }, [fetchFurniture]);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore && !loading) {
            fetchFurniture(page + 1, true);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-200" edges={['top']}>
                <Header />
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#C9A24D" />
                    <Text className="mt-4 text-gray-600">Loading furniture...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-gray-200" edges={['top']}>
                <Header />
                <View className="flex-1 justify-center items-center px-4">
                    <Text className="text-red-500 text-lg mb-4">{error}</Text>
                    <TouchableOpacity onPress={fetchFurniture} className="bg-primary px-6 py-3 rounded-lg">
                        <Text className="text-white font-semibold">Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-200" edges={['top']}>
            <FlatList
                data={furnitureList}
                renderItem={({ item }) => (
                    <FurnitureCard item={item} onPress={() => onPress(item.id)} />
                )}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loadingMore ? (
                        <View className="py-5">
                            <ActivityIndicator size="small" color="#C9A24D" />
                        </View>
                    ) : null
                }
                contentContainerClassName='pb-32'
                ListHeaderComponent={
                    <View className=''>
                        <Header />
                        <View className="px-4">
                            <Search placeholder="Search furniture..." />
                        </View>
                        <View className="mt-2">
                           <FurnitureFilters />
                        </View>
                        <View className="px-2">
                            <HeroBanner autoplay interval={4000} />
                        </View>
                        <View className='pb-5 pt-5 mt-5 px-4'>
                            <Text className='text-2xl font-poppins-bold text-secondary px-3'>
                                {params.query ? `Search results for "${params.query}"` : 'Featured Furniture'}
                            </Text>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    !loading ? (
                        <View className="flex-1 justify-center items-center px-4 py-20">
                            <Text className="text-gray-500 text-lg text-center">No furniture items found matching your criteria.</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
};

export default index;