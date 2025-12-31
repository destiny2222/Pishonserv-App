

import OnboardingItem from '@/components/onboardingItem';
import { onboardingData } from '@/constants/data';
import React, { useRef, useState } from 'react';
import { FlatList, Image, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import  images  from '@/constants/images';

export default function index() {
    const { width } = useWindowDimensions();
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1 && flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

   
    return (
    <SafeAreaView className="bg-white flex-1">
        <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={({ item }) => (
            <OnboardingItem
            item={item}
            currentIndex={currentIndex}
            onboardingData={onboardingData}
            handleNext={handleNext}
            />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        />
    </SafeAreaView>
    );

}