import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import icons from '@/constants/icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TabIcon = ({ focused, icon, title }) => {
  return (
    <View className="flex-col items-center pt-2">
      <Image
        source={icon}
        className="w-7 h-7"
        tintColor={focused ? '#C9A24D' : '#0D3B66'}
        resizeMode="contain"
      />
      <Text
        className={`mt-1 font-medium font-poppins-medium text-center text-[10px] ${
          focused ? 'text-primary-300' : 'text-gray-500'
        }`}
      >
        {title}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,

        tabBarStyle: {
          backgroundColor: '#fff',
          position: 'absolute',
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 10,
          borderTopColor: '#0061FF1a',
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Explore" />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          headerShown: false,
          title: 'Cart',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.cart} title="Cart" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />

      {/* Hidden screen */}
      <Tabs.Screen name="solar" options={{ headerShown: false, href: null }} />
    </Tabs>
  )
}

export default TabsLayout