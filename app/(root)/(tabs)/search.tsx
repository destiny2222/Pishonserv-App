import { Card } from '@/components/Cards'
import Filters from '@/components/Filters'
import Search from '@/components/Search'
import TopHeader from '@/components/TopHeader'
import { getProperties, Property } from '@/libs/endpoints/property'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'



const search = () => {
  const params = useLocalSearchParams<{ 
    filter?: string;
    query?: string;
    type?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
  }>();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
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

  // Filter properties based on all filters
  const filteredProperties = allProperties.filter(property => {
    // Filter by listing type
    if (params.filter && params.filter !== 'All' && property.listing_type !== params.filter) {
      return false;
    }

    // Filter by search query (title, location)
    if (params.query) {
      const query = params.query.toLowerCase();
      const matchesTitle = property.title?.toLowerCase().includes(query);
      const matchesLocation = property.location?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesLocation) {
        return false;
      }
    }

    // Filter by property type
    if (params.type && property.type !== params.type) {
      return false;
    }

    // Filter by location
    if (params.location && !property.location?.toLowerCase().includes(params.location.toLowerCase())) {
      return false;
    }

    // Filter by price range
    const price = Number(property.price);
    if (params.minPrice && price < Number(params.minPrice)) {
      return false;
    }
    if (params.maxPrice && price > Number(params.maxPrice)) {
      return false;
    }

    return true;
  });

  return (
    <SafeAreaView className='h-full bg-gray-200' edges={['top']}>
      <FlatList 
        data={filterLoading ? [] : filteredProperties}
        renderItem={({ item }) => 
          <Card item={item} onPress={() => router.push(`/properties/${item.id}`)} />
        } 
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <View className='px-4 pt-4'>
            <TopHeader title='Search for your ideal property' />
            <Search />
            <View className='py-3'>
              <Filters />
              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                {loading ? <ActivityIndicator size="large" color="#C9A24D" /> : `${filteredProperties.length} related properties found`}
              </Text>
              
            </View>

          </View> 
        }
        ListEmptyComponent={
          filterLoading ? (
            <View className="py-20 px-5">
              <ActivityIndicator size="large" color="#C9A24D" />
            </View>
          ) : !loading ? (
            <View className="py-20 px-5">
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

export default search