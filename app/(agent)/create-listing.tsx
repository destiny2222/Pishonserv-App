import CustomAlert from "@/components/CustomAlert";
import TopHeader from "@/components/TopHeader";
import { createListing, CreateListingData, ListingType } from "@/libs/endpoints/agent/createListing";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Image, Modal, Platform, Pressable, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Option = { label: string; value: string };

const LISTING_TYPES: Option[] = [
    { label: "Rent", value: "for_rent" },
    { label: "Sale", value: "for_sale" },
    { label: "Short Let", value: "short_let" },
    { label: "Hotel", value: "hotel" },
];

const PROPERTY_TYPES: Option[] = [
    { label: "Apartment", value: "Apartment" },
    { label: "Serviced Apartment", value: "Serviced Apartment" },
    { label: "House", value: "House" },
    { label: "Villa", value: "Villa" },
    { label: "Duplex", value: "Duplex" },
    { label: "Hotel", value: "Hotel" },
    { label: "Boutique Hotel", value: "Boutique Hotel" },
    { label: "Studio", value: "Studio" },
    { label: "Guest House", value: "Guest House" },
    { label: "Short Stay", value: "Short Stay" },
    { label: "Resort", value: "Resort" },
];

const FURNISHING: Option[] = [
    { label: "Fully Furnished", value: "fully_furnished" },
    { label: "Semi Furnished", value: "semi_furnished" },
    { label: "Not Furnished", value: "not_furnished" },
];

const CONDITIONS: Option[] = [
    { label: "New", value: "new" },
    { label: "Recently Renovated", value: "renovated" },
    { label: "Used", value: "used" },
];

const SIZE_OPTIONS: Option[] = [
    { label: "Small", value: "small" },
    { label: "Standard", value: "standard" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
];

const AMENITIES = [
    "Pool",
    "Gym",
    "Parking",
    "Security",
    "Garden",
    "Elevator",
    "Balcony",
    "CCTV",
    "Internet",
    "Air Conditioning",
    "Washer/Dryer",
    "Fireplace",
    "Generator",
    "Solar power",
    "Borehole water",
    "Playground",
    "Clubhouse",
    "Tennis Court",
    "Sauna",
    "Restaurant",
    "Room Service",
    "24/7 Reception",
    "Housekeeping",
    "Breakfast",
    "Airport Shuttle",
];

function Label({ children }: { children: React.ReactNode }) {
    return <Text className="text-secondary font-poppins-semibold text-sm mb-2">{children}</Text>;
}

function Input(props: any) {
    return (
        <TextInput
            {...props}
            className={`border border-gray-200 rounded-xl px-4 py-4 text-secondary font-poppins bg-gray-50 ${props.className ?? ""}`}
            placeholderTextColor="#9CA3AF"
        />
    );
}

function Select({
    label,
    value,
    placeholder,
    options,
    onChange,
}: {
    label: string;
    value: string;
    placeholder: string;
    options: Option[];
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const currentLabel = useMemo(
        () => options.find((o) => o.value === value)?.label,
        [value, options]
    );

    return (
        <View className="mb-6">
            <Label>{label}</Label>

            <TouchableOpacity
                onPress={() => setOpen(true)}
                activeOpacity={0.9}
                className="border border-gray-200 rounded-xl px-4 py-4 flex-row items-center justify-between bg-gray-50"
            >
                <Text className={`font-poppins ${value ? "text-secondary" : "text-gray-500"}`}>
                    {currentLabel || placeholder}
                </Text>
                <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
                    <Ionicons name="chevron-down" size={17} color="#0D3B66" />
                </View>
            </TouchableOpacity>

            <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
                <Pressable className="flex-1 bg-black/25 justify-end" onPress={() => setOpen(false)}>
                    <Pressable className="bg-white rounded-t-3xl px-6 pt-5 pb-8">
                        <View className="w-12 h-1 rounded-full bg-gray-200 self-center mb-5" />
                        <Text className="font-poppins-bold text-xl text-secondary mb-4">{label}</Text>

                        {options.map((opt) => {
                            const selected = opt.value === value;
                            return (
                                <TouchableOpacity
                                    key={opt.value}
                                    onPress={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                    }}
                                    className={`py-4 px-3 rounded-xl mb-1 flex-row items-center justify-between ${selected ? "bg-amber-50" : ""}`}
                                >
                                    <Text className="font-poppins text-secondary">{opt.label}</Text>
                                    {selected ? <Ionicons name="checkmark" size={20} color="#C9A24D" /> : null}
                                </TouchableOpacity>
                            );
                        })}
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

function CheckItem({
    label,
    checked,
    onToggle,
}: {
    label: string;
    checked: boolean;
    onToggle: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onToggle}
            activeOpacity={0.8}
            className={`w-[48%] flex-row items-center mb-3 px-3 py-3 rounded-xl border ${checked ? "bg-amber-50 border-primary" : "bg-gray-50 border-gray-200"}`}
        >
            <View className={`w-5 h-5 rounded-md border mr-2 items-center justify-center ${checked ? "bg-primary border-primary" : "border-gray-300 bg-white"}`}  >
                {checked ? <Ionicons name="checkmark" size={14} color="white" /> : null}
            </View>
            <Text className="font-poppins text-secondary text-xs flex-1">{label}</Text>
        </TouchableOpacity>
    );
}

export default function CreateListing() {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [listingType, setListingType] = useState("");
    const [price, setPrice] = useState("");
    const [agentFee, setAgentFee] = useState("");
    const [legalFee, setLegalFee] = useState("");
    const [legalFeeCustom, setLegalFeeCustom] = useState(false);
    const [cautionFee, setCautionFee] = useState("");
    const [serviceCharge, setServiceCharge] = useState("");
    const [size, setSize] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [furnishing, setFurnishing] = useState("");
    const [condition, setCondition] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [parkingSpace, setParkingSpace] = useState("");
    const [description, setDescription] = useState("");
    const [youtubeVideoUrl, setYoutubeVideoUrl] = useState("");
    const [confirmedPricingRule, setConfirmedPricingRule] = useState(false);

    const [amenities, setAmenities] = useState < string[] > ([]);
    const [imagesPicked, setImagesPicked] = useState < ImagePicker.ImagePickerAsset[] > ([]);
    const [utilityBill, setUtilityBill] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Custom Alert State
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertOnClose, setAlertOnClose] = useState < (() => void) | undefined > (undefined);

    const showAlert = (title: string, message: string, onClose?: () => void) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertOnClose(() => onClose);
        setAlertVisible(true);
    };

    const closeAlert = () => {
        setAlertVisible(false);
        if (alertOnClose) {
            alertOnClose();
            setAlertOnClose(undefined);
        }
    };

    const toggleAmenity = (name: string) => {
        setAmenities((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
    };

    const handleListingTypeChange = (value: string) => {
        setListingType(value);
        if (value === "hotel" && !["Hotel", "Boutique Hotel", "Guest House", "Resort"].includes(propertyType)) {
            setPropertyType("Hotel");
        }
    };

    const isStayListing = listingType === "hotel" || listingType === "short_let";

    // Pricing rule calculations
    const numericPrice = useMemo(() => {
        return Number(price.replace(/[^0-9.]/g, "")) || 0;
    }, [price]);

    const defaultLegalFee = useMemo(() => {
        return Math.round(numericPrice * 0.10);
    }, [numericPrice]);

    const activeLegalFee = useMemo(() => {
        if (legalFeeCustom) {
            return Number(legalFee.replace(/[^0-9.]/g, "")) || 0;
        }
        return defaultLegalFee;
    }, [legalFeeCustom, legalFee, defaultLegalFee]);

    const numericAgentFee = useMemo(() => {
        return Number(agentFee.replace(/[^0-9.]/g, "")) || 0;
    }, [agentFee]);

    const numericCautionFee = useMemo(() => {
        return listingType === "for_rent" ? (Number(cautionFee.replace(/[^0-9.]/g, "")) || 0) : 0;
    }, [cautionFee, listingType]);

    const numericServiceCharge = useMemo(() => {
        return listingType === "for_rent" ? (Number(serviceCharge.replace(/[^0-9.]/g, "")) || 0) : 0;
    }, [serviceCharge, listingType]);

    const calculatedTotal = useMemo(() => {
        return numericPrice + activeLegalFee + numericAgentFee + numericCautionFee + numericServiceCharge;
    }, [numericPrice, activeLegalFee, numericAgentFee, numericCautionFee, numericServiceCharge]);

    const resetForm = () => {
        setTitle("");
        setLocation("");
        setListingType("");
        setPrice("");
        setAgentFee("");
        setLegalFee("");
        setLegalFeeCustom(false);
        setCautionFee("");
        setServiceCharge("");
        setSize("");
        setPropertyType("");
        setFurnishing("");
        setCondition("");
        setBedrooms("");
        setBathrooms("");
        setParkingSpace("");
        setDescription("");
        setYoutubeVideoUrl("");
        setAmenities([]);
        setImagesPicked([]);
        setUtilityBill(null);
        setAlertVisible(false);
        setAlertOnClose(undefined);
        setConfirmedPricingRule(false);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        resetForm();
        await new Promise((resolve) => setTimeout(resolve, 400));
        setRefreshing(false);
    };

    const pickImages = async () => {
        if (imagesPicked.length >= 7) return;

        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
            showAlert("Permission Required", "Please allow access to your photos to upload images.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.5,
            allowsMultipleSelection: Platform.OS === "ios",
            selectionLimit: 7 - imagesPicked.length,
            base64: true,
        });

        if (result.canceled) return;

        setImagesPicked((prev) => [...prev, ...result.assets].slice(0, 7));
    };

    const pickUtilityBill = async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
            showAlert("Permission Required", "Please allow access to your photos to upload the utility bill.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.7,
            allowsMultipleSelection: false,
            base64: true,
        });

        if (result.canceled) return;
        setUtilityBill(result.assets[0]);
    };

    const removePicked = (uri: string) => {
        setImagesPicked((prev) => prev.filter((x) => x.uri !== uri));
    };

    const submit = async () => {
        if (!title || !price || !location || !listingType || !description) {
            showAlert("Missing Fields", "Please fill in all required fields (Title, Location, Listing Type, Price, Description)");
            return;
        }

        if ((listingType === "for_rent" || listingType === "for_sale") && !confirmedPricingRule) {
            showAlert("Pricing Rule Confirmation Required", "Please review and confirm the offline pricing rule acknowledgment before publishing your listing.");
            return;
        }

        if (imagesPicked.length === 0) {
            showAlert("No Images", "Please upload at least one property image.");
            return;
        }

        if (!utilityBill) {
            showAlert("Utility Bill Required", "Please upload a utility bill or proof of address/ownership document.");
            return;
        }

        setLoading(true);

        try {
            const imageBase64s = imagesPicked.map(asset =>
                `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`
            );

            const payload: CreateListingData = {
                title,
                location,
                listing_type: listingType as ListingType,
                price: numericPrice,
                description,
                type: propertyType || undefined,
                amenities,
                ...(bedrooms ? { bedrooms: Number(bedrooms) } : {}),
                ...(bathrooms ? { bathrooms: Number(bathrooms) } : {}),
                ...(parkingSpace ? { garage: Number(parkingSpace), parking_space: Number(parkingSpace) } : {}),
                ...(size ? { size } : {}),
                ...(numericAgentFee > 0 ? { agent_fee: numericAgentFee } : {}),
                ...(listingType === "for_rent" || listingType === "for_sale" ? { legal_fee: activeLegalFee } : {}),
                ...(listingType === "for_rent" && numericCautionFee > 0 ? { caution_fee: numericCautionFee } : {}),
                ...(listingType === "for_rent" && numericServiceCharge > 0 ? { service_charge: numericServiceCharge } : {}),
                images: imageBase64s,
                ...(youtubeVideoUrl ? { youtube_video_url: youtubeVideoUrl } : {}),
                utility_bill: `data:${utilityBill!.mimeType ?? 'image/jpeg'};base64,${utilityBill!.base64}`,
            };

            const response: any = await createListing(payload);

            if (response.status === 'success' || response.status === 'ok' || response.success) {
                showAlert("Success", "Property created successfully!", () => router.replace("/listing"));
            } else {
                showAlert("Error", (response as any).message || "Failed to create listing.");
            }

        } catch (error: any) {
            if (error.status === 400 && error.data) {
                showAlert("Validation Error", error.data.message || "Please check your inputs.");
            } else {
                const msg = error?.data?.message || error?.message || "An unknown error occurred.";
                showAlert("Error", msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F6F7FB]">
            <View className="bg-white px-4 pt-5 pb-5 rounded-b-3xl">
                <TopHeader title="Create Listings" />
                <View className="flex-row items-center mt-3 px-1">
                    <View className="w-10 h-10 rounded-xl bg-amber-50 items-center justify-center mr-3">
                        <Ionicons name="home-outline" size={21} color="#C9A24D" />
                    </View>
                    <View className="flex-1">
                        <Text className="font-poppins-semibold text-secondary">Showcase your property</Text>
                        <Text className="font-poppins text-xs text-gray-500 mt-0.5">Add clear details to attract the right guests or buyers.</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#C9A24D"]} tintColor="#C9A24D" />
                }
            >
                <View className="px-5 mt-6">
                    <Text className="font-poppins-bold text-lg text-secondary mb-1">Basic information</Text>
                    <Text className="font-poppins text-xs text-gray-500 mb-5">Tell us what you’re listing and where it is located.</Text>

                    <View className="mb-5">
                        <Label>Title</Label>
                        <Input placeholder="e.g. Luxurious apartment" value={title} onChangeText={setTitle} />
                    </View>

                    <View className="mb-5">
                        <Label>Location</Label>
                        <Input placeholder="Enter location" value={location} onChangeText={setLocation} />
                    </View>

                    <Select label="Listing type" value={listingType} placeholder="Choose rent, sale, short let, or hotel" options={LISTING_TYPES} onChange={handleListingTypeChange} />

                    {/* Pricing Rule Confirmation Banner */}
                    {(listingType === "for_rent" || listingType === "for_sale") && (
                        <View className="mb-5 bg-amber-50/80 border border-primary/40 rounded-2xl p-4">
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="shield-checkmark" size={20} color="#C9A24D" />
                                <Text className="font-poppins-semibold text-secondary text-sm ml-2">
                                    {listingType === "for_rent" ? "Rent" : "Sale"} Pricing Rules
                                </Text>
                            </View>
                            <Text className="font-poppins text-xs text-gray-600 leading-5">
                                • Payments are handled offline by Pishonserv.{"\n"}
                                • Platform commission is ₦0 (no commission added).{"\n"}
                                • Legal fee is set to 10% by default and can be edited below.{"\n"}
                                {listingType === "for_rent"
                                    ? "• Caution fee is held in escrow and refundable.\n• Service charge is optional (shows 'To be determined' if left blank)."
                                    : "• Caution fee is not applicable for sale properties."}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setConfirmedPricingRule(!confirmedPricingRule)}
                                activeOpacity={0.8}
                                className="flex-row items-center mt-3 pt-2.5 border-t border-amber-200/60"
                            >
                                <View
                                    className={`w-5 h-5 rounded-md border mr-2.5 items-center justify-center ${
                                        confirmedPricingRule ? "bg-primary border-primary" : "border-gray-300 bg-white"
                                    }`}
                                >
                                    {confirmedPricingRule && <Ionicons name="checkmark" size={14} color="white" />}
                                </View>
                                <Text className="font-poppins-medium text-secondary text-xs flex-1">
                                    I acknowledge and confirm these pricing rules
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View className="mb-5">
                        <Label>{isStayListing ? "Price per night" : "Price"}</Label>
                        <Input placeholder={isStayListing ? "e.g. 45000 per night" : "e.g. 5000000"} keyboardType="numeric" value={price} onChangeText={setPrice} />
                    </View>

                    {/* Additional Fee Fields for Rent & Sale */}
                    {(listingType === "for_rent" || listingType === "for_sale") && (
                        <>
                            <View className="mb-5">
                                <View className="flex-row justify-between items-center mb-1">
                                    <Label>Legal Fee</Label>
                                    <Text className="text-[11px] font-poppins text-gray-400">10% default (editable)</Text>
                                </View>
                                <Input
                                    placeholder={`e.g. ${defaultLegalFee || 500000}`}
                                    keyboardType="numeric"
                                    value={legalFeeCustom ? legalFee : (numericPrice > 0 ? String(defaultLegalFee) : "")}
                                    onChangeText={(text: string) => {
                                        setLegalFeeCustom(true);
                                        setLegalFee(text);
                                    }}
                                />
                            </View>

                            <View className="mb-5">
                                <View className="flex-row justify-between items-center mb-1">
                                    <Label>Agent Fee (Optional)</Label>
                                    <Text className="text-[11px] font-poppins text-gray-400">Optional fee</Text>
                                </View>
                                <Input
                                    placeholder="e.g. 500000"
                                    keyboardType="numeric"
                                    value={agentFee}
                                    onChangeText={setAgentFee}
                                />
                            </View>

                            {listingType === "for_rent" && (
                                <>
                                    <View className="mb-5">
                                        <View className="flex-row justify-between items-center mb-1">
                                            <Label>Caution Fee</Label>
                                            <Text className="text-[11px] font-poppins text-emerald-600">Refundable Escrow</Text>
                                        </View>
                                        <Input
                                            placeholder="e.g. 200000"
                                            keyboardType="numeric"
                                            value={cautionFee}
                                            onChangeText={setCautionFee}
                                        />
                                    </View>

                                    <View className="mb-5">
                                        <View className="flex-row justify-between items-center mb-1">
                                            <Label>Service Charge (Optional)</Label>
                                            <Text className="text-[11px] font-poppins text-gray-400">Shows 'To be determined' if blank</Text>
                                        </View>
                                        <Input
                                            placeholder="e.g. 150000 (leave blank if pending)"
                                            keyboardType="numeric"
                                            value={serviceCharge}
                                            onChangeText={setServiceCharge}
                                        />
                                    </View>
                                </>
                            )}

                            {/* Live Pricing Calculator Card */}
                            {numericPrice > 0 && (
                                <View className="mb-6 bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
                                    <View className="flex-row justify-between items-center mb-3">
                                        <View className="flex-row items-center gap-1.5">
                                            <Ionicons name="calculator-outline" size={16} color="#0D3B66" />
                                            <Text className="font-poppins-semibold text-secondary text-sm">
                                                Live Pricing Breakdown
                                            </Text>
                                        </View>
                                        <View className="bg-primary/10 px-2 py-0.5 rounded-full">
                                            <Text className="font-poppins-medium text-[10px] text-primary uppercase">Calculated</Text>
                                        </View>
                                    </View>

                                    <View className="flex-row justify-between py-1.5 border-b border-gray-100">
                                        <Text className="font-poppins text-xs text-gray-500">Property Price</Text>
                                        <Text className="font-poppins-medium text-xs text-secondary">
                                            ₦{numericPrice.toLocaleString()}
                                        </Text>
                                    </View>

                                    <View className="flex-row justify-between py-1.5 border-b border-gray-100">
                                        <Text className="font-poppins text-xs text-gray-500">Legal Fee</Text>
                                        <Text className="font-poppins-medium text-xs text-secondary">
                                            ₦{activeLegalFee.toLocaleString()}
                                        </Text>
                                    </View>

                                    {numericAgentFee > 0 && (
                                        <View className="flex-row justify-between py-1.5 border-b border-gray-100">
                                            <Text className="font-poppins text-xs text-gray-500">Agent Fee</Text>
                                            <Text className="font-poppins-medium text-xs text-secondary">
                                                ₦{numericAgentFee.toLocaleString()}
                                            </Text>
                                        </View>
                                    )}

                                    {listingType === "for_rent" && (
                                        <>
                                            <View className="flex-row justify-between py-1.5 border-b border-gray-100">
                                                <Text className="font-poppins text-xs text-gray-500">Caution Fee (Escrow)</Text>
                                                <Text className="font-poppins-medium text-xs text-secondary">
                                                    {numericCautionFee > 0 ? `₦${numericCautionFee.toLocaleString()}` : "₦0"}
                                                </Text>
                                            </View>
                                            <View className="flex-row justify-between py-1.5 border-b border-gray-100">
                                                <Text className="font-poppins text-xs text-gray-500">Service Charge</Text>
                                                <Text className="font-poppins-medium text-xs text-secondary">
                                                    {numericServiceCharge > 0 ? `₦${numericServiceCharge.toLocaleString()}` : "To be determined"}
                                                </Text>
                                            </View>
                                        </>
                                    )}

                                    <View className="flex-row justify-between py-1.5 border-b border-gray-100">
                                        <Text className="font-poppins text-xs text-gray-500">Platform Commission</Text>
                                        <Text className="font-poppins-medium text-xs text-emerald-600">
                                            ₦0 (Free / Offline)
                                        </Text>
                                    </View>

                                    <View className="flex-row justify-between items-center pt-2.5 mt-1">
                                        <Text className="font-poppins-bold text-sm text-secondary">Estimated Total</Text>
                                        <Text className="font-poppins-bold text-base text-primary">
                                            ₦{calculatedTotal.toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </>
                    )}

                    <Select label="Property type" value={propertyType} placeholder="Select"
                        options={PROPERTY_TYPES} onChange={setPropertyType}
                    />

                    <View className="h-px bg-gray-200 my-2 mb-6" />
                    <Text className="font-poppins-bold text-lg text-secondary mb-1">Amenities</Text>
                    <Text className="font-poppins text-xs text-gray-500 mb-4">Select everything available at this property.</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {AMENITIES.map((a) => (
                            <CheckItem
                                key={a}
                                label={a}
                                checked={amenities.includes(a)}
                                onToggle={() => toggleAmenity(a)}
                            />
                        ))}
                    </View>

                    <View className="h-px bg-gray-200 mt-3 mb-6" />
                    <Text className="font-poppins-bold text-lg text-secondary mb-1">Property details</Text>
                    <Text className="font-poppins text-xs text-gray-500 mb-5">Help people understand the space before they contact you.</Text>

                    <Select
                        label="Property Size"
                        value={size}
                        placeholder="Select size"
                        options={SIZE_OPTIONS}
                        onChange={setSize}
                    />

                    <Select
                        label="Furnishing Status (e.g. Fully Furnished Apartment)"
                        value={furnishing}
                        placeholder="Select"
                        options={FURNISHING}
                        onChange={setFurnishing}
                    />

                    <Select
                        label="Property Condition (e.g. Recently Renovated)"
                        value={condition}
                        placeholder="Select"
                        options={CONDITIONS}
                        onChange={setCondition}
                    />

                    <View className="mb-5">
                        <Label>{listingType === "hotel" ? "Rooms" : "Bedrooms"}</Label>
                        <Input placeholder={listingType === "hotel" ? "e.g. 24 rooms" : "e.g. 3"} keyboardType="numeric" value={bedrooms} onChangeText={setBedrooms} />
                    </View>

                    <View className="mb-5">
                        <Label>Bathrooms</Label>
                        <Input placeholder="e.g. 2" keyboardType="numeric" value={bathrooms} onChangeText={setBathrooms} />
                    </View>

                    <View className="mb-5">
                        <Label>Parking Space</Label>
                        <Input placeholder="e.g. 1" keyboardType="numeric" value={parkingSpace} onChangeText={setParkingSpace} />
                    </View>

                    <View className="mb-5">
                        <Label>Description</Label>
                        <TextInput
                            placeholder="Please kindly describe the property..."
                            placeholderTextColor="#6B7280"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            textAlignVertical="top"
                            className="border border-gray-200 rounded-xl px-4 py-4 h-40 font-poppins text-secondary bg-gray-50"
                        />
                    </View>

                    <View className="mb-5">
                        <Label>YouTube Video Link (Optional)</Label>
                        <Input placeholder="e.g. https://youtu.be/example" value={youtubeVideoUrl} onChangeText={setYoutubeVideoUrl} autoCapitalize="none" keyboardType="url" />
                    </View>

                    {/* Images */}
                    <View className="mb-6">
                        <Text className="font-poppins-semibold text-secondary mb-2">
                            Upload Property Images{" "}
                            <Text className="text-gray-500">(Max 7 images)</Text>
                        </Text>

                        <TouchableOpacity
                            onPress={pickImages}
                            activeOpacity={0.85}
                            className="border-2 border-dashed border-gray-300 rounded-2xl p-5 bg-white items-center"
                        >
                            <View className="w-12 h-12 rounded-full bg-amber-50 items-center justify-center mb-3">
                                <Ionicons name="cloud-upload-outline" size={24} color="#C9A24D" />
                            </View>
                            <Text className="font-poppins-semibold text-secondary">Choose property photos</Text>
                            <Text className="font-poppins text-gray-500 text-xs mt-1">
                                {imagesPicked.length === 0 ? "JPG or PNG • up to 7 images" : `${imagesPicked.length} of 7 images selected`}
                            </Text>
                        </TouchableOpacity>

                        <View className="bg-white">
                            {/* thumbnails */}
                            {imagesPicked.length > 0 && (
                                <View className="flex-row flex-wrap mt-3">
                                    {imagesPicked.map((asset) => (
                                        <View key={asset.uri} className="mr-3 mb-3 relative">
                                            <Image source={{ uri: asset.uri }} className="w-16 h-16 rounded-lg" />
                                            <TouchableOpacity
                                                onPress={() => removePicked(asset.uri)}
                                                className="absolute -top-2 -right-2 bg-white rounded-full"
                                            >
                                                <Ionicons name="close-circle" size={22} color="#EF4444" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Utility Bill */}
                    <View className="mb-6">
                        <Text className="font-poppins-semibold text-secondary mb-1">Utility Bill / Proof of Ownership</Text>
                        <Text className="font-poppins text-xs text-gray-500 mb-3">Upload a utility bill, land document, or proof of address for this property.</Text>

                        <TouchableOpacity
                            onPress={pickUtilityBill}
                            activeOpacity={0.85}
                            className={`border-2 border-dashed rounded-2xl p-5 bg-white items-center ${
                                utilityBill ? "border-amber-400" : "border-gray-300"
                            }`}
                        >
                            {utilityBill ? (
                                <View className="items-center">
                                    <View className="w-12 h-12 rounded-full bg-amber-50 items-center justify-center mb-3">
                                        <Ionicons name="document-text" size={24} color="#C9A24D" />
                                    </View>
                                    <Text className="font-poppins-semibold text-amber-600">Document uploaded ✓</Text>
                                    <Text className="font-poppins text-gray-500 text-xs mt-1">Tap to change</Text>
                                </View>
                            ) : (
                                <View className="items-center">
                                    <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-3">
                                        <Ionicons name="document-attach-outline" size={24} color="#9CA3AF" />
                                    </View>
                                    <Text className="font-poppins-semibold text-secondary">Upload utility bill</Text>
                                    <Text className="font-poppins text-gray-500 text-xs mt-1">JPG or PNG image of the document</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        {utilityBill && (
                            <View className="mt-3 flex-row items-center">
                                <Image source={{ uri: utilityBill.uri }} className="w-16 h-16 rounded-lg mr-3" />
                                <TouchableOpacity
                                    onPress={() => setUtilityBill(null)}
                                    className="flex-row items-center px-3 py-2 bg-red-50 rounded-xl"
                                >
                                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                                    <Text className="font-poppins text-red-500 text-xs ml-1">Remove</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                        onPress={submit}
                        disabled={loading}
                        className={`bg-primary rounded-2xl py-4 items-center mb-10 flex-row justify-center ${loading ? "opacity-70" : ""}`}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Text className="text-white font-poppins-bold text-base mr-2">Publish Listing</Text>
                                <Ionicons name="arrow-forward" size={19} color="white" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={closeAlert}
            />
        </SafeAreaView>
    );
}
