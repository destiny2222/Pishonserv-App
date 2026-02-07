import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import icons from '@/constants/icons'

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: any, title: string }) => {
  return (
    <View className='flex-1 flex-col flex items-center mt-3'>
      <Image source={icon} className='w-7 h-7' tintColor={focused ? '#C9A24D' : '#0D3B66'} resizeMode='contain' />
      <Text className={`mt-1 font-medium font-poppins-medium text-center w-full text-base ${focused ? 'text-primary-300' : 'text-gray-500'}`}>{title}</Text>
    </View>
  )
}

const  TabsLayout = () => {
  return (
    <>
      <Tabs screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor:'white',
          position: 'absolute',
          borderTopColor: '#0061FF1a',
          borderTopWidth: 1,
          minHeight: 80,
        }
      }}>
        <Tabs.Screen name='home' options={{ headerShown: false, title: "Home", 
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.home} title="Home" /> }}/>
        <Tabs.Screen name='search' options={{ headerShown: false, title: "Search",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.search} title="Explore" /> }}/>
        <Tabs.Screen name='cart' options={{ headerShown: false, title: "Cart",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.cart} title="Cart" /> }}/>
        <Tabs.Screen  name="profile"  options={{ headerShown: false, title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.person} title="Profile" /> }}/>
        <Tabs.Screen
          name="solar"
          options={{
            headerShown: false,
            href: null,
          }}
        />
      </Tabs>
    </> 
  )
}

export default TabsLayout