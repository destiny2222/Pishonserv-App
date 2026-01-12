import React, { useMemo, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Modal, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { router } from "expo-router";
import TopHeader from "@/components/TopHeader";

type Option = { label: string; value: string };

const LISTING_TYPES: Option[] = [
    { label: "Rent", value: "rent" },
    { label: "Sale", value: "sale" },
];

const PROPERTY_TYPES: Option[] = [
    { label: "Apartment", value: "apartment" },
    { label: "House", value: "house" },
    { label: "Villa", value: "villa" },
    { label: "Duplex", value: "duplex" },
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
    return <Text className="text-black-300 font-poppins mb-2">{children}</Text>;
}

function Input(props: any) {
    return (
        <TextInput
            {...props}
            className={`border border-gray-200 rounded-lg px-4 py-3 text-black-300 font-poppins ${props.className ?? ""}`}
            placeholderTextColor="#B8B8B8"
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
                className="border border-gray-200 rounded-lg px-4 py-4 flex-row items-center justify-between bg-white"
            >
                <Text className={`font-poppins ${value ? "text-black-300" : "text-gray-300"}`}>
                    {currentLabel || placeholder}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#111827" />
            </TouchableOpacity>

            <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
                <Pressable className="flex-1 bg-black/25 justify-end" onPress={() => setOpen(false)}>
                    <Pressable className="bg-white rounded-t-3xl px-5 pt-5 pb-8">
                        <Text className="font-poppins-bold text-lg text-black-300 mb-4">{label}</Text>

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
                                    <Text className="font-poppins text-black-300">{opt.label}</Text>
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
        <TouchableOpacity onPress={onToggle}  activeOpacity={0.8}  className="w-1/2 flex-row items-center mb-4" >
            <View className={`w-5 h-5 rounded border mr-3 items-center justify-center ${checked ? "bg-primary border-primary" : "border-gray-300 bg-white"  }`}  >
                {checked ? <Ionicons name="checkmark" size={14} color="white" /> : null}
            </View>
            <Text className="font-poppins text-black-300">{label}</Text>
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
    const [imagesPicked, setImagesPicked] = useState < string[] > ([]);

    const toggleAmenity = (name: string) => {
        setAmenities((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
    };

    const pickImages = async () => {
        if (imagesPicked.length >= 7) return;

        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) return;
        // Note: allowsMultipleSelection works on iOS; Android typically returns single.
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: [ImagePicker.MediaType.Image],
            quality: 0.8,
            allowsMultipleSelection: Platform.OS === "ios",
            selectionLimit: 7 - imagesPicked.length,
        });

        if (result.canceled) return;

        const uris = result.assets.map((a) => a.uri);
        setImagesPicked((prev) => [...prev, ...uris].slice(0, 7));
    };

    const removePicked = (uri: string) => {
        setImagesPicked((prev) => prev.filter((x) => x !== uri));
    };

    const submit = () => {
        const payload = {
            title,
            location,
            listingType,
            price,
            propertyType,
            amenities,
            furnishing,
            condition,
            bedrooms,
            bathrooms,
            garage,
            description,
            images: imagesPicked,
        };

        console.log("SUBMIT:", payload);
        // call your API here
    };

    return (
        <SafeAreaView className="flex-1 bg-white pt-6">
            {/* <Image source={images.logoMark ?? images.logo}  className="absolute -top-6 -right-10 w-48 h-48 opacity-10"  resizeMode="contain" /> */}
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

                    <Select  label="Listing type" value={listingType} placeholder="Select"  options={LISTING_TYPES}  onChange={setListingType} />

                    <View className="mb-5">
                        <Label>Price</Label>
                        <Input  placeholder="e.g. 5000000" keyboardType="numeric"  value={price} onChangeText={setPrice} />
                    </View>

                    <Select  label="Property type" value={propertyType} placeholder="Select"
                        options={PROPERTY_TYPES}  onChange={setPropertyType}
                    />

                    {/* Amenities */}
                    <Text className="font-poppins-bold text-base text-black-300 mb-4">Amenities</Text>
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
                            placeholderTextColor="#B8B8B8"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            textAlignVertical="top"
                            className="border border-gray-200 rounded-lg px-4 py-4 h-40 font-poppins text-black-300"
                        />
                    </View>

                    {/* Images */}
                    <View className="mb-6">
                        <Text className="font-poppins text-black-300 mb-2">
                            Upload Property Images{" "}
                            <Text className="text-gray-400">(Max 7 images)</Text>
                        </Text>

                        <View className="border border-gray-200 rounded-lg p-3 bg-white">
                            <TouchableOpacity
                                onPress={pickImages}
                                activeOpacity={0.85}
                                className="self-start bg-gray-100 px-4 py-2 rounded-md"
                            >
                                <Text className="font-poppins text-black-300">Choose File</Text>
                            </TouchableOpacity>

                            <Text className="font-poppins text-gray-500 mt-2">
                                {imagesPicked.length === 0 ? "No file chosen" : `${imagesPicked.length} image(s) selected`}
                            </Text>

                            {/* thumbnails */}
                            {imagesPicked.length > 0 && (
                                <View className="flex-row flex-wrap mt-3">
                                    {imagesPicked.map((uri) => (
                                        <View key={uri} className="mr-3 mb-3 relative">
                                            <Image source={{ uri }} className="w-16 h-16 rounded-lg" />
                                            <TouchableOpacity
                                                onPress={() => removePicked(uri)}
                                                className="absolute -top-2 -right-2 bg-white rounded-full"
                                            >
                                                <Ionicons name="close-circle" size={22} color="#EF4444" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <Text className="font-poppins text-gray-400 text-xs mt-2">
                                Images will be auto-compressed. Accepted: JPG, PNG.
                            </Text>
                        </View>
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                        onPress={submit}
                        activeOpacity={0.9}
                        className="bg-primary rounded-xl py-4 items-center mb-10"
                    >
                        <Text className="text-white font-poppins-bold text-base">Add Property</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
