import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons';
import images from '@/constants/images';
import AgentHeader from '@/components/AgentHeader';
import Watermarks from '@/components/Watermarks';

type Inquiry = {
  id: string;
  name: string;
  avatar: any;
  date: string;
  property: string;
  message: string;
};

const DATA: Inquiry[] = [
  {
    id: "1",
    name: "Mary Jay",
    avatar: images.avatar ?? { uri: "https://i.pravatar.cc/150?img=32" },
    date: "15 Dec. 2025 | 05:00PM",
    property: "Luxurious Family House",
    message: "I think I am interested in this prop...",
  },
  {
    id: "2",
    name: "Johnny Mba",
    avatar: images.avatar ?? { uri: "https://i.pravatar.cc/150?img=12" },
    date: "15 Dec. 2025 | 05:00PM",
    property: "Luxurious Family House",
    message: "I think I am interested in this prop...",
  },
  {
    id: "3",
    name: "Joan Sewa",
    avatar: images.avatar ?? { uri: "https://i.pravatar.cc/150?img=47" },
    date: "15 Dec. 2025 | 05:00PM",
    property: "Luxurious Family House",
    message: "I think I am interested in this prop...",
  },
];

const Inquiries = () => {
  const InquiryCard = ({ item }: { item: Inquiry }) => (
      <View className="bg-white rounded-2xl shadow-black/5 shadow-lg px-4 mx-5 py-5 mb-6 flex-row items-center">
        <Image source={item.avatar} className="w-14 h-14 rounded-full mr-4" />
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-secondary font-poppins-bold text-xl">{item.name}</Text>
            <Text className="text-gray-300 font-poppins text-xs">{item.date}</Text>
          </View>
  
          <View className="mt-3">
            <Text className="font-poppins text-black-300">
              <Text className="font-poppins-bold">Property:</Text> {item.property}
            </Text>
  
            <Text className="font-poppins text-black-300 mt-2">
              <Text className="font-poppins-bold">Message:</Text> {item.message}
            </Text>
          </View>
        </View>
  
        {/* Chat icon */}
        <TouchableOpacity
          onPress={() => console.log("open chat", item.id)}
          className="ml-3 w-12 h-12 rounded-full items-center justify-center"
        >
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#C9A24D" />
        </TouchableOpacity>
      </View>
    );
  return (
    <SafeAreaView>
        {/* <Watermarks showBottomLeft={true} showTopRight={false}/> */}
        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <InquiryCard item={item} />}
          contentContainerStyle={{  paddingTop: 12, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className=''>
              <AgentHeader />
              <View className="px-5 pt-8 pb-8">
                <Text className="text-secondary font-poppins-bold text-3xl">Property Inquiries</Text>
              </View>
            </View>
          }
        />
    </SafeAreaView>
  )
}

export default Inquiries