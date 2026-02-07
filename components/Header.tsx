import images from '@/constants/images';
import { getCurrentUser } from "@/libs/endpoints/auth";
import { User } from "@/types/auth";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import CountryPicker, { Country } from "react-native-country-picker-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";


function getFlagEmoji(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
} 

function getCountryName(c: Country) {
  return typeof c.name === "string"
    ? c.name
    : (c.name as any)?.common ?? (c.name as any)?.official ?? "";
}

export default function Header() {
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("NG");
  const [countryName, setCountryName] = useState("Nigeria");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data.user);
        // console.log("Current User:", response.data.user);
      } catch (error) {
        // console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const menuItems = useMemo(
    () => [
      { label: "Home", onPress: () => router.push("/(tabs)/home") },
      { label: "Furniture", onPress: () => router.push("/(root)/furniture") },
      { label: "Solar & Inverter", onPress: () => router.push("/(tabs)/solar") },
      { label: "Profile", onPress: () => router.push("/(tabs)/profile") },
      {
        label: "Log Out",
        danger: true,
        onPress: () => {
          // TODO: clear token etc.
          router.replace("/(auth)/login");
        },
      },
    ],
    []
  );

  const onSelectCountry = (c: Country) => {
    setCountryCode(c.cca2 ?? "");
    setCountryName(getCountryName(c));
    setCountryOpen(false);
  };

  return (
    <View className="w-full">
        {/* style={{ paddingTop: insets.top + 2 }} */}
        <View className='w-full flex-row justify-between items-center px-4 py-6 overflow-hidden  bg-white shadow-white' >
            <View className='flex-row items-center gap-5'>
                <Image source={{ uri: user?.profile_image || images.avatar }} className="w-12 h-12 rounded-full size-5" resizeMode="cover"/>
                <View className=''>
                    <Text className='text-2xl font-semibold poppins-semibold'>{user?.name}  {user?.lname}</Text>
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
        <CountryPicker  visible={countryOpen} onClose={() => setCountryOpen(false)}
            onSelect={onSelectCountry} withFilter withFlag withEmoji
            renderFlagButton={() => null}
        />
        <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
            <Pressable className="flex-1 bg-black/20 " onPress={() => setMenuOpen(false)}>
                <Pressable
                    onPress={() => {}}
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
                    <Pressable key={item.label} onPress={() => {  setMenuOpen(false); item.onPress();  }}
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