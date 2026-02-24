import { completePayment, createBooking, initializePayment } from "@/libs/endpoints/booking";
import { getPropertyDetails } from "@/libs/endpoints/property";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import BookingModal from "@/components/BookingModal";
import CustomAlert from "@/components/CustomAlert";
import PaymentWebView from "@/components/PaymentWebView";
import icons from "@/constants/icons";


import { useAuth } from "@/hooks/useAuth";

const Properties = () => {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { user } = useAuth();
  const [item, setItem] = useState < Property | null > (null);
  const [error, setError] = useState < string | null > (null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertAction, setAlertAction] = useState < (() => void) | null > (null);
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
  const [paymentUrl, setPaymentUrl] = useState("");


  const [paymentVisible, setPaymentVisible] = useState(false);
  // removed currentReference as it was unused
  const [bookingId, setBookingId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const property = item;

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const handleShare = async () => {
    if (!property) return;
    try {
      const propertyUrl = Linking.createURL(`/properties/${property.id}`);
      await Share.share({
        message: `Check out this property: ${property.title} in ${property.location} for ₦${property.price}!\n\nView here: ${propertyUrl}`,
        url: propertyUrl,
      });
    } catch (error: any) {
      // console.error(error.message);
    }
  };

  const showAlert = (title: string, message: string, action?: (() => void) | null) => {
    setAlertTitle(title);
    setAlertMessage(message);
    if (action) setAlertAction(() => action);
    setAlertVisible(true);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertAction) {
      alertAction();
      setAlertAction(null);
    }
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
      } catch (err) {
        // error state is tracked but unused in the UI, keeping the log for debug
        // console.error("Failed to load property details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      showAlert("Login Required", "You must be logged in to book a property.", () => {
        router.push("/(auth)/login");
      });
      return;
    }
    setBookingModalVisible(true);
  };

  const handleConfirmBooking = async (checkIn, checkOut) => {
    if (!property) return;

    setBookingLoading(true);
    try {
      const bookingResponse = await createBooking({
        property_id: property.id,
        check_in: checkIn,
        check_out: checkOut,
      });

      if (bookingResponse.status !== "ok") {
        showAlert("Booking Failed", "Unable to create booking. Please try again.");
        return;
      }

      setBookingId(bookingResponse.data.booking_id);

      const paymentResponse = await initializePayment({
        booking_id: bookingResponse.data.booking_id,
      });

      if (paymentResponse.status !== "ok") {
        showAlert("Payment Failed", "Unable to initialize payment. Please try again.");
        return;
      }
      // setCurrentReference(paymentResponse.data.reference); // Unused
      setPaymentUrl(paymentResponse.data.authorization_url);
      setBookingModalVisible(false);
      setPaymentVisible(true);
    } catch (err) {
      showAlert("Error", err?.message || "Something went wrong.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentSuccess = async (reference) => {
    setPaymentVisible(false);
    setLoading(true);

    if (!bookingId) {
      showAlert("Error", "Booking ID not found. Contact support.");
      setLoading(false);
      return;
    }

    try {
      const complete = await completePayment({
        booking_id: bookingId,
        reference
      });

      if (complete.data.success) {
        showAlert("Payment Successful 🎉", "Your booking has been confirmed!", () => {
          router.push('/(root)/(tabs)/home');
        });
      } else {
        showAlert("Payment Pending", "Your payment is being processed.");
      }
    } catch (_err) {
      showAlert("Verification Failed", "Could not verify payment. Contact support.");
    } finally {
      setLoading(false);
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

  const propertyImages = (property?.images && property.images.length > 0)
    ? property.images
    : (property?.image ? [property.image] : []);

  const amenitiesList = Array.isArray(property?.amenities)
    ? property.amenities
    : typeof property?.amenities === "string"
      ? property.amenities.split(',').map(a => a.trim())
      : [];

  const mapLat = property?.latitude ? Number(property.latitude) : 40.7128;
  const mapLng = property?.longitude ? Number(property.longitude) : -74.006;

  const amenityIcons = {
    "Parking": icons.carPark,
    "Security": icons.security,
    "Balcony": icons.balcony,
    "CCTV": icons.cctv,
    "Internet": icons.wifi,
    "Air Conditioning": icons.airConditioning,
    "Generator": icons.generator,
    "Solar Power": icons.solarPower,
    "Borehole Water": icons.bath,
    "Playground": icons.run,
    "Pool": icons.swim,
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120, backgroundColor: 'white' }}
      >
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
                <TouchableOpacity
                  onPress={toggleFavorite}
                  className="bg-white rounded-full size-11 items-center justify-center"
                >
                  <Image
                    source={icons.heart}
                    className="size-6"
                    tintColor={isFavorite ? "#e34040" : "#191D31"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleShare}
                  className="bg-white rounded-full size-11 items-center justify-center"
                >
                  <Image
                    source={icons.send}
                    className="size-6"
                    tintColor={"#191D31"}
                  />
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
                      source={amenityIcons[amenity as keyof typeof amenityIcons] || icons.info}
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
              <View style={styles.container}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: mapLat,
                    longitude: mapLng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: mapLat,
                      longitude: mapLng,
                    }}
                    title={property?.title || "Property Location"}
                    description={property?.location}
                  />
                </MapView>
              </View>
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
        onClose={handleAlertClose}
      />

      <PaymentWebView
        visible={paymentVisible}
        authorizationUrl={paymentUrl}
        onSuccess={handlePaymentSuccess}
        onClose={() => setPaymentVisible(false)}
      />
    </View >
  )
}

export default Properties;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});