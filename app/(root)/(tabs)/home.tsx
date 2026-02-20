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

export default function home() {
  const params = useLocalSearchParams < { filter?: string } > ();
  const [featuredProperties, setFeaturedProperties] = useState < Property[] > ([]);
  const [wishlistIds, setWishlistIds] = useState < number[] > ([]);
  const [allProperties, setAllProperties] = useState < Property[] > ([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  // console.log(user);

  useFocusEffect(
    useCallback(() => {
      const fetchWishlistIds = async () => {
        try {
          const response = await getWishlist();
          const ids = response.data.items.map((item) => item.id);
          setWishlistIds(ids);
        } catch (error) {
          // console.error("Failed to fetch wishlist:", error);
        }
      };
      fetchWishlistIds();
    }, [])
  );

  const fetchProperties = async () => {
    try {
      setLoading(true);
      // Fetch featured properties
      const featured = await getFeaturedProperties();
      setFeaturedProperties(featured);

      // Fetch all properties without filter
      const all = await getProperties({ limit: 100 });
      setAllProperties(all);
    } catch (error) {
      // console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Show loading when filter changes
  useEffect(() => {
    if (!loading && params.filter) {
      setFilterLoading(true);
      const timer = setTimeout(() => {
        setFilterLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [params.filter]);

  // Filter properties based on selected filter
  const filteredProperties = params.filter && params.filter !== 'All'
    ? allProperties.filter(property => property.listing_type === params.filter)
    : allProperties;
  return (
    <SafeAreaView className='h-full mb-72 bg-gray-200' edges={['top']}>

      <FlatList
        data={filterLoading ? [] : filteredProperties}
        renderItem={({ item }) =>
          <Card item={typeof item === 'number' ? undefined : item} onPress={() => typeof item !== 'number' && router.push(`/properties/${item.id}`)} />}
        keyExtractor={(item) => typeof item === 'number' ? item.toString() : item.id.toString()}
        numColumns={2}
        contentContainerClassName='pb-32'
        columnWrapperClassName='flex gap-5 px-5'
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <View className="px-3">
            {user?.role === 'agent' || user?.role === 'owner' ? <AgentHeader /> : <Header />}
            <HeroBanner className="mb-96" autoplay interval={4000} showsVerticalScrollIndicator={false} />
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



