import React from 'react'
import { Tabs } from 'expo-router'
import CustomTabBar from '@/components/CustomTabBar'

const TabsLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
        }}
      />

      <Tabs.Screen
        name="solar"
        options={{
          title: 'Solar',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  )
}

export default TabsLayout