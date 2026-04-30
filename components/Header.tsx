import images from '@/constants/images';
import { useAuth } from "@/hooks/useAuth";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Image, Modal, Pressable, Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";


function getFlagEmoji(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export default function Header() {
  const insets = useSafeAreaInsets();
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("NG");


  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      Alert.alert("Logout", "Logout successful");
      router.replace("/home");
    } catch (error) {
     
    }
  }, [logout]);

  const menuItems = useMemo(() => {
    const items: { label: string; onPress: () => void; danger?: boolean }[] = [
      { label: "Home", onPress: () => router.push("/home") },
      { label: "Furniture", onPress: () => router.push("/furniture") },
      { label: "Solar & Inverter", onPress: () => router.push("/solar") },
      { label: "Profile", onPress: () => router.push("/profile") },
    ];

    if (isAuthenticated) {
      items.push({
        label: "Log Out",
        danger: true,
        onPress: handleLogout,
      });
    } else {
      items.push(
        {
          label: "Sign Up",
          onPress: () => router.push("/signup/step-1"),
        },
        {
          label: "Log In",
          danger: false,
          onPress: () => router.push("/login"),
        }
      );
    }

    return items;
  }, [isAuthenticated, handleLogout]);

  const onSelectCountry = (c: Country) => {
    setCountryCode(c.cca2 ?? "");
    setCountryOpen(false);
  };

  return (
    <View style={[styles.container]}>
      <View 
        style={[styles.header]}
        className='w-full px-4 border-b border-gray-100'
      >
        <View className='flex-row items-center flex-1 pr-4'>
          <Image 
            source={user?.profile_image ? { uri: user.profile_image } : images.avatar} 
            className="w-12 h-12 rounded-full mr-3" 
            resizeMode="cover" 
          />
          <View className='flex-1'>
            <Text numberOfLines={1} ellipsizeMode='tail' className='text-xl font-semibold poppins-semibold'>
                {user ? `${user.name}` : "Guest"}
            </Text>
            <Text className='text-sm font-normal poppins-regular text-gray-700'>{greeting}</Text>
          </View>
        </View>
        <View>
          <Pressable onPress={() => setMenuOpen(true)} android_ripple={{ color: "#eee", borderless: true }} className="p-2">
            <Ionicons name="menu-outline" size={32} color="#111" />
          </Pressable>
        </View>
      </View> 
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable className="flex-1 bg-black/20 " onPress={() => setMenuOpen(false)}>
          <Pressable
            onPress={() => { }}
            className="bg-white rounded-2xl border border-gray-200 w-full top-50 absolute shadow-black  right-0 left-0"
            style={{
              top: insets.top + 56,
              paddingVertical: 10,
              // shadow (iOS)
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 16,
              //   shadowOffset: { width: 0, height: 8 },
              // elevation (Android)
              elevation: 8,
            }}
          >
            {menuItems.map((item) => (
              <Pressable key={item.label} onPress={() => { setMenuOpen(false); item.onPress(); }}
                className="px-5 py-3" android_ripple={{ color: "#f2f2f2" }} >
                <Text className={`text-xl text-center ${item.danger ? "text-red-500" : "text-black"}`}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
});