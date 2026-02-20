import images from '@/constants/images';
import { useAuth } from "@/hooks/useAuth";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
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


  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      // console.error("Error logging out:", error);
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
    <View className="w-full">
      {/* style={{ paddingTop: insets.top + 2 }} */}
      <View className='w-full flex-row justify-between items-center px-4 py-6 overflow-hidden  bg-white shadow-white' >
        <View className='flex-row items-center gap-5'>
          <Image source={user?.profile_image ? { uri: user.profile_image } : images.avatar} className="w-12 h-12 rounded-full size-5" resizeMode="cover" />
          <View className=''>
            <Text className='text-2xl font-semibold poppins-semibold'>{user ? `${user.name} ${user.lname}` : "Guest"}</Text>
            <Text className='text-sm font-normal poppins-regular'>Good Morning</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => setCountryOpen(true)} className="flex-row items-center mr-4" style={{ color: "#eee" }}>
            <Text className="text-xl mr-1">{countryCode ? getFlagEmoji(countryCode) : "🏳️"}</Text>
            <Ionicons name="chevron-down" size={16} color="#111" />
          </TouchableOpacity>
          <Pressable onPress={() => setMenuOpen(true)} android_ripple={{ color: "#eee", borderless: true }}>
            <Ionicons name="menu-outline" size={30} color="#111" />
          </Pressable>
        </View>
      </View>
      <CountryPicker visible={countryOpen} onClose={() => setCountryOpen(false)}
        countryCode={countryCode as CountryCode}
        onSelect={onSelectCountry} withFilter withFlag withEmoji
        renderFlagButton={() => null}
      />
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