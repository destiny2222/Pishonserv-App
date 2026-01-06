import { View, Text } from 'react-native'
import React from 'react'
import Search from '@/components/Search'
import { SafeAreaView } from 'react-native-safe-area-context'

const search = () => {
  return (
    <SafeAreaView className='h-full'>
      <View className='px-4 pt-4'>
        <Search />
      </View> 
    </SafeAreaView>
  )
}

export default search