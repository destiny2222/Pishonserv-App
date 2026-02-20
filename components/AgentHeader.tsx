import icons from "@/constants/icons";
import images from "@/constants/images";
import { logout } from "@/libs/endpoints/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Modal, Pressable, Text, TouchableOpacity, View, } from "react-native";

const MENU_ITEMS = [
  { label: "Dashboard", route: "/dashboard" },
  // { label: "Download MOU", route: "/mou" },
  { label: "Manage Properties", route: "/listing" },
  { label: "Inquiries", route: "/inquiries" },
  { label: "Earnings", route: "/earnings" },
  { label: "Transactions", route: "/settings/transactions" },
];

const AgentHeader = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (openMenu) {
      Animated.timing(anim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    } else {
      anim.setValue(0);
    }
  }, [openMenu]);

  const go = (route: string) => {
    setOpenMenu(false);
    router.push(route);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // reload the app
      router.replace("/(auth)/login");
    } catch (error) {
      // console.error("Logout failed:", error);
    }
  };

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] });
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] });

  return (
    <>
      {/* HEADER */}
      {/* <SafeAreaView  className=""> */}
      <View edges={["top"]} className="flex-row items-center justify-between px-5 bg-white ">
        <Image source={images.logo} className="w-40 h-20" resizeMode="contain" />

        <View className="flex-row items-center gap-6">
          <TouchableOpacity hitSlop={12}>
            <Image source={icons.bell} className="w-6 h-6" resizeMode="contain" />
          </TouchableOpacity>

          <TouchableOpacity hitSlop={12} onPress={() => setOpenMenu(true)}>
            <Ionicons name="menu-outline" size={40} color="#111" />
          </TouchableOpacity>
        </View>
      </View>
      {/* </SafeAreaView> */}

      {/* DROPDOWN MENU  */}
      <Modal transparent visible={openMenu} animationType="fade" onRequestClose={() => setOpenMenu(false)}>
        <Pressable className="flex-1 bg-black/20" onPress={() => setOpenMenu(false)}>
          {/* Transparent overlay to close menu */}
        </Pressable>

        <View className="absolute top-24 left-5 right-5">
          <Animated.View style={{ opacity: anim, transform: [{ scale }, { translateY }], }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg"
          >
            {MENU_ITEMS.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => go(item.route)}
                className={`py-5 items-center ${idx !== MENU_ITEMS.length - 0 ? "border-b border-gray-200" : ""
                  }`}
              >
                <Text className="font-poppins text-base text-black-300">{item.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={handleLogout} className="py-5 items-center" >
              <Text className="font-poppins text-base text-red-500">Log Out</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default AgentHeader;
