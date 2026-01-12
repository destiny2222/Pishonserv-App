// import React from "react";
// import { View, Image, TouchableOpacity, Text } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import images from "@/constants/images";
// import icons from "@/constants/icons";
// import Ionicons from "@expo/vector-icons/Ionicons";

// type Props = {
//   onPressBell?: () => void;
//   onPressMenu?: () => void;
// };

// const AgentHeader = ({ onPressBell, onPressMenu }: Props) => {
//   return (
//     <View  className="bg-white flex-row items-center justify-between px-5 shadow-sm">
//         <Image  source={images.logo} className="w-40 h-20 " resizeMode="contain" /> 
//         <View className="flex-row items-center gap-6">
//             <TouchableOpacity onPress={onPressBell} hitSlop={12}>
//                 <Image  source={icons.bell}  className="w-6 h-6" resizeMode="contain" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={onPressMenu} hitSlop={12}>
//                 <Ionicons name="menu-outline" size={40} color="#111" />
//             </TouchableOpacity>
//         </View>
//     </View>
//   );
// };

// export default AgentHeader;


import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, Pressable, Animated, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import images from "@/constants/images";
import icons from "@/constants/icons";
import Ionicons from "@expo/vector-icons/Ionicons";

const MENU_ITEMS = [
  { label: "Dashboard", route: "/agent/home" },
  { label: "Download MOU", route: "/agent/mou" },
  { label: "Manage Properties", route: "/agent/listing" },
  { label: "Inquiries", route: "/agent/inquiries" },
  { label: "Earnings", route: "/agent/earnings" },
  { label: "Transactions", route: "/agent/transactions" },
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
          <Pressable>
            <Animated.View style={{   opacity: anim,  transform: [{ scale }, { translateY }], }}
              className="bg-white rounded-2xl mx-5 mt-24 overflow-hidden shadow-lg"
            >
              {MENU_ITEMS.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => go(item.route)}
                  className={`py-5 items-center ${
                    idx !== MENU_ITEMS.length - 0 ? "border-b border-gray-200" : ""
                  }`}
                >
                  <Text className="font-poppins text-base text-black-300">{item.label}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity onPress={() => { setOpenMenu(false);  }} className="py-5 items-center" >
                <Text className="font-poppins text-base text-red-500">Log Out</Text>
              </TouchableOpacity>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default AgentHeader;
