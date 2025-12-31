import { View, Text, Image } from 'react-native'
import React from 'react'
import images from '@/constants/images';

export default function Watermarks({
  showTopRight = true,
  showBottomLeft = true,
}: {
  showTopRight?: boolean;
  showBottomLeft?: boolean;
}) {
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