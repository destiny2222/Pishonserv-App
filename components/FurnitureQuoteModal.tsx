import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { FurnitureQuotePayload } from '@/libs/endpoints/furniture';

interface FurnitureQuoteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: Omit<FurnitureQuotePayload, 'product_id'>) => void;
  loading?: boolean;
}

const FurnitureQuoteModal: React.FC<FurnitureQuoteModalProps> = ({
  visible,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [formData, setFormData] = useState<Omit<FurnitureQuotePayload, 'product_id'>>({
    full_name: '',
    phone: '',
    email: '',
    delivery_address: '',
    preferred_contact: 'Call',
    note: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FurnitureQuotePayload, string>>>({});

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\+?[0-9]{7,15}$/.test(phone.replace(/\s/g, ''));

  const handleInputChange = (field: keyof Omit<FurnitureQuotePayload, 'product_id'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FurnitureQuotePayload]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleConfirm = () => {
    const newErrors: Partial<Record<keyof FurnitureQuotePayload, string>> = {};

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!validatePhone(formData.phone)) newErrors.phone = 'Valid phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } 
    onConfirm(formData);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl px-6 py-6 h-[85%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-poppins-bold text-secondary">Request a Quote</Text>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <InputField 
                label="Full Name" 
                value={formData.full_name} 
                onChangeText={(t: string) => handleInputChange('full_name', t)} 
                error={errors.full_name} 
                placeholder="John Doe" 
              />
              
              <InputField 
                label="Email Address" 
                value={formData.email} 
                onChangeText={(t: string) => handleInputChange('email', t)} 
                error={errors.email} 
                keyboardType="email-address" 
                placeholder="john@example.com" 
              />
              
              <InputField
                label="Phone Number"
                value={formData.phone}
                onChangeText={(t: string) => handleInputChange('phone', t)}
                error={errors.phone}
                keyboardType="phone-pad"
                placeholder="07032078859"
              />

              <InputField 
                label="Delivery Address (Optional)" 
                value={formData.delivery_address || ''} 
                onChangeText={(t: string) => handleInputChange('delivery_address', t)} 
                placeholder="Ikeja, Lagos" 
              />

              <Text className="text-sm font-poppins-medium text-gray-600 mb-2">Preferred Contact Method</Text>
              <View className="flex-row gap-2 mb-4">
                {['WhatsApp', 'Email'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleInputChange('preferred_contact', option)}
                    className={`px-4 py-2 rounded-full border ${formData.preferred_contact === option ? 'border-primary bg-primary' : 'border-gray-200 bg-gray-50'}`}
                  >
                    <Text className={`text-xs font-poppins ${formData.preferred_contact === option ? 'text-white' : 'text-gray-600'}`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <InputField 
                label="Additional Note (Optional)" 
                value={formData.note || ''} 
                onChangeText={(t: string) => handleInputChange('note', t)} 
                placeholder="Please confirm available colors and delivery timeline." 
                multiline
                numberOfLines={3}
                style={{ height: 100, textAlignVertical: 'top' }}
              />

              <View className="h-6" />
            </ScrollView>

            <TouchableOpacity 
              onPress={handleConfirm} 
              disabled={loading} 
              className={`py-4 rounded-xl mt-4 ${loading ? 'bg-gray-300' : 'bg-primary'}`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center text-lg font-poppins-bold">Submit Request</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const InputField = ({ label, error, style, ...props }: { label: string; error?: string; style?: any; [key: string]: any }) => (
  <View className="mb-4">
    <View className="flex-row justify-between">
      <Text className="text-sm font-poppins-medium text-gray-600 mb-2">{label}</Text>
      {error && <Text className="text-xs text-red-500 font-poppins">{error}</Text>}
    </View>
    <TextInput 
      className={`border rounded-xl px-4 py-4 text-base font-poppins text-black-300 bg-gray-50 ${error ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`} 
      style={style}
      placeholderTextColor="#9CA3AF"
      {...props} 
    />
  </View>
);

export default FurnitureQuoteModal;
