import { Card } from '@/components/Cards'
import Filters from '@/components/Filters'
import Search from '@/components/Search'
import TopHeader from '@/components/TopHeader'
import { getProperties, Property } from '@/libs/endpoints/property'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'



const SearchTab = () => {
  const params = useLocalSearchParams < {
    filter?: string;
    query?: string;
    type?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
  } > ();
  const [allProperties, setAllProperties] = useState < Property[] > ([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const all = await getProperties({ limit: 100 });
      setAllProperties(all);
    } catch {
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
  }, [params.filter, loading]);

  // Filter properties based on all filters
  const filteredProperties = allProperties.filter(property => {
    // Filter by listing type
    if (params.filter && params.filter.toLowerCase() !== 'all') {
      const propListingType = property.listing_type?.toLowerCase();
      const paramFilter = params.filter.toLowerCase();
      if (propListingType !== paramFilter) return false;
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
    if (params.type) {
      const propType = property.type?.toLowerCase();
      const paramType = params.type.toLowerCase();
      if (propType !== paramType && !propType?.includes(paramType)) {
        return false;
      }
    }

    // Filter by location (exact or partial from filters)
    if (params.location) {
      const propLoc = property.location?.toLowerCase();
      const paramLoc = params.location.toLowerCase();
      if (!propLoc?.includes(paramLoc)) {
        return false;
      }
    }

    // Filter by price range
    const price = Number(property.price);
    if (!isNaN(price)) {
      if (params.minPrice && price < Number(params.minPrice)) {
        return false;
      }
      if (params.maxPrice && price > Number(params.maxPrice)) {
        return false;
      }
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
          <View className='px-4 pt-4 bg-white'>
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
            <View className="py-20 px-5 items-center">
              <Text className="text-center text-gray-500 font-poppins-medium text-base mb-5">
                No properties found for this filter
              </Text>
              <TouchableOpacity 
                onPress={() => router.setParams({ 
                  filter: "All", 
                  query: "", 
                  type: "", 
                  location: "", 
                  minPrice: "", 
                  maxPrice: "" 
                })}
                className="bg-primary px-10 py-4 rounded-full"
              >
                <Text className="text-white font-poppins-bold text-base">Clear Filters</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  )
}

export default SearchTab