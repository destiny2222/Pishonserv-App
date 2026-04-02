import AgentHeader from '@/components/AgentHeader';
import { Card, FeaturedCard, } from '@/components/Cards';
import Filters from '@/components/Filters';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import { useAuth } from '@/hooks/useAuth';
import { getFeaturedProperties, getProperties, Property } from '@/libs/endpoints/property';
import { getWishlist } from '@/libs/endpoints/wishlist';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const params = useLocalSearchParams < { filter?: string } > ();
  const [featuredProperties, setFeaturedProperties] = useState < Property[] > ([]);
  const [wishlistIds, setWishlistIds] = useState < number[] > ([]);
  const [allProperties, setAllProperties] = useState < Property[] > ([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const fetchWishlistIds = async () => {
        try {
          const response = await getWishlist();
          const ids = response.data.items.map((item) => item.id);
          setWishlistIds(ids);
        } catch (error) {
        }
      };
      fetchWishlistIds();
    }, [])
  );

  const fetchProperties = async (currentPage = 1, isRefresh = false) => {
    try {
      if (currentPage === 1 && !isRefresh) setLoading(true);
      if (currentPage > 1) setLoadingMore(true);
      
      if (currentPage === 1) {
        // Fetch featured properties only on initial load or refresh
        const featured = await getFeaturedProperties();
        setFeaturedProperties(featured);
      }

      const listingType = params.filter && params.filter.toLowerCase() !== 'all' 
        ? params.filter.toLowerCase() as any 
        : undefined;

      const response = await getProperties({ 
        limit: 20, 
        page: currentPage,
        listing_type: listingType
      });

      if (currentPage === 1) {
        setAllProperties(response.items);
      } else {
        setAllProperties(prev => [...prev, ...response.items]);
      }
      
      // If we got exactly the limit or more, there might be more to load
      setHasMore(response.items.length >= 20);
      setPage(currentPage);
    } catch {
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProperties(1, true);
    setRefreshing(false);
  };

  useEffect(() => {
    // When filter changes, reset to page 1
    fetchProperties(1, false);
  }, [params.filter]);

  // Show loading when filter changes
  useEffect(() => {
    if (!loading && params.filter) {
      setFilterLoading(true);
      const timer = setTimeout(() => {
        setFilterLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [params.filter, loading]);

  // Filter is now applied in the API call directly, so we just use allProperties
  const filteredProperties = allProperties;

  const loadMore = () => {
    if (!loadingMore && hasMore && !loading && !filterLoading) {
      fetchProperties(page + 1, false);
    }
  };
  return (
    <SafeAreaView className='h-full mb-72 bg-gray-200' edges={['top']}>

      <FlatList
        data={filterLoading ? [] : filteredProperties}
        renderItem={({ item }) =>
          <Card item={typeof item === 'number' ? undefined : item} onPress={() => typeof item !== 'number' && router.push(`/properties/${item.id}`)} />}
        keyExtractor={(item) => typeof item === 'number' ? String(item) : item.id.toString()}
        numColumns={2}
        contentContainerClassName='pb-32'
        columnWrapperClassName='flex gap-5 px-5'
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color="#C9A24D" className="mt-4 mb-20" />
          ) : null
        }
        ListHeaderComponent={
          <View className="px-3">
            {user?.role === 'agent' || user?.role === 'owner' ? <AgentHeader /> : <Header />}
            <HeroBanner autoplay interval={4000} />
            <View className='px-2'>
              <View className="flex flex-row justify-between items-center px-2 mb-3 mt-10">
                <Text className="text-secondary text-lg font-poppins-semibold font-bold">
                  Featured Properties
                </Text>
                <TouchableOpacity onPress={() => router.push('/search')} hitSlop={10}>
                  <Text className="text-primary font-bold text-lg font-poppins-semibold">See all</Text>
                </TouchableOpacity>
              </View>
              {loading ? (
                <ActivityIndicator size="large" color="#C9A24D" className="my-10" />
              ) : (
                <FlatList
                  data={featuredProperties}
                  renderItem={({ item }) =>
                    <FeaturedCard item={item}
                      onPress={() => router.push(`/properties/${item.id}`)}
                    />}
                  keyExtractor={(item) => item.id.toString()}
                  nestedScrollEnabled
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                />
              )}
            </View>
            <View className="flex flex-row justify-between items-center px-2 mb-3 mt-10">
              <Text className="text-secondary text-lg font-poppins-semibold font-bold">
                Our recommendations
              </Text>
              <TouchableOpacity onPress={() => router.push('/search')} hitSlop={10}>
                <Text className="text-primary font-poppins-semibold font-bold text-lg">See all</Text>
              </TouchableOpacity>
            </View>
            <Filters />
          </View>
        }
        ListEmptyComponent={
          filterLoading ? (
            <View className="py-10 px-5">
              <ActivityIndicator size="large" color="#C9A24D" />
            </View>
          ) : !loading ? (
            <View className="py-10 px-5">
              <Text className="text-center text-gray-500 font-poppins-medium text-base">
                No properties found for this filter
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  )
}