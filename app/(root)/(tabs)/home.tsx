import { View, ScrollView, Text, Pressable, FlatList, TouchableOpacity } from 'react-native'
import React from 'react';
import images from '@/constants/images'
import { SafeAreaFrameContext, SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import HeroBanner from '@/components/HeroBanner';
import Header from '@/components/Header';
import { Card, FeaturedCard, } from '@/components/Cards';
import Filters from '@/components/Filters';
import { featured } from '@/constants/data';

export default function home() {
  const commendation = [1,2,3,4] ;
  return (
    < >
      
      {/* <SafeAreaView className='h-full bg-white'  > */}
      <SafeAreaView className='h-full bg-white mb-72'>
          
          <FlatList 
            data={[1,2, 3, 4]}
            renderItem={({ item }) => <Card />} 
            keyExtractor={(item) => item.toString()}
            numColumns={2}
            contentContainerClassName='pb-32'
            columnWrapperClassName='flex gap-5 px-5'
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View className="px-3">
                <Header /> 
                <HeroBanner className="mb-96" autoplay interval={4000} showsVerticalScrollIndicator={false}/>
                <View className='px-2'>
                    <View className="flex flex-row justify-between items-center px-2 mb-3 mt-10">
                      <Text className="text-secondary text-lg font-poppins-semibold font-bold">
                        Featured Properties
                      </Text>
                      <TouchableOpacity onPress={() => console.log("See all")} hitSlop={10}>
                        <Text className="text-primary font-bold text-lg font-poppins-semibold">See all</Text>
                      </TouchableOpacity>
                    </View>
                    <FlatList 
                      data={featured}
                      renderItem={({ item }) => <FeaturedCard item={item} />} 
                      keyExtractor={(item) => item.id.toString()}
                      nestedScrollEnabled
                      horizontal
                      bounces={false}
                      showsHorizontalScrollIndicator={false}
                      // contentContainerClassName="flex-row mt-5"
                    />
                </View>
                <View className="flex flex-row justify-between items-center px-2 mb-3 mt-10">
                  <Text className="text-secondary text-lg font-poppins-semibold font-bold">
                    Our recommendations
                  </Text>
                  <TouchableOpacity onPress={() => console.log("See all")} hitSlop={10}>
                    <Text className="text-primary font-poppins-semibold font-bold text-lg">See all</Text>
                  </TouchableOpacity>
                </View>
                <Filters />
              </View>
            }
          />
      </SafeAreaView>
    </>
  )
}



