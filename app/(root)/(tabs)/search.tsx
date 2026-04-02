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
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProperties = async (currentPage = 1, isRefresh = false) => {
    try {
      if (currentPage === 1 && !isRefresh) setLoading(true);
      if (currentPage > 1) setLoadingMore(true);

      const listingType = params.filter && params.filter.toLowerCase() !== 'all' 
        ? params.filter.toLowerCase() as any 
        : undefined;

      const response = await getProperties({ 
        limit: 20, 
        page: currentPage,
        listing_type: listingType,
        location: params.location || (params.query ? params.query : undefined),
        type: params.type,
        min_price: params.minPrice ? Number(params.minPrice) : undefined,
        max_price: params.maxPrice ? Number(params.maxPrice) : undefined,
      });

      if (currentPage === 1) {
        setAllProperties(response.items);
      } else {
        setAllProperties(prev => [...prev, ...response.items]);
      }
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
    fetchProperties(1, false);
  }, [params.filter, params.query, params.type, params.location, params.minPrice, params.maxPrice]);

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

  // API handles the filtering now
  const filteredProperties = allProperties;

  const loadMore = () => {
    if (!loadingMore && hasMore && !loading && !filterLoading) {
      fetchProperties(page + 1, false);
    }
  };

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
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color="#C9A24D" className="mt-4 mb-20" />
          ) : null
        }
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