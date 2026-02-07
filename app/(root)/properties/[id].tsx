import { Property, getPropertyDetails } from "@/libs/endpoints/property";
import { createBooking } from "@/libs/endpoints/booking";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import icons from "@/constants/icons";
import images from "@/constants/images";
import BookingModal from "@/components/BookingModal";
import CustomAlert from "@/components/CustomAlert";


const Properties = () => {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [item, setItem] = useState < Property | null > (null);
  const [error, setError] = useState < string | null > (null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
  const property = item;

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError("No property ID provided");
        setLoading(false);
        return;
      }
      try {
        const propertyData = await getPropertyDetails(Number(id));
        setItem(propertyData);
      } catch (error) {
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBookNow = () => {
    setBookingModalVisible(true);
  };

  const handleConfirmBooking = async (checkIn: string, checkOut: string) => {
    if (!property) return;

    setBookingLoading(true);
    try {
      const response = await createBooking({
        property_id: property.id,
        check_in: checkIn,
        check_out: checkOut,
      });

      if (response.status === 'ok' || response.status === 'success') {
        setBookingModalVisible(false);
        
        showAlert(
          'Booking Successful',
          `Your booking has been created!\nBooking ID: ${response.data.booking_id}\nAmount: ₦${response.data.amount.toLocaleString()}`
        );

        // TODO: Navigate to payment or booking details
        // You can integrate payment here if needed
      } else {
        showAlert('Booking Failed', 'Unable to create booking. Please try again.');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An error occurred while creating your booking.';
      showAlert('Error', errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };




  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size="large" color="#C9A24D" />
        <Text className="mt-4 text-gray-600">Loading property...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className='flex-1 justify-center items-center bg-white px-5'>
        <Text className="text-red-500 text-lg font-bold mb-2">Error</Text>
        <Text className="text-gray-700 text-center">{error}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-primary px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!item) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <Text className="text-gray-700">Property not found</Text>
      </View>
    );
  }

  const propertyImages = property?.images || [property?.image];
  const amenitiesList = property?.amenities ? property.amenities.split(',').map(a => a.trim()) : [];


  const amenityIcons: { [key: string]: any } = {
    "Parking": icons.carPark,
    "Security": icons.security,
    "Balcony": icons.balcony,
    "CCTV": icons.cctv,
    "Internet": icons.wifi,
    "Air Conditioning": icons.airConditioning,
    "Generator": icons.generator,
    "Solar Power": icons.solarPower,
    "Borehole Water": icons.water,
    "Playground": icons.playground,
    "Pool": icons.swim,
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32 bg-white">
        <View className="relative w-full" style={{ height: windowHeight / 2.5 }}>
          {/* Image Carousel */}
          <FlatList
            data={propertyImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
              setCurrentImageIndex(index);
            }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={{ width: windowWidth, height: windowHeight / 2.5 }}
                resizeMode="cover"
              />
            )}
          />

          {/* Pagination Dots - with better visibility */}
          <View
            className="absolute bottom-10 w-full flex-row justify-center items-center gap-2 z-10"
            style={{
              paddingHorizontal: 20,
            }}
          >
            {propertyImages.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 8,
                  width: index === currentImageIndex ? 24 : 8,
                  borderRadius: 4,
                  backgroundColor: index === currentImageIndex ? '#C9A24D' : 'rgba(255, 255, 255, 0.5)',
                }}
              />
            ))}
          </View>

          <View className="z-50 absolute inset-x-7" style={{ top: Platform.OS === "ios" ? 70 : 50 }}>
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity onPress={() => router.back()} className="bg-white rounded-full size-11 items-center justify-center">
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <View className="flex flex-row items-center gap-3">
                <TouchableOpacity className="bg-white rounded-full size-11 items-center justify-center">
                  <Image source={icons.heart} className="size-6" tintColor={"#191D31"} />
                </TouchableOpacity>
                <TouchableOpacity className="bg-white rounded-full size-11 items-center justify-center">
                  <Image source={icons.send} className="size-6" tintColor={"#191D31"} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-t-3xl -mt-6 px-5 pt-6">
          <Text className="text-2xl font-rubik-extrabold text-black-300">
            {property?.title}
          </Text>

          <View className="flex flex-row items-center gap-2 mt-3">
            <View className="flex flex-row items-center px-3 py-1.5 bg-primary/10 rounded-md">
              <Text className="text-xs font-rubik-bold text-primary uppercase">
                {property?.type}
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center gap-8 mt-5">
            <View className="flex flex-row items-center gap-2">
              <View className="bg-primary/10 rounded-full size-9 items-center justify-center">
                <Image source={icons.bed} className="size-5" tintColor="#C9A24D" />
              </View>
              <Text className="text-black-300 text-sm font-rubik-medium">
                {property?.bedrooms} Beds
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2">
              <View className="bg-primary/10 rounded-full size-9 items-center justify-center">
                <Image source={icons.bath} className="size-5" tintColor="#C9A24D" />
              </View>
              <Text className="text-black-300 text-sm font-rubik-medium">
                {property?.bathrooms} Bath
              </Text>
            </View>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold mb-3">
              Overview
            </Text>
            <Text className="text-black-200 text-sm font-rubik leading-6">
              {property?.description || "Sleek, modern 2-bedroom apartment with open living space, high-end finishes, and city views. Minutes from downtown, dining, and transit."}
            </Text>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold mb-4">
              Facilities
            </Text>

            <View className="flex flex-row flex-wrap gap-4">
              {amenitiesList.slice(0, 8).map((amenity, index) => (
                <View key={index} className="flex flex-col items-center w-20">
                  <View className="size-14 bg-primary/10 rounded-2xl items-center justify-center">
                    <Image
                      source={amenityIcons[amenity] || icons.defaultIcon}
                      className="size-6"
                      tintColor="#C9A24D"
                    />
                  </View>
                  <Text
                    className="text-black-300 text-xs text-center font-rubik mt-2"
                    numberOfLines={2}
                  >
                    {amenity}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold mb-4">
              Gallery
            </Text>
            <FlatList
              data={propertyImages}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  className="w-32 h-32 rounded-2xl"
                  resizeMode="cover"
                />
              )}
            />
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold mb-4">
              Location
            </Text>
            <View className="flex flex-row items-start gap-2 mb-4">
              <Image source={icons.location} className="w-5 h-5 mt-1" tintColor="#C9A24D" />
              <Text className="text-black-200 text-sm font-rubik flex-1">
                {property?.location || "Grand City St. 100, New York, United States"}
              </Text>
            </View>
            <View className="h-48 w-full rounded-2xl overflow-hidden">
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: property?.latitude || 40.7128,
                  longitude: property?.longitude || -74.006,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: property?.latitude || 40.7128,
                    longitude: property?.longitude || -74.006,
                  }}
                  title={property?.title || "Property Location"}
                  description={property?.location}
                />
              </MapView>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bg-white bottom-0 w-full rounded-t-3xl border-t border-gray-200 px-7 py-5 shadow-2xl">
        <View className="flex flex-row items-center justify-between gap-4">
          <View className="flex flex-col">
            <Text className="text-black-200 text-xs font-rubik uppercase tracking-wider">
              Price
            </Text>
            <Text numberOfLines={1} className="text-primary text-2xl font-rubik-bold mt-1">
              ₦{property?.price}
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handleBookNow}
            className="flex-1 bg-primary py-4 rounded-full shadow-lg shadow-primary/30"
          >
            <Text className="text-white text-base text-center font-rubik-bold">
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Booking Modal */}
      <BookingModal
        visible={bookingModalVisible}
        onClose={() => setBookingModalVisible(false)}
        onConfirm={handleConfirmBooking}
        loading={bookingLoading}
        propertyPrice={property?.price || "0"}
        listingType={property?.listing_type}
      />

      {/* Alert */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  )
}

export default Properties;