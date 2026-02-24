import CustomAlert from '@/components/CustomAlert'
import TextInputField from '@/components/TextInputField'
import TopHeader from '@/components/TopHeader'
import icons from '@/constants/icons'
import images from '@/constants/images'
import { useAuth } from '@/hooks/useAuth'
import { updateCurrentUser } from '@/libs/endpoints/auth'
import * as ImagePicker from 'expo-image-picker'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const EditProfile = () => {
    const { user, refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        lname: '',
        phone: '',
        profile_image: '',
    });
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                lname: user.lname || '',
                phone: user.phone || '',
                profile_image: user.profile_image || '',
            });
        }
    }, [user]);

    const handleEditImage = async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
            Alert.alert('Permission Required', 'Please allow access to your photos.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.6,
            allowsEditing: true,
            aspect: [1, 1],
            base64: true,
        });
        if (result.canceled || !result.assets[0]) return;
        const asset = result.assets[0];
        const base64Image = `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`;
        setUploadingImage(true);
        try {
            await updateCurrentUser({ profile_image: base64Image });
            await refreshUser();
            showAlert('Success', 'Profile image updated successfully!');
        } catch (e: any) {
            showAlert('Error', e?.data?.message || e?.message || 'Could not update profile image.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleChanges = async () => {
        setLoading(true);
        try {
            await updateCurrentUser(formData);
            // Sync the context with the latest server data
            await refreshUser();
            showAlert('Success', 'Profile updated successfully!');
        } catch (error: any) {
            const msg = error?.data?.message || error?.message || 'Failed to update profile.';
            showAlert('Error', msg);
        } finally {
            setLoading(false);
        }
    }
    return (
        <SafeAreaView className='h-full bg-white'>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1'>
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'
                    onScrollBeginDrag={Keyboard.dismiss}
                    contentContainerClassName='pb-32 px-2'>
                    <TopHeader title='Personal Profile' />
                    <View className='flex flex-col items-center relative mt-5'>
                        <View className='flex flex-col items-center'>
                            <View className='relative'>
                                <Image
                                    source={user?.profile_image ? { uri: user.profile_image } : images.avatar}
                                    className='size-44 rounded-full'
                                />
                                {uploadingImage && (
                                    <View className='absolute inset-0 rounded-full bg-black/40 items-center justify-center'>
                                        <ActivityIndicator color='#fff' size='large' />
                                    </View>
                                )}
                                <TouchableOpacity
                                    className='absolute bottom-1 right-1 bg-white rounded-full p-1 shadow'
                                    onPress={handleEditImage}
                                    disabled={uploadingImage}
                                >
                                    <Image source={icons.edit} className='size-7' />
                                </TouchableOpacity>
                            </View>
                            <Text className='pt-4 font-poppins-semibold text-2xl text-secondary font-semibold'>{user?.name} {user?.lname}</Text>
                        </View>
                    </View>

                    <View className='shadow-slate-50 shadow-sm mt-8 bg-slate-50 px-3 pt-8 pb-10 rounded-2xl'>
                        <View className='space-y-6 w-full px-4 mt-10'>
                            <Text className='font-poppins-medium text-xl mb-2 '>First Name</Text>
                            <TextInputField
                                secureTextEntry={false}
                                onChangeText={text => setFormData({ ...formData, name: text })}
                                value={formData.name}
                                className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
                            />
                        </View>
                        <View className='space-y-6 w-full px-4 mt-10'>
                            <Text className='font-poppins-medium text-xl mb-2 '>Last Name</Text>
                            <TextInputField
                                secureTextEntry={false}
                                onChangeText={text => setFormData({ ...formData, lname: text })}
                                value={formData.lname}
                                className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
                            />
                        </View>
                        <View className='space-y-6 w-full px-4 mt-10'>
                            <Text className='font-poppins-medium text-base mb-2'>Email</Text>
                            <TextInputField
                                keyboardType='email-address'
                                secureTextEntry={false}
                                className="border focus:border-primary border-gray-300 bg-gray-100 text-base font-poppins-medium"
                                value={user?.email || ''}
                                editable={false}
                            />
                        </View>
                        <View className='space-y-6 w-full px-4 mt-10'>
                            <Text className='font-poppins-medium text-xl mb-2 '>Phone</Text>
                            <TextInputField
                                secureTextEntry={false}
                                onChangeText={text => setFormData({ ...formData, phone: text })}
                                value={formData.phone}
                                className="border focus:border-primary border-gray-300 bg-white text-base font-poppins-medium"
                            />
                        </View>
                        <TouchableOpacity
                            className='w-60 py-5 justify-center mx-auto items-center mt-10'
                            style={{ backgroundColor: '#C9A24D', paddingVertical: 16, borderRadius: 12, alignItems: 'center', opacity: loading ? 0.7 : 1 }}
                            onPress={handleChanges}
                            disabled={loading}
                        >
                            <Text className='text-white font-poppins-semibold font-semibold text-lg'>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
        </SafeAreaView>
    )
}

export default EditProfile