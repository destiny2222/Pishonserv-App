import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (checkIn: string, checkOut: string) => void;
  loading?: boolean;
  propertyPrice: string;
  listingType?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  onClose,
  onConfirm,
  loading = false,
  propertyPrice,
  listingType,
}) => {
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 86400000)); // +1 day
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateNights = (): number => {
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const calculateTotalAmount = (): number => {
    const nights = calculateNights();
    const pricePerNight = parseFloat(propertyPrice.replace(/[^0-9.-]+/g, ''));
    return pricePerNight * nights;
  };

  const handleConfirm = () => {
    const checkIn = formatDate(checkInDate);
    const checkOut = formatDate(checkOutDate);
    onConfirm(checkIn, checkOut);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl px-6 py-6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-rubik-bold text-black-300">
              Select Dates
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Check-in Date */}
          <View className="mb-4">
            <Text className="text-sm font-rubik-medium text-gray-600 mb-2">
              Check-in Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowCheckInPicker(true)}
              className="border border-gray-300 rounded-xl px-4 py-4 flex-row justify-between items-center"
            >
              <Text className="text-base font-rubik text-black-300">
                {formatDisplayDate(checkInDate)}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#C9A24D" />
            </TouchableOpacity>
          </View>

          {/* Check-out Date */}
          <View className="mb-4">
            <Text className="text-sm font-rubik-medium text-gray-600 mb-2">
              Check-out Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowCheckOutPicker(true)}
              className="border border-gray-300 rounded-xl px-4 py-4 flex-row justify-between items-center"
            >
              <Text className="text-base font-rubik text-black-300">
                {formatDisplayDate(checkOutDate)}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#C9A24D" />
            </TouchableOpacity>
          </View>

          {/* Nights & Total */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-rubik text-gray-600">
                Number of Nights
              </Text>
              <Text className="text-base font-rubik-bold text-black-300">
                {calculateNights()}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-rubik text-gray-600">
                Total Amount
              </Text>
              <Text className="text-xl font-rubik-bold text-primary">
                ₦{calculateTotalAmount().toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={loading}
            className="bg-primary py-4 rounded-full"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center text-base font-rubik-bold">
                Confirm Booking
              </Text>
            )}
          </TouchableOpacity>

          {/* Date Pickers */}
          {showCheckInPicker && (
            <DateTimePicker
              value={checkInDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowCheckInPicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setCheckInDate(selectedDate);
                  if (selectedDate >= checkOutDate) {
                    setCheckOutDate(new Date(selectedDate.getTime() + 86400000));
                  }
                }
              }}
            />
          )}

          {showCheckOutPicker && (
            <DateTimePicker
              value={checkOutDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={new Date(checkInDate.getTime() + 86400000)}
              onChange={(event, selectedDate) => {
                setShowCheckOutPicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setCheckOutDate(selectedDate);
                }
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default BookingModal;
