import FilterSheet from "@/components/FilterSheet";
import icons from "@/constants/icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
import { useDebouncedCallback } from "use-debounce";

const Search = () => {
  const params = useLocalSearchParams < { query?: string } > ();
  const [search, setSearch] = useState(params.query || "");
  const [filterOpen, setFilterOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback(
    (text: string) => router.setParams({ query: text }),
    500
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  return (
    <>
      <View className="flex flex-row justify-between items-center w-full px-4 rounded-xl bg-white border-2 border-gray-300 mt-5 py-3 shadow-sm shadow-gray-200">
        <View className="flex-1 flex flex-row items-center justify-start">
          <Image source={icons.search} className="size-6 mr-3" resizeMode="contain" tintColor="#9CA3AF" />
          <TextInput
            className="font-poppins text-gray-800 text-base flex-1"
            placeholder="Search for properties..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={handleSearch}
          />
        </View>

        <TouchableOpacity onPress={() => setFilterOpen(true)} className="pl-3 border-l border-gray-200">
          <Image source={icons.filter} className="size-6" resizeMode="contain" tintColor="#C9A24D" />
        </TouchableOpacity>
      </View>

      <FilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={(filters) => {
          // Example: push filters to router params
          router.setParams({
            type: filters.type || "",
            location: filters.location || "",
            minPrice: filters.minPrice || "",
            maxPrice: filters.maxPrice || "",
          });
          setFilterOpen(false);
        }}
      />
    </>
  );
};

export default Search;
