import { BookingMobileDisabledResponse, completePayment, createBooking, createInspection, createWhatsAppInquiry, initializePayment, requiresInspection, supportsDirectBooking } from "@/libs/endpoints/booking";
import { ApiError } from "@/libs/api/clients";
import { getPropertyDetails, Property } from "@/libs/endpoints/property";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import BookingModal from "@/components/BookingModal";
import CustomAlert from "@/components/CustomAlert";
import InspectionModal from "@/components/InspectionModal";
import PaymentWebView from "@/components/PaymentWebView";
import icons from "@/constants/icons";
import { useAuth } from "@/hooks/useAuth";
import Ionicons from "@expo/vector-icons/Ionicons";
import MapView, { Marker } from 'react-native-maps';
import { WebView } from 'react-native-webview';
import { StatusBar } from "expo-status-bar";

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
  const [alertCancelAction, setAlertCancelAction] = useState < (() => void) | null > (null);
  const [alertCancelText, setAlertCancelText] = useState("");
  const [alertConfirmText, setAlertConfirmText] = useState("");
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
  const [paymentUrl, setPaymentUrl] = useState("");
  const [inspectionModalVisible, setInspectionModalVisible] = useState(false);
  const [inspectionLoading, setInspectionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [paymentVisible, setPaymentVisible] = useState(false);
  // removed currentReference as it was unused
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingBreakdown, setBookingBreakdown] = useState<{
    propertyCharge: number;
    cautionFee: number;
    totalPayable: number;
  } | null>(null);

  const property = item;

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const handleShare = async () => {
    if (!property || !property?.id) return;
    try {
      const propertyUrl = Linking.createURL(`/properties/${property.id}`);
      const displayAmount = property.headline_amount ?? property.total_payable ?? property.price;
      const formatted = Number(displayAmount).toLocaleString();
      const labelText = property.headline_label ? ` (${property.headline_label})` : "";
      await Share.share({
        message: `Check out this property: ${property.title} in ${property.location} for ₦${formatted}${labelText}!\n\nView here: ${propertyUrl}`,
        url: propertyUrl,
      });
    } catch {
      // error state is tracked but unused in the UI, keeping the log for debug
    }
  };

  const showAlert = (
    title: string, 
    message: string, 
    action?: (() => void) | null,
    cancelAction?: (() => void) | null,
    confirmText?: string,
    cancelText?: string
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertAction(action ? () => action : null);
    setAlertCancelAction(cancelAction ? () => cancelAction : null);
    setAlertConfirmText(confirmText || "OK");
    setAlertCancelText(cancelText || "Cancel");
    setAlertVisible(true);
  };

  const handleAlertCancel = () => {
    setAlertVisible(false);
    if (alertCancelAction) {
      alertCancelAction();
      setAlertCancelAction(null);
    }
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
      } catch {
        // error state is tracked but unused in the UI, keeping the log for debug
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleRefresh = async () => {
    if (!id) return;
    setRefreshing(true);
    try {
      const propertyData = await getPropertyDetails(Number(id));
      setItem(propertyData);
      setError(null);
    } catch {
      setError("Unable to refresh property details.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleBookNow = async () => {
    if (!user) {
      showAlert("Login Required", "You must be logged in to book a property.", () => {
        router.push("/(auth)/login");
      });
      return;
    }

    if (!property) {
      showAlert("Error", "Property information not available.");
      return;
    }

    // 1. WhatsApp flow for short_let/hotel (now shows modal first)
    if (!supportsDirectBooking(property.listing_type)) {
      setBookingModalVisible(true);
      return;
    }

    // 2. Inspection flow for for_sale/for_rent/land if flag is set
    if (requiresInspection(property.requires_inspection, property.listing_type)) {
      setInspectionModalVisible(true);
      return;
    }

    // 3. Direct booking flow
    setBookingModalVisible(true);
  };

  const handleConfirmBooking = async (checkIn: string, checkOut: string) => {
    if (!property || !property?.id) {
      showAlert("Error", "Property information not available.");
      return;
    }

    setBookingLoading(true);
    try {
      // Check if this is a direct booking or a WhatsApp inquiry
      if (!supportsDirectBooking(property.listing_type)) {
        // WhatsApp Inquiry Path
        const whatsappResponse = await createWhatsAppInquiry(property.id, checkIn, checkOut);
        
        if (whatsappResponse.status === "ok" && whatsappResponse.data.whatsapp_inquiry_url) {
          setBookingModalVisible(false);
          showAlert(
            "Redirecting to WhatsApp",
            "You will be redirected to WhatsApp to complete your inquiry with the selected dates.",
            () => Linking.openURL(whatsappResponse.data.whatsapp_inquiry_url),
            () => {},
            "Continue",
            "Cancel"
          );
        } else {
          showAlert("Error", "Unable to generate WhatsApp inquiry link. Please try again.");
        }
        return;
      }

      // Calculate breakdown for receipt display
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const nights = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
      const pricePerNight = parseFloat(String(property.price).replace(/[^0-9.-]+/g, ''));
      const propCharge = pricePerNight * nights;
      const cautionAmt = property.caution_fee ? parseFloat(String(property.caution_fee).replace(/[^0-9.-]+/g, '')) : 0;
      const totalPayable = propCharge + cautionAmt;
      setBookingBreakdown({
        propertyCharge: propCharge,
        cautionFee: cautionAmt,
        totalPayable
      });

      // Direct Booking Path (Existing logic)
      const bookingResponse = await createBooking({
        property_id: property.id,
        check_in: checkIn,
        check_out: checkOut,
      });

      if (bookingResponse.status !== "ok") {
        showAlert("Booking Failed", "Unable to create booking. Please try again.");
        setBookingLoading(false);
        return;
      }

      setBookingId(bookingResponse.data.booking_id);

      const paymentResponse = await initializePayment({
        booking_id: bookingResponse.data.booking_id,
      });

      if (paymentResponse.status !== "ok") {
        showAlert("Payment Failed", "Unable to initialize payment. Please try again.");
        setBookingLoading(false);
        return;
      }

      if (!paymentResponse.data.authorization_url) {
        showAlert("Error", "Invalid payment URL received. Please contact support.");
        setBookingLoading(false);
        return;
      }

      setPaymentUrl(paymentResponse.data.authorization_url);
      setBookingModalVisible(false);
      setPaymentVisible(true);
    } catch (err: any) {
      // Handle "Direct Booking Disabled" 403 error
      if (err instanceof ApiError && err.status === 403) {
        const data = err.data as BookingMobileDisabledResponse;
        if (data && data.whatsapp_inquiry_url) {
          setBookingModalVisible(false);
          showAlert(
            "Booking via WhatsApp",
            data.error || "Direct booking is currently disabled for mobile. Please continue via WhatsApp inquiry.",
            () => Linking.openURL(data.whatsapp_inquiry_url),
            () => {},
            "Continue",
            "Cancel"
          );
          setBookingLoading(false);
          return;
        }
      }

      const errorMessage = err?.message || "Something went wrong. Please try again.";
      showAlert("Booking Error", errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleConfirmInspection = async (data: any) => {
    if (!property || !property.id) return;

    setInspectionLoading(true);
    try {
      const response = await createInspection({
        property_id: property.id,
        ...data,
      });

      if (response.status === "ok") {
        setInspectionModalVisible(false);
        showAlert(
          "Inspection Booked",
          `Your inspection request has been received. Your code is: ${response.data.inspection_code}. We will contact you soon.`,
          () => router.push('/(root)/(tabs)/home')
        );
      } else {
        showAlert("Error", "Failed to book inspection. Please try again.");
      }
    } catch (err: any) {
      showAlert("Inspection Booking Failed", err?.message || "An error occurred while booking the inspection.");
    } finally {
      setInspectionLoading(false);
    }
  };

  const handlePaymentSuccess = async (reference: string) => {
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
        const breakdownText = bookingBreakdown 
          ? `\n\nProperty Charge: ₦${bookingBreakdown.propertyCharge.toLocaleString()}\nRefundable Caution Fee: ₦${bookingBreakdown.cautionFee.toLocaleString()}\nTotal Paid: ₦${bookingBreakdown.totalPayable.toLocaleString()}\n\nYour branded Pishonserv receipt has been generated!`
          : "";
        showAlert("Payment Successful 🎉", `Your booking has been confirmed!${breakdownText}`, () => {
          router.push('/(root)/(tabs)/home');
        });
      } else {
        showAlert("Payment Pending", "Your payment is being processed.");
      }
    } catch (err: any) {
      showAlert("Verification Failed", err?.message || "Could not verify payment. Contact support.");
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
    : typeof (property?.amenities as any) === "string"
      ? (property?.amenities as unknown as string).split(',').map((a: string) => a.trim())
      : [];

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
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120, backgroundColor: 'white' }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#C9A24D"]} tintColor="#C9A24D" />}
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
              {amenitiesList.slice(0, 8).map((amenity: string, index: number) => (
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

          {property?.youtube_video_embed_url && (
            <View className="mt-7">
              <Text className="text-black-300 text-xl font-rubik-bold mb-4">
                Video Tour
              </Text>
              <View className="h-48 w-full rounded-2xl overflow-hidden mt-4">
                <WebView
                  source={{ uri: property.youtube_video_embed_url }}
                  style={{ flex: 1 }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowsFullscreenVideo={true}
                />
              </View>
            </View>
          )}

          {/* Payment Breakdown */}
          {(property?.payment_breakdown || property?.headline_amount || property?.total_payable) && (
            <View className="mt-7">
              <View className="flex flex-row items-center justify-between mb-3">
                <Text className="text-black-300 text-xl font-rubik-bold">
                  Payment Breakdown
                </Text>
                {property?.listing_type && (
                  <View className="bg-primary/10 px-3 py-1 rounded-full">
                    <Text className="text-primary text-xs font-rubik-bold uppercase">
                      {property.listing_type.replace('_', ' ')}
                    </Text>
                  </View>
                )}
              </View>

              <View className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                {/* Listed Property Price */}
                <View className="flex flex-row items-center justify-between py-2 border-b border-slate-200/60">
                  <Text className="text-gray-600 text-sm font-rubik">
                    {property?.listing_type === 'short_let' || property?.listing_type === 'hotel'
                      ? 'Nightly Rate'
                      : 'Listed Property Price'}
                  </Text>
                  <Text className="text-black-300 text-sm font-rubik-medium">
                    ₦{Number(property?.payment_breakdown?.listed_property_price ?? property?.price ?? 0).toLocaleString()}
                  </Text>
                </View>

                {/* Agent Fee (if present and > 0) */}
                {Boolean(property?.payment_breakdown?.agent_fee && Number(property.payment_breakdown.agent_fee) > 0) && (
                  <View className="flex flex-row items-center justify-between py-2 border-b border-slate-200/60">
                    <Text className="text-gray-600 text-sm font-rubik">Agent Fee</Text>
                    <Text className="text-black-300 text-sm font-rubik-medium">
                      ₦{Number(property.payment_breakdown!.agent_fee).toLocaleString()}
                    </Text>
                  </View>
                )}

                {/* Legal Fee (if present and > 0) */}
                {Boolean(property?.payment_breakdown?.legal_fee && Number(property.payment_breakdown.legal_fee) > 0) && (
                  <View className="flex flex-row items-center justify-between py-2 border-b border-slate-200/60">
                    <Text className="text-gray-600 text-sm font-rubik">Legal Fee</Text>
                    <Text className="text-black-300 text-sm font-rubik-medium">
                      ₦{Number(property.payment_breakdown!.legal_fee).toLocaleString()}
                    </Text>
                  </View>
                )}

                {/* Caution Fee (if present and > 0) */}
                {Boolean(
                  (property?.payment_breakdown?.caution_fee && Number(property.payment_breakdown.caution_fee) > 0) ||
                  (property?.payment_breakdown?.refundable_caution_fee && Number(property.payment_breakdown.refundable_caution_fee) > 0) ||
                  (property?.caution_fee && Number(property.caution_fee) > 0)
                ) && (
                  <View className="flex flex-row items-center justify-between py-2 border-b border-slate-200/60">
                    <View className="flex flex-row items-center gap-1.5">
                      <Text className="text-gray-600 text-sm font-rubik">Caution Fee</Text>
                      <View className="bg-emerald-100 px-1.5 py-0.5 rounded">
                        <Text className="text-[10px] font-rubik-medium text-emerald-700">Refundable</Text>
                      </View>
                    </View>
                    <Text className="text-black-300 text-sm font-rubik-medium">
                      ₦{Number(
                        property?.payment_breakdown?.refundable_caution_fee ??
                        property?.payment_breakdown?.caution_fee ??
                        property?.caution_fee ??
                        0
                      ).toLocaleString()}
                    </Text>
                  </View>
                )}

                {/* Service Charge (if present) */}
                {(property?.payment_breakdown?.service_charge !== undefined || property?.payment_breakdown?.service_charge_label) && (
                  <View className="flex flex-row items-center justify-between py-2 border-b border-slate-200/60">
                    <Text className="text-gray-600 text-sm font-rubik">Service Charge</Text>
                    <Text className="text-black-300 text-sm font-rubik-medium">
                      {property?.payment_breakdown?.service_charge && Number(property.payment_breakdown.service_charge) > 0
                        ? `₦${Number(property.payment_breakdown.service_charge).toLocaleString()}`
                        : (property?.payment_breakdown?.service_charge_label || 'To be determined')}
                    </Text>
                  </View>
                )}

                {/* Total Payable Row */}
                <View className="flex flex-row items-center justify-between pt-3 mt-1">
                  <View className="flex-1 mr-2">
                    <Text className="text-black-300 text-sm font-rubik-bold">
                      {property?.payment_breakdown?.total_label || property?.headline_label || 'Total Payable'}
                    </Text>
                    <Text className="text-[11px] text-gray-500 font-rubik">
                      {property?.listing_type === 'for_rent' || property?.listing_type === 'for_sale'
                        ? 'Includes price, fees & refundable caution'
                        : 'Public payable amount'}
                    </Text>
                  </View>
                  <Text className="text-primary text-xl font-rubik-bold">
                    ₦{Number(
                      property?.payment_breakdown?.total_payable ??
                      property?.headline_amount ??
                      property?.total_payable ??
                      property?.price ??
                      0
                    ).toLocaleString()}
                  </Text>
                </View>

                {/* Secure Offline Payment / Escrow notice for Rent/Sale */}
                {(property?.listing_type === 'for_rent' || property?.listing_type === 'for_sale') && (
                  <View className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-row items-start gap-1.5">
                    <Ionicons name="shield-checkmark" size={15} color="#C9A24D" style={{ marginTop: 1 }} />
                    <Text className="text-[11px] text-gray-500 font-rubik flex-1 leading-4">
                      Rent and sale payments are handled securely and offline with Pishonserv. Caution fees are held in escrow and refundable.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

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
            <View className="h-48 w-full rounded-2xl overflow-hidden mt-4">
              {property?.latitude && property?.longitude ? (
                <MapView
                  style={{ width: '100%', height: '100%' }}
                  initialRegion={{
                    latitude: Number(property.latitude),
                    longitude: Number(property.longitude),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: Number(property.latitude),
                      longitude: Number(property.longitude),
                    }}
                    title={property.title}
                    description={property.location}
                  />
                </MapView>
              ) : (
                <View style={[styles.container, { backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }]}>
                  <View className="flex-1 items-center justify-center p-4">
                    <Image source={icons.location} className="size-10 mb-2 opacity-50" tintColor="#C9A24D" />
                    <Text className="text-gray-500 font-poppins text-center text-sm">
                      Location view unavailable
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bg-white bottom-0 w-full rounded-t-3xl border-t border-gray-200 px-7 py-5 shadow-2xl">
        <View className="flex flex-row items-center justify-between gap-4">
          <View className="flex flex-col flex-1 mr-2">
            <Text className="text-black-200 text-xs font-rubik uppercase tracking-wider" numberOfLines={1}>
              {property?.headline_label || (property?.listing_type === 'short_let' || property?.listing_type === 'hotel' ? 'Nightly Rate' : 'Price')}
            </Text>
            <Text numberOfLines={1} className="text-primary text-2xl font-rubik-bold mt-1">
              ₦{Number(property?.headline_amount ?? property?.total_payable ?? property?.price ?? 0).toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleBookNow}
            className="flex-1 bg-primary py-4 rounded-full shadow-lg shadow-primary/30"
          >
            <Text className="text-white text-base text-center font-rubik-bold">
              {property?.requires_inspection ? 'Book Inspection' : 'Book Now'}
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
        propertyPrice={property?.headline_amount ? String(property.headline_amount) : (property?.price ? String(property.price) : "0")}
        listingType={property?.listing_type}
        cautionFee={property?.caution_fee}
      />

      <InspectionModal
        visible={inspectionModalVisible}
        onClose={() => setInspectionModalVisible(false)}
        onConfirm={handleConfirmInspection}
        loading={inspectionLoading}
      />

      {/* Alert */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={handleAlertClose}
        onCancel={alertCancelAction ? handleAlertCancel : undefined}
        confirmText={alertConfirmText}
        cancelText={alertCancelText}
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
});