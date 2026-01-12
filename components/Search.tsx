import { View, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import icons from "@/constants/icons";
import { useDebouncedCallback } from "use-debounce";
import FilterSheet from "@/components/FilterSheet";

const Search = () => {
  const params = useLocalSearchParams<{ query?: string }>();
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
      <View className="flex flex-row justify-between items-center w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2">
        <View className="flex-1 flex flex-row items-center justify-start">
          <Image source={icons.search} className="size-5 mr-2" resizeMode="contain" />
          <TextInput
            className="font-poppins text-black-300 text-sm flex-1"
            placeholder="Search for properties"
            value={search}
            onChangeText={handleSearch}
          />
        </View>

        <TouchableOpacity onPress={() => setFilterOpen(true)}>
          <Image source={icons.filter} className="size-5" resizeMode="contain" />
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
