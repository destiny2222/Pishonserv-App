import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { SolarQuotePayload } from '@/libs/endpoints/solar';

interface SolarQuoteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: SolarQuotePayload) => void;
  loading?: boolean;
}

const SolarQuoteModal: React.FC<SolarQuoteModalProps> = ({
  visible,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [formData, setFormData] = useState < SolarQuotePayload > ({
    full_name: '',
    phone: '',
    email: '',
    home_address: '',
    city_state: '',
    occupation: '',
    building_type: '',
    requested_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    requested_time: '10:00 AM',
    inverter_capacity: '',
    commitment_check: false,
  });

  const [inverterOption, setInverterOption] = useState < string | null > (null);

  const [date, setDate] = useState(new Date(Date.now() + 86400000));
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [errors, setErrors] = useState < Partial < Record < keyof SolarQuotePayload, string>>> ({});

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\+?[0-9]{7,15}$/.test(phone.replace(/\s/g, ''));

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const formatDisplayTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
  };

  const handleInputChange = (field: keyof SolarQuotePayload, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleConfirm = () => {
    const newErrors: Partial<Record<keyof SolarQuotePayload, string>> = {};

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!validatePhone(formData.phone)) newErrors.phone = 'Valid phone is required';
    if (!formData.home_address.trim()) newErrors.home_address = 'Address is required';
    if (!formData.city_state.trim()) newErrors.city_state = 'City/State is required';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    if (!formData.building_type.trim()) newErrors.building_type = 'Building type is required';
    if (!formData.commitment_check) newErrors.commitment_check = 'You must agree to the terms';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Normalize Nigerian phone number to international format
    const normalizedPhone = formData.phone.startsWith('0')
      ? '+234' + formData.phone.slice(1)
      : formData.phone;

    onConfirm({ ...formData, phone: normalizedPhone });

    // onConfirm(formData);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      handleInputChange('requested_date', formatDate(selectedDate));
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
      handleInputChange('requested_time', formatDisplayTime(selectedTime));
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl px-6 py-6 h-[90%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-poppins-bold text-secondary">Get Solar Quote</Text>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <InputField label="Full Name" value={formData.full_name} onChangeText={(t: string) => handleInputChange('full_name', t)} error={errors.full_name} placeholder="John Doe" />
              <InputField label="Email Address" value={formData.email} onChangeText={(t: string) => handleInputChange('email', t)} error={errors.email} keyboardType="email-address" placeholder="john@example.com" />
              <InputField
                label="Phone Number"
                value={formData.phone}
                onChangeText={(t: string) => handleInputChange('phone', t)}
                error={errors.phone}
                keyboardType="phone-pad"
                placeholder="+2348012345678 or 08012345678"
              />
              <InputField label="Home Address" value={formData.home_address} onChangeText={(t: string) => handleInputChange('home_address', t)} error={errors.home_address} placeholder="12 Admiralty Way" />
              <InputField label="City & State" value={formData.city_state} onChangeText={(t: string) => handleInputChange('city_state', t)} error={errors.city_state} placeholder="Lekki, Lagos" />
              <InputField label="Occupation" value={formData.occupation} onChangeText={(t: string) => handleInputChange('occupation', t)} error={errors.occupation} placeholder="Engineer" />
              <InputField label="Building Type" value={formData.building_type} onChangeText={(t: string) => handleInputChange('building_type', t)} error={errors.building_type} placeholder="Bungalow, Duplex, etc." />
              <Text className="text-sm font-poppins-medium text-gray-600 mb-2">Inverter Capacity</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {['1kVA System', '2kVA System', '3kVA System', '5kVA System', '10kVA System', '15kVA System', '20kVA System', 'Other'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      if (option === 'Other') {
                        handleInputChange('inverter_capacity', '');
                        setInverterOption('Other');
                      } else {
                        handleInputChange('inverter_capacity', option);
                        setInverterOption(option);
                      }
                    }}
                    className={`px-4 py-2 rounded-full border ${inverterOption === option ? 'border-secondary bg-secondary' : 'border-gray-200 bg-gray-50'}`}
                  >
                    <Text className={`text-xs font-poppins ${inverterOption === option ? 'text-white' : 'text-gray-600'}`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {inverterOption === 'Other' && (
                <InputField
                  label="Enter Capacity"
                  value={formData.inverter_capacity || ''}
                  onChangeText={(t: string) => handleInputChange('inverter_capacity', t)}
                  placeholder="e.g. 30kVA"
                  autoFocus
                />
              )}

              <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                  <Text className="text-sm font-poppins-medium text-gray-600 mb-2">Preferred Date</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} className="border border-gray-300 rounded-xl px-4 py-4 flex-row justify-between items-center bg-gray-50">
                    <Text className="text-sm font-poppins text-black-300">{formatDisplayDate(date)}</Text>
                    <Ionicons name="calendar-outline" size={20} color="#C9A24D" />
                  </TouchableOpacity>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-poppins-medium text-gray-600 mb-2">Preferred Time</Text>
                  <TouchableOpacity onPress={() => setShowTimePicker(true)} className="border border-gray-300 rounded-xl px-4 py-4 flex-row justify-between items-center bg-gray-50">
                    <Text className="text-sm font-poppins text-black-300">{formatDisplayTime(time)}</Text>
                    <Ionicons name="time-outline" size={20} color="#C9A24D" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="h-6" />

              {/* Commitment & Terms */}
              <View className="bg-[#FFF9E6] border border-[#F0E6CC] rounded-xl p-4 mb-4">
                <Text className="text-[#7A5C00] font-poppins text-xs mb-3">
                  I confirm my interest in a solar/inverter system and agree to a technical survey of my location.
                </Text>
                <TouchableOpacity
                  onPress={() => handleInputChange('commitment_check', !formData.commitment_check as any)}
                  className="flex-row items-center"
                >
                  <View className={`w-6 h-6 rounded border items-center justify-center mr-2 ${formData.commitment_check ? 'bg-[#7A5C00] border-[#7A5C00]' : 'bg-white border-gray-300'}`}>
                    {formData.commitment_check && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text className="text-[#7A5C00] font-poppins-bold text-xs uppercase">I agree to the terms</Text>
                </TouchableOpacity>
              </View>

              {/* Survey Fee Requirement */}
              <View className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                <Text className="text-sm font-poppins-bold text-secondary mb-2">Survey Fee Requirement</Text>
                <Text className="text-xs font-poppins text-gray-600 mb-4">
                  A non-refundable survey and assessment fee of <Text className="font-poppins-bold">₦40,000</Text> is required before the technical inspection.
                </Text>
                <View className="flex-row items-start bg-white p-3 rounded-lg border border-gray-100">
                  <Ionicons name="information-circle-outline" size={18} color="#C9A24D" className="mr-2" />
                  <Text className="flex-1 text-[10px] font-poppins text-gray-500">
                    Payment will be initiated after you submit this form and our initial consultation.
                  </Text>
                </View>
              </View>

              <View className="h-4" />
            </ScrollView>

            <TouchableOpacity onPress={handleConfirm} disabled={loading} className={`py-4 rounded-full mt-4 ${loading ? 'bg-gray-300' : 'bg-[#E6C975]'}`}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-secondary text-center text-lg font-poppins-bold">Submit Request</Text>}
            </TouchableOpacity>
          </View>
        </View>

        {/* Pickers */}
        <DatePickerModal visible={showDatePicker} value={date} mode="date" onChange={handleDateChange} onClose={() => setShowDatePicker(false)} title="Select Consultation Date" />
        <DatePickerModal visible={showTimePicker} value={time} mode="time" onChange={handleTimeChange} onClose={() => setShowTimePicker(false)} title="Select Consultation Time" />
      </KeyboardAvoidingView>
    </Modal>
  );
};

const InputField = ({ label, error, ...props }: { label: string; error?: string;[key: string]: any }) => (
  <View className="mb-4">
    <View className="flex-row justify-between">
      <Text className="text-sm font-poppins-medium text-gray-600 mb-2">{label}</Text>
      {error && <Text className="text-xs text-red-500 font-poppins">{error}</Text>}
    </View>
    <TextInput className={`border rounded-xl px-4 py-4 text-base font-poppins text-black-300 bg-gray-50 ${error ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`} {...props} />
  </View>
);

const DatePickerModal = ({ visible, value, mode, onChange, onClose, title }: { visible: boolean; value: Date; mode: 'date' | 'time'; onChange: (event: any, date?: Date) => void; onClose: () => void; title: string }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View className="flex-1 justify-center items-center bg-black/50">
      <View className="bg-white rounded-2xl p-6 w-[85%] max-w-[340px]">
        <Text className="text-lg font-poppins-bold text-center mb-4 text-secondary">{title}</Text>
        <DateTimePicker value={value} mode={mode} display={Platform.OS === 'ios' ? 'spinner' : 'default'} minimumDate={mode === 'date' ? new Date() : undefined} onChange={onChange} />
        <View className="flex-row justify-end mt-4 gap-3">
          <TouchableOpacity onPress={onClose}><Text className="text-gray-500 font-poppins p-2">Cancel</Text></TouchableOpacity>
          <TouchableOpacity onPress={onClose} className="bg-[#E6C975] px-4 py-2 rounded-lg"><Text className="text-secondary font-poppins-bold">Confirm</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default SolarQuoteModal;
