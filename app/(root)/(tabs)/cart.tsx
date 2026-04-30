import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import { Link, router } from "expo-router";
import { FavoriteCard } from "@/components/Cards";
import { getWishlist, WishlistItem } from "@/libs/endpoints/wishlist";
import { useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Cart = () => {
  const [favorites, setFavorites] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
    }, [])
  );

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await getWishlist();
      setFavorites(response.data.items);
    } catch (error) {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-200 justify-center items-center">
        <ActivityIndicator size="large" color="#C9A24D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-200" edges={["top"]}>
      <StatusBar style="dark" />
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <FavoriteCard
            item={item}
            onPress={() =>  router.push(`/properties/${item.id}`)}
            onDelete={fetchWishlist}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListHeaderComponent={
          <View className="mt-6 mb-8 px-5">
            <Text className="text-secondary font-poppins-bold text-3xl">
              Your Favorites
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-32 px-5">
            <Image
              source={images.cart}
              className="w-32 h-32 mb-5"
              resizeMode="contain"
            />
            <Text className="text-[#6B7280] font-poppins-medium text-lg text-center">
              Your favorites is currently empty, visit{" "}
              <Link href="/home">home</Link>
              {"\n"}to add properties to favorites.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Cart;