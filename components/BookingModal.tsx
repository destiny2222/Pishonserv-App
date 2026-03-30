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
  const [checkInDate, setCheckInDate] = useState(new Date(Date.now() + 86400000));
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 172800000)); // +2 days
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  const [error, setError] = useState<string | null>(null);

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
    if (diffTime <= 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isInquiry = listingType === 'short_let' || listingType === 'hotel';

  const calculateTotalAmount = (): number => {
    const nights = calculateNights();
    const pricePerNight = parseFloat(propertyPrice.replace(/[^0-9.-]+/g, ''));
    return pricePerNight * nights;
  };

  const isDateRangeValid = (): boolean => {
    const nights = calculateNights();
    return nights > 0;
  };

  const handleConfirm = () => {
    if (!isDateRangeValid()) {
      setError('Check-out date must be after check-in date.');
      return;
    }
    setError(null);
    const checkIn = formatDate(checkInDate);
    const checkOut = formatDate(checkOutDate);
    onConfirm(checkIn, checkOut);
  };

  const handleCheckInChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowCheckInPicker(false);
    }
    if (selectedDate) {
      setCheckInDate(selectedDate);
      setError(null);
      if (selectedDate >= checkOutDate) {
        setCheckOutDate(new Date(selectedDate.getTime() + 86400000));
      }
    }
  };

  const handleCheckOutChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowCheckOutPicker(false);
    }
    if (selectedDate) {
      setCheckOutDate(selectedDate);
      setError(null);
    }
  };

  const isValid = isDateRangeValid();

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
              {isInquiry ? 'Select Inquiry Dates' : 'Select Booking Dates'}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error && (
            <View className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
              <Text className="text-red-500 text-sm font-rubik text-center">
                {error}
              </Text>
            </View>
          )}

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
              <Text className={`text-base font-rubik-bold ${!isValid ? 'text-red-500' : 'text-black-300'}`}>
                {calculateNights()}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-rubik text-gray-600">
                Total Amount
              </Text>
              <Text className={`text-xl font-rubik-bold ${!isValid ? 'text-red-300' : 'text-primary'}`}>
                ₦{calculateTotalAmount().toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={loading || !isValid}
            className={`py-4 rounded-full ${(!isValid || loading) ? 'bg-gray-300' : 'bg-primary'}`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center text-base font-rubik-bold">
                {isInquiry ? 'Confirm Inquiry' : 'Confirm Booking'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Material Design Date Picker Modal - Check-in */}
          <Modal
            visible={showCheckInPicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCheckInPicker(false)}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '85%', maxWidth: 340, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, textAlign: 'center', color: '#333' }}>
                  Select Check-in Date
                </Text>
                <DateTimePicker
                  value={checkInDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date()}
                  onChange={handleCheckInChange}
                  style={{ alignSelf: 'center' }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 12 }}>
                  <TouchableOpacity 
                    onPress={() => setShowCheckInPicker(false)}
                    style={{ paddingVertical: 10, paddingHorizontal: 20 }}
                  >
                    <Text style={{ color: '#666', fontSize: 16, fontWeight: '500' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setShowCheckInPicker(false)}
                    style={{ backgroundColor: '#C9A24D', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }}
                  >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Material Design Date Picker Modal - Check-out */}
          <Modal
            visible={showCheckOutPicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCheckOutPicker(false)}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '85%', maxWidth: 340, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, textAlign: 'center', color: '#333' }}>
                  Select Check-out Date
                </Text>
                <DateTimePicker
                  value={checkOutDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date(checkInDate.getTime() + 86400000)}
                  onChange={handleCheckOutChange}
                  style={{ alignSelf: 'center' }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 12 }}>
                  <TouchableOpacity 
                    onPress={() => setShowCheckOutPicker(false)}
                    style={{ paddingVertical: 10, paddingHorizontal: 20 }}
                  >
                    <Text style={{ color: '#666', fontSize: 16, fontWeight: '500' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setShowCheckOutPicker(false)}
                    style={{ backgroundColor: '#C9A24D', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }}
                  >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </Modal>
  );
};

export default BookingModal;
