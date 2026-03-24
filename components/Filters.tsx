import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

// Map listing_type values to readable labels
const listingTypeLabels: Record<string, string> = {
  'for_sale': 'For Sale',
  'for_rent': 'For Rent',
  'short_let': 'Short Let',
  'hotel': 'Hotel',
  'project': 'Project',
  'land': 'Land',
};

const Filters = () => {
  const params = useLocalSearchParams<{filter?: string}>();
  const [selectedCategory, setSelectedCategory] = useState(params.filter || 'All');
  
  // Sync state with URL params
  React.useEffect(() => {
    if (params.filter) {
      setSelectedCategory(params.filter);
    } else {
      setSelectedCategory('All');
    }
  }, [params.filter]);
  
  // Use all listing types from the mapping
  const listingTypes = Object.keys(listingTypeLabels);

  const handleCategory = (category: string) => {
    if (category === 'All') {
      setSelectedCategory('All');
      router.setParams({ 
        filter: "All",
        type: "",
        location: "",
        minPrice: "",
        maxPrice: "",
        query: ""
      });
      return;
    }

    if (selectedCategory === category) {
      setSelectedCategory('All');
      router.setParams({ filter: "All" });
      return;
    }
    setSelectedCategory(category);
    router.setParams({ filter: category });
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mt-3 mb-2'>
      {/* All filter */}
      <TouchableOpacity 
        onPress={() => handleCategory('All')}
        className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full ${selectedCategory === 'All' ? 'bg-primary' : 'bg-[#E6D3A333] border border-[#E6D3A333]'}`}
      >
        <Text className={`${selectedCategory === 'All' ? 'text-white' : 'text-secondary'} font-poppins-medium`}>
          All
        </Text>
      </TouchableOpacity>

      {/* Listing type filters */}
      {listingTypes.map((listingType, index) => (
        <TouchableOpacity 
          key={index} 
          onPress={() => handleCategory(listingType)}
          className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full ${selectedCategory === listingType ? 'bg-primary' : 'bg-[#E6D3A333] border border-[#E6D3A333]'}`}
        >
          <Text className={`${selectedCategory === listingType ? 'text-white' : 'text-secondary'} font-poppins-medium`}>
            {listingTypeLabels[listingType] || listingType}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

export default Filters