import { heroBanners } from '@/constants/data';
import images from "@/constants/images";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, ImageBackground, Text, useWindowDimensions, View } from "react-native";

const HeroBanner = ({ autoplay = true, interval = 4000, className }: { autoplay?: boolean; interval?: number; className?: string }) => {
  const { width } = useWindowDimensions();
  const listRef = useRef < FlatList > (null);
  const [index, setIndex] = useState(0);


  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % heroBanners.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length > 0) setIndex(viewableItems[0].index ?? 0);
  }).current;
  return (
    <View className={`pt-7 ${className || ''}`}>
      <FlatList
        ref={listRef}
        data={heroBanners}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 60 }}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <ImageBackground
              source={item.image}
              resizeMode="cover"
              className="w-11/12 mx-auto min-h-96 rounded-2xl overflow-hidden  justify-center items-center px-5"
            >
              <Image source={images.cardGradient} className="absolute inset-0 w-screen size-full rounded-2xl bottom-0 " />
              <Text className="text-white font-poppins-semibold text-5xl text-center">
                {item.title}
              </Text>

              <Text className="text-white font-poppins-semibold text-lg text-center mt-3">
                {item.subtitle}
              </Text>
            </ImageBackground>
          </View>
        )}
      />
    </View>
  )
}

export default HeroBanner