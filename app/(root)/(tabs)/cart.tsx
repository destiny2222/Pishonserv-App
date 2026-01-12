import { View, Text, Image, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import { Link } from "expo-router";
import { FavoriteCard } from "@/components/Cards";
import { favorites } from "@/constants/data"; // ✅ named import

const Cart = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={favorites ?? []}
        renderItem={({ item }) => (
          <FavoriteCard
            item={item}
            onPress={() => console.log("Open favorite:", item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
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
