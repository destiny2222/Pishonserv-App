import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const furnitureCategories = [
  { label: 'All', value: 'All' },
  { label: 'Sofa', value: 'Sofa' },
  { label: 'Chair', value: 'Chair' },
  { label: 'Table', value: 'Table' },
  { label: 'Bed', value: 'Bed' },
  { label: 'Wardrobe', value: 'Wardrobe' },
  { label: 'Office', value: 'Office' },
];

const FurnitureFilters = () => {
  const params = useLocalSearchParams<{ category?: string }>();
  const [selectedCategory, setSelectedCategory] = useState(params.category || 'All');

  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category);
    } else {
      setSelectedCategory('All');
    }
  }, [params.category]);

  const handleCategory = (category: string) => {
    if (category === 'All') {
      setSelectedCategory('All');
      router.setParams({ category: '' }); // Clear category filter
      return;
    }

    if (selectedCategory === category) {
      setSelectedCategory('All');
      router.setParams({ category: '' });
      return;
    }

    setSelectedCategory(category);
    router.setParams({ category: category });
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 mb-2 px-4">
      {furnitureCategories.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleCategory(item.value)}
          className={`mr-3 px-6 py-2 rounded-full border ${
            selectedCategory === item.value 
              ? 'bg-primary border-primary' 
              : 'bg-white border-gray-200 shadow-sm shadow-gray-100'
          }`}
        >
          <Text
            className={`font-poppins-medium text-sm ${
              selectedCategory === item.value ? 'text-white' : 'text-gray-600'
            }`}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default FurnitureFilters;
