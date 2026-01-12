import { View, Text, Image, FlatList } from 'react-native'
import React from 'react'
import Search from '@/components/Search'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import Filters from '@/components/Filters'
import { Card } from '@/components/Cards'
import TopHeader from '@/components/TopHeader'



const search = () => {
  return (
    <SafeAreaView className='h-full bg-white'>
      <FlatList 
        data={[1,2,3,4,5,6,7,8,9,10]}
        renderItem={() => <Card />} 
        numColumns={2}
        keyExtractor={(item) => item.toString()}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className='px-4 pt-4'>
            <TopHeader title='Search for your ideal property' />
            <Search />
            <View className='py-3'>
              <Filters />
              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                {/* Found {properties?.length} Properties */}
                179 related properties found
              </Text>
              
            </View>

          </View> 
        }
      />
    </SafeAreaView>
  )
}

export default search