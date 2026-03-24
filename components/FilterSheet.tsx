import React, { useEffect, useRef, useState } from "react";
import { Modal, View, Text,  Pressable,  Animated,  Dimensions, TextInput,
  TouchableOpacity, } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: {
    type: string;
    location: string;
    minPrice: string;
    maxPrice: string;
  }) => void;
};

const { height } = Dimensions.get("window");

const propertyTypes = [
    "House", "Villa", "Apartment", "Duplex"
];
const locations = [
    "Lagos", "Abuja", "Ikorodu", "Lekki", "Lagos Island"
];

const FilterSheet = ({ visible, onClose, onApply }: Props) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [openType, setOpenType] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(height);
    }
  }, [visible, translateY]);

  const reset = () => {
    setType("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
  };

  const close = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const SelectField = ({
    value,
    placeholder,
    open,
    setOpen,
    options,
    onSelect,
  }: any) => (
    <View className="mb-5">
      <Pressable
        onPress={() => {
          setOpen(!open);
        }}
        className="bg-white rounded-xl px-4 py-5 flex-row items-center justify-between shadow-sm"
      >
        <Text className={`font-poppins text-base ${value ? "text-black-300" : "text-gray-600"}`}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
      </Pressable>

      {open && (
        <View className="bg-white mt-2 rounded-xl overflow-hidden border border-gray-100">
          {options.map((opt: string) => (
            <Pressable
              key={opt}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className="px-4 py-4 border-b border-gray-100"
            >
              <Text className="font-poppins text-black-300">{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      {/* Overlay */}
      <Pressable className="flex-1 bg-black/30" onPress={close} />

      {/* Sheet */}
      <Animated.View
        style={{ transform: [{ translateY }] }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl px-6 pt-6 pb-8"
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-poppins-bold text-primary-300">Filter</Text>
          <TouchableOpacity onPress={reset}>
             <Text className="text-primary-300 font-poppins-medium text-base">Reset</Text>
          </TouchableOpacity>
        </View>

        <SelectField
          value={type}
          placeholder="Property Type"
          open={openType}
          setOpen={(v: boolean) => {
            setOpenType(v);
            if (v) setOpenLocation(false);
          }}
          options={propertyTypes}
          onSelect={setType}
        />

        <SelectField
          value={location}
          placeholder="Location"
          open={openLocation}
          setOpen={(v: boolean) => {
            setOpenLocation(v);
            if (v) setOpenType(false);
          }}
          options={locations}
          onSelect={setLocation}
        />

        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 bg-white rounded-xl px-4 py-5 shadow-sm">
            <TextInput
              placeholder="Min. Price"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
              className="font-poppins text-base text-black-300"
            />
          </View>

          <View className="flex-1 bg-white rounded-xl px-4 py-5 shadow-sm">
            <TextInput
              placeholder="Max. Price"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
              className="font-poppins text-base text-black-300"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onApply({ type, location, minPrice, maxPrice })}
          className="bg-[#C9A24D] rounded-2xl py-5 items-center"
        >
          <Text className="text-white font-poppins-bold text-xl">Proceed</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

export default FilterSheet;
