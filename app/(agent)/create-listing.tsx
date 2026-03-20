import CustomAlert from "@/components/CustomAlert";
import TopHeader from "@/components/TopHeader";
import { createListing, CreateListingData, ListingType } from "@/libs/endpoints/agent/createListing";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Image, Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Option = { label: string; value: string };

const LISTING_TYPES: Option[] = [
    { label: "Rent", value: "for_rent" },
    { label: "Sale", value: "for_sale" },
];

const PROPERTY_TYPES: Option[] = [
    { label: "Apartment", value: "Apartment" },
    { label: "House", value: "House" },
    { label: "Villa", value: "Villa" },
    { label: "Duplex", value: "Duplex" },
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
];

function Label({ children }: { children: React.ReactNode }) {
    return <Text className="text-secondary font-poppins mb-2">{children}</Text>;
}

function Input(props: any) {
    return (
        <TextInput
            {...props}
            className={`border border-gray-400 rounded-lg px-4 py-3 text-secondary font-poppins ${props.className ?? ""}`}
            placeholderTextColor="#6B7280"
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
        <View className="mb-5">
            <Label>{label}</Label>

            <TouchableOpacity
                onPress={() => setOpen(true)}
                activeOpacity={0.9}
                className="border border-gray-400 rounded-lg px-4 py-4 flex-row items-center justify-between bg-white"
            >
                <Text className={`font-poppins ${value ? "text-secondary" : "text-gray-500"}`}>
                    {currentLabel || placeholder}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#111827" />
            </TouchableOpacity>

            <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
                <Pressable className="flex-1 bg-black/25 justify-end" onPress={() => setOpen(false)}>
                    <Pressable className="bg-white rounded-t-3xl px-5 pt-5 pb-8">
                        <Text className="font-poppins-bold text-lg text-secondary mb-4">{label}</Text>

                        {options.map((opt) => {
                            const selected = opt.value === value;
                            return (
                                <TouchableOpacity
                                    key={opt.value}
                                    onPress={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                    }}
                                    className="py-4 flex-row items-center justify-between border-b border-gray-100"
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
        <TouchableOpacity onPress={onToggle} activeOpacity={0.8} className="w-1/2 flex-row items-center mb-4" >
            <View className={`w-5 h-5 rounded border mr-3 items-center justify-center ${checked ? "bg-primary border-primary" : "border-gray-400 bg-white"}`}  >
                {checked ? <Ionicons name="checkmark" size={14} color="white" /> : null}
            </View>
            <Text className="font-poppins text-secondary">{label}</Text>
        </TouchableOpacity>
    );
}

export default function CreateListing() {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [listingType, setListingType] = useState("");
    const [price, setPrice] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [furnishing, setFurnishing] = useState("");
    const [condition, setCondition] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [garage, setGarage] = useState("");
    const [description, setDescription] = useState("");

    const [amenities, setAmenities] = useState < string[] > ([]);
    const [imagesPicked, setImagesPicked] = useState < ImagePicker.ImagePickerAsset[] > ([]);
    const [loading, setLoading] = useState(false);

    // Custom Alert State
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertOnClose, setAlertOnClose] = useState < (() => void) | undefined > (undefined);

    const showAlert = (title: string, message: string, onClose?: () => void) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertOnClose(() => onClose); // wrap in function if needed, but state setter might invoke it. 
        // Better: setAlertOnClose(() => onClose); to store the function
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

    const removePicked = (uri: string) => {
        setImagesPicked((prev) => prev.filter((x) => x.uri !== uri));
    };

    const submit = async () => {
        if (!title || !price || !location || !listingType || !description) {
            showAlert("Missing Fields", "Please fill in all required fields (Title, Location, simple Listing Type, Price, Description)");
            return;
        }

        if (imagesPicked.length === 0) {
            showAlert("No Images", "Please upload at least one image.");
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
                price: Number(price.replace(/[^0-9.]/g, '')),
                description,
                type: propertyType || undefined,
                amenities,
                ...(bedrooms ? { bedrooms: Number(bedrooms) } : {}),
                ...(bathrooms ? { bathrooms: Number(bathrooms) } : {}),
                ...(garage ? { garage: Number(garage) } : {}),
                images: imageBase64s,
            };

        
            const response = await createListing(payload);

            if (response.status === 'success' || response.status === 'ok' || (response as any).success) {
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
        <SafeAreaView className="flex-1 bg-gray-300 pt-6">
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-4">
                    <TopHeader title='Create Listings' />
                </View>
                <View className="px-5 mt-3">
                    <View className="mb-5">
                        <Label>Title</Label>
                        <Input placeholder="e.g. Luxurious apartment" value={title} onChangeText={setTitle} />
                    </View>

                    <View className="mb-5">
                        <Label>Location</Label>
                        <Input placeholder="Enter location" value={location} onChangeText={setLocation} />
                    </View>

                    <Select label="Listing type" value={listingType} placeholder="Select" options={LISTING_TYPES} onChange={setListingType} />

                    <View className="mb-5">
                        <Label>Price</Label>
                        <Input placeholder="e.g. 5000000" keyboardType="numeric" value={price} onChangeText={setPrice} />
                    </View>

                    <Select label="Property type" value={propertyType} placeholder="Select"
                        options={PROPERTY_TYPES} onChange={setPropertyType}
                    />

                    {/* Amenities */}
                    <Text className="font-poppins-bold text-base text-secondary mb-4">Amenities</Text>
                    <View className="flex-row flex-wrap">
                        {AMENITIES.map((a) => (
                            <CheckItem
                                key={a}
                                label={a}
                                checked={amenities.includes(a)}
                                onToggle={() => toggleAmenity(a)}
                            />
                        ))}
                    </View>

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
                        <Label>Bedrooms</Label>
                        <Input placeholder="Eg. 3" keyboardType="numeric" value={bedrooms} onChangeText={setBedrooms} />
                    </View>

                    <View className="mb-5">
                        <Label>Bathrooms</Label>
                        <Input placeholder="Eg. 2" keyboardType="numeric" value={bathrooms} onChangeText={setBathrooms} />
                    </View>

                    <View className="mb-5">
                        <Label>Garage Spaces</Label>
                        <Input placeholder="Eg. 1" keyboardType="numeric" value={garage} onChangeText={setGarage} />
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
                            className="border border-gray-400 rounded-lg px-4 py-4 h-40 font-poppins text-secondary"
                        />
                    </View>

                    {/* Images */}
                    <View className="mb-6">
                        <Text className="font-poppins text-secondary mb-2">
                            Upload Property Images{" "}
                            <Text className="text-gray-500">(Max 7 images)</Text>
                        </Text>

                        <View className="border border-gray-400 rounded-lg p-3 bg-white">
                            <TouchableOpacity
                                onPress={pickImages}
                                activeOpacity={0.85}
                                className="self-start bg-gray-100 px-4 py-2 rounded-md"
                            >
                                <Text className="font-poppins text-secondary">Choose File</Text>
                            </TouchableOpacity>

                            <Text className="font-poppins text-gray-500 mt-2">
                                {imagesPicked.length === 0 ? "No file chosen" : `${imagesPicked.length} image(s) selected`}
                            </Text>

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

                            <Text className="font-poppins text-gray-500 text-xs mt-2">
                                Images will be auto-compressed. Accepted: JPG, PNG.
                            </Text>
                        </View>
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                        onPress={submit}
                        disabled={loading}
                        className={`bg-primary rounded-xl py-4 items-center mb-10 ${loading ? "opacity-70" : ""}`}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-poppins-bold text-base">Add Property</Text>
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
