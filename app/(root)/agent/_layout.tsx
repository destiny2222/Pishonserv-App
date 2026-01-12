import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AgentLayout = () => {
  // return (
  //   <View className='flex-1 justify-center items-center'>
  //     <Text>Agent Layout</Text>
  //   </View>
  //   <Stack  screenOptions={{ headerShown: false }} />
  // )
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default AgentLayout