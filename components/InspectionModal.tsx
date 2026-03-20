import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface InspectionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: {
    full_name: string;
    phone: string;
    email: string;
    inspection_date: string;
    inspection_time: string;
    note?: string;
  }) => void;
  loading?: boolean;
}

const InspectionModal: React.FC<InspectionModalProps> = ({
  visible,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date(Date.now() + 86400000));
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; phone?: string; fullName?: string }>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    // Basic verification: starts with + or digit, followed by digits, length between 7-15
    const re = /^\+?[0-9]{7,15}$/;
    return re.test(phone.replace(/\s/g, ''));
  };

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

  const formatDisplayTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const strHours = String(hours).padStart(2, '0');
    const strMinutes = String(minutes).padStart(2, '0');
    return `${strHours}:${strMinutes} ${ampm}`;
  };

  const handleConfirm = () => {
    const newErrors: { email?: string; phone?: string; fullName?: string } = {};
    
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!validateEmail(email)) newErrors.email = 'Please enter a valid email address';
    if (!validatePhone(phone)) newErrors.phone = 'Please enter a valid phone number';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onConfirm({
      full_name: fullName,
      phone,
      email,
      inspection_date: formatDate(date),
      inspection_time: formatDisplayTime(time),
      note,
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl px-6 py-6 h-[80%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-rubik-bold text-black-300">
              Book Inspection
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {/* Full Name */}
            <View className="mb-4">
              <View className="flex-row justify-between">
                <Text className="text-sm font-rubik-medium text-gray-600 mb-2">
                  Full Name
                </Text>
                {errors.fullName && <Text className="text-xs text-red-500 font-rubik">{errors.fullName}</Text>}
              </View>
              <TextInput
                className={`border rounded-xl px-4 py-4 text-base font-rubik text-black-300 ${errors.fullName ? 'border-red-300 bg-red-50/30' : 'border-gray-300'}`}
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
              />
            </View>

            {/* Email */}
            <View className="mb-4">
              <View className="flex-row justify-between">
                <Text className="text-sm font-rubik-medium text-gray-600 mb-2">
                  Email Address
                </Text>
                {errors.email && <Text className="text-xs text-red-500 font-rubik">{errors.email}</Text>}
              </View>
              <TextInput
                className={`border rounded-xl px-4 py-4 text-base font-rubik text-black-300 ${errors.email ? 'border-red-300 bg-red-50/30' : 'border-gray-300'}`}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
              />
            </View>

            {/* Phone */}
            <View className="mb-4">
              <View className="flex-row justify-between">
                <Text className="text-sm font-rubik-medium text-gray-600 mb-2">
                  Phone Number
                </Text>
                {errors.phone && <Text className="text-xs text-red-500 font-rubik">{errors.phone}</Text>}
              </View>
              <TextInput
                className={`border rounded-xl px-4 py-4 text-base font-rubik text-black-300 ${errors.phone ? 'border-red-300 bg-red-50/30' : 'border-gray-300'}`}
                placeholder="Enter your phone number (e.g., +234...)"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
              />
            </View>

            <View className="flex-row gap-4 mb-4">
              {/* Date */}
              <View className="flex-1">
                <Text className="text-sm font-rubik-medium text-gray-600 mb-2">
                  Preferred Date
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="border border-gray-300 rounded-xl px-4 py-4 flex-row justify-between items-center"
                >
                  <Text className="text-sm font-rubik text-black-300" numberOfLines={1}>
                    {formatDisplayDate(date)}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Time */}
              <View className="flex-1">
                <Text className="text-sm font-rubik-medium text-gray-600 mb-2">
                  Preferred Time
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  className="border border-gray-300 rounded-xl px-4 py-4 flex-row justify-between items-center"
                >
                  <Text className="text-base font-rubik text-black-300">
                    {formatDisplayTime(time)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Note */}
            <View className="mb-6">
              <Text className="text-sm font-rubik-medium text-gray-600 mb-2">
                Additional Note (Optional)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-4 text-base font-rubik text-black-300 h-24"
                placeholder="Tell us anything else..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={note}
                onChangeText={setNote}
              />
            </View>
          </ScrollView>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={loading}
            className={`py-4 rounded-full mt-4 ${loading ? 'bg-gray-300' : 'bg-primary'}`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center text-base font-rubik-bold">
                Book Inspection
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Date Picker Modal */}
        <Modal
          visible={showDatePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '85%', maxWidth: 340 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, textAlign: 'center', color: '#333' }}>
                Select Inspection Date
              </Text>
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={new Date()}
                onChange={handleDateChange}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 12 }}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)} style={{ padding: 10 }}>
                  <Text style={{ color: '#666', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDatePicker(false)} style={{ backgroundColor: '#C9A24D', padding: 10, borderRadius: 8 }}>
                  <Text style={{ color: '#fff', fontSize: 16 }}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Time Picker Modal */}
        <Modal
          visible={showTimePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '85%', maxWidth: 340 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, textAlign: 'center', color: '#333' }}>
                Select Inspection Time
              </Text>
              <DateTimePicker
                value={time}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 12 }}>
                <TouchableOpacity onPress={() => setShowTimePicker(false)} style={{ padding: 10 }}>
                  <Text style={{ color: '#666', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowTimePicker(false)} style={{ backgroundColor: '#C9A24D', padding: 10, borderRadius: 8 }}>
                  <Text style={{ color: '#fff', fontSize: 16 }}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

export default InspectionModal;
