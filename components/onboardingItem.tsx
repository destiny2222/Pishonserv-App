import images from '@/constants/images';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";


function Watermarks({ showTopRight = true, showBottomLeft = true }) {
  return (
    <>
      {showTopRight && (
        <Image
          source={images.watermarkArrow}
          resizeMode="contain"
          pointerEvents="none"
          className="absolute top-10 right-5 w-[110px] h-[110px] rotate-180"
        />
      )}

      {showBottomLeft && (
        <Image
          source={images.watermarkArrow}
          resizeMode="contain"
          pointerEvents="none"
          className="absolute -bottom-8 left-2 w-[170px] h-[220px]"
        />
      )}
    </>
  );
}

export default function OnboardingItem({ item, currentIndex, onboardingData, handleNext }) {
  const { width, height } = useWindowDimensions();
  const HERO_HEIGHT = Math.round(height * 0.72);

  const isLast = currentIndex === onboardingData.length - 1;

  const finishOnboarding = async () => {
    await SecureStore.setItemAsync("hasSeenOnboarding", "true");
    router.replace("/(root)/(tabs)/home");
  };

  const onNextPress = () => {
    if (isLast) finishOnboarding();
    else handleNext?.();
  };


  if (item.type === "collage") {
    return (
      <View className="flex-1 bg-white" style={{ width }}>
        <Watermarks showTopRight={true} showBottomLeft={true} />

        <View className="flex-1 justify-center items-center">
          <View className="h-[220px] w-full items-center justify-center relative mt-10">
            <Image source={item.cards[0]} resizeMode="cover" className="absolute w-[120px] h-[170px] rounded-2xl "
              style={{ left: 50, top: 30, transform: [{ rotate: "-12deg" }] }}
            />
            <Image source={item.cards[1]} resizeMode="cover" className="absolute w-[125px] h-[180px] rounded-2xl z-10" style={{ top: 20 }} />
            <Image source={item.cards[2]} resizeMode="cover" className="absolute w-[120px] h-[170px] rounded-2xl "
              style={{ right: 50, top: 30, transform: [{ rotate: "12deg" }] }}
            />
          </View>
          <Text className="text-xl font-bold  font-poppins-semibold text-black  text-center mt-6">
            {item.title}
            <Text className="text-[#D4A574] font-semibold">{item.highlightedTitle}</Text>
            {item.titleEnd}
          </Text>

          <View className="mt-14">
            <TouchableOpacity onClick="" onPress={onNextPress}
              className="bg-white border-2 border-[#D4A574] px-3 pt-3 pb-2 rounded-full"
            >
              <Text className="text-[#D4A574] text-4xl"><Ionicons name="arrow-forward" size={32} /></Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ width }}>
      <Watermarks showTopRight={false} showBottomLeft={true} />

      <View className="absolute top-10 left-0 right-0 items-center z-10">
        <Image source={images.transparentLogo} className="w-full h-[120px]" resizeMode="contain" />
      </View>

      <View className="mx-4 mt-3 overflow-hidden" style={{
        height: HERO_HEIGHT, borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}
      >
        <Image source={item.image} resizeMode="cover" className="w-full h-full" />
      </View>

      <View className="flex-row justify-between items-center px-5 pt-12">
        <View className="flex-1 pr-4">
          <Text className="text-xl font-bold  font-poppins-semibold text-black">
            {item.title}
            {item.highlightedTitle && (
              <Text className="text-[#D4A574] font-bold  poppins-semibold">{item.highlightedTitle}</Text>
            )}
            {item.titleEnd}
          </Text>

          <Text className="text-xl font-bold  font-poppins-semibold text-black mt-1">
            {item.subtitle}
            {item.highlightedSubtitle && (
              <Text className="text-[#D4A574] font-bold  font-poppins-semibold">{item.highlightedSubtitle}</Text>
            )}
            {item.subtitleEnd}
          </Text>
        </View>
        <TouchableOpacity onPress={currentIndex < onboardingData.length - 1 ? handleNext : undefined}
          className="bg-white border-2 border-[#D4A574] px-3 pt-3 pb-2 rounded-full"
        >
          <Text className="text-[#D4A574] text-4xl"><Ionicons name="arrow-forward" size={32} /></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
