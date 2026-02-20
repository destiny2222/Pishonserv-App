import AgentHeader from '@/components/AgentHeader';
import CustomAlert from '@/components/CustomAlert';
import icons from '@/constants/icons';
import { getWalletBalance, WalletBalanceData } from '@/libs/endpoints/agent/walletBalance';
import { BankAccount, getBankAccounts } from '@/libs/endpoints/bankAccounts';
import { confirmWithdrawal, initWithdrawal } from '@/libs/endpoints/withdrawals';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/useAuth';

const Earnings = () => {
    const { user } = useAuth();
    const [balanceData, setBalanceData] = useState < WalletBalanceData > ({ balance: 0 });
    const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [otp, setOtp] = useState('');
    const [selectedBank, setSelectedBank] = useState < BankAccount | null > (null);
    const [bankAccounts, setBankAccounts] = useState < BankAccount[] > ([]);
    const [loading, setLoading] = useState(false);
    const [fetchingBanks, setFetchingBanks] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [step, setStep] = useState < 1 | 2 > (1); // 1: Init, 2: Confirm

    // Custom Alert State
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    useEffect(() => {
        fetchBalance();
        fetchBankAccounts();
    }, []);

    const fetchBalance = async () => {
        try {
            const data = await getWalletBalance();
            setBalanceData(data);
        } catch (error) {
            // console.error("Failed to fetch wallet balance", error);
        }
    };

    const fetchBankAccounts = async () => {
        setFetchingBanks(true);
        try {
            const data = await getBankAccounts();
            if (data) {
                setBankAccounts(data);
                if (data.length > 0) {
                    setSelectedBank(data[0]);
                }
            }
        } catch (error: any) {
            // console.error("Failed to fetch bank accounts", error);
            if (error?.status === 403) {
                showAlert("Access Denied", "You do not have permission to access bank accounts. Please ensure you are logged in as an Agent or Owner.");
            }
        } finally {
            setFetchingBanks(false);
        }
    };

    const handleRedirect = async () => {
        router.replace('/managebankaccount');
    };

    const handleInitWithdraw = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            showAlert("Error", "Please enter a valid amount");
            return;
        }
        if (Number(amount) > balanceData.balance) {
            showAlert("Error", "Insufficient balance");
            return;
        }
        if (!selectedBank) {
            showAlert("Error", "Please select a bank account");
            return;
        }

        setLoading(true);
        try {
            const response = await initWithdrawal({
                amount: Number(amount),
                bank_account_id: selectedBank.id,
            });

            if (response && response.status === 'ok') {
                showAlert("OTP Sent", "An OTP has been sent to your email.");
                setStep(2);
            } else {
                showAlert("Error", "Failed to initiate withdrawal. Please try again.");
            }
        } catch (error: any) {
            showAlert("Error", error?.message || "Failed to initiate withdrawal");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmWithdraw = async () => {
        if (!otp || otp.length < 4) {
            showAlert("Error", "Please enter a valid OTP");
            return;
        }
        if (!selectedBank) return;

        setLoading(true);
        try {
            const response = await confirmWithdrawal({
                amount: Number(amount),
                bank_account_id: selectedBank.id,
                otp: otp,
            });

            if (response && response.status === 'ok') {
                showAlert("Success", "Withdrawal confirmed successfully!");
                setWithdrawModalVisible(false);
                setAmount('');
                setOtp('');
                setStep(1);
                fetchBalance(); // Refresh balance
            } else {
                showAlert("Error", "Withdrawal failed. Please try again.");
            }
        } catch (error: any) {
            showAlert("Error", error?.message || "Failed to confirm withdrawal");
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setWithdrawModalVisible(false);
        setStep(1);
        setOtp('');
        // Keep amount/bank selected for convenience if re-opening? Or reset? 
        // Let's keep them.
    };

    const formatCurrency = (amount: number) => {
        return `N${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <AgentHeader />
            <ScrollView className='px-4 mt-4' showsVerticalScrollIndicator={false}>
                <View className='mb-4 mt-4'>
                    <Text className='text-secondary font-poppins-semibold font-semibold text-2xl'>My Earnings</Text>
                </View>

                <View className='bg-white shadow-sm px-5 py-6 mb-5 border border-gray-100 rounded-2xl'>
                    <View className="flex-row items-center gap-2 mb-2">
                        <Image source={icons.wallet} className='w-6 h-6' resizeMode='contain' tintColor="#C9A24D" />
                        <Text className='font-semibold font-poppins-semibold text-xl text-secondary'>Wallet Balance</Text>
                    </View>
                    <View className='mt-4'>
                        <Text className='font-bold font-poppins-bold text-4xl text-primary'>{formatCurrency(balanceData.balance)}</Text>
                    </View>
                </View>

                <View className='flex-row gap-4 mb-4'>
                    <TouchableOpacity
                        className="flex-1 bg-primary p-4 rounded-xl shadow-lg shadow-primary/30"
                        onPress={() => setWithdrawModalVisible(true)}
                    >
                        <Text className='font-poppins-bold font-bold text-white text-center text-lg'>Withdraw</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 bg-white border border-gray-200 p-4 rounded-xl"
                        onPress={handleRedirect}
                    >
                        <Text className='font-poppins-semibold font-semibold text-secondary text-center text-base'>Manage Banks</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Withdrawal Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={withdrawModalVisible}
                onRequestClose={handleModalClose}
            >
                <Pressable className="flex-1 bg-black/50 justify-end" onPress={handleModalClose}>
                    <Pressable className="bg-white rounded-t-3xl px-6 py-8 h-[75%]" onPress={(e) => e.stopPropagation()}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-poppins-bold text-secondary">
                                {step === 1 ? "Withdraw Funds" : "Confirm Withdrawal"}
                            </Text>
                            <TouchableOpacity onPress={handleModalClose}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {step === 1 && (
                                <>
                                    {/* Amount Input */}
                                    <Text className="font-poppins-medium text-gray-600 mb-2">Amount</Text>
                                    <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3 mb-6 bg-gray-50">
                                        <Text className="text-gray-500 font-poppins-medium text-lg mr-2">₦</Text>
                                        <TextInput
                                            className="flex-1 font-poppins-semibold text-lg text-secondary"
                                            placeholder="0.00"
                                            keyboardType="numeric"
                                            value={amount}
                                            onChangeText={setAmount}
                                        />
                                    </View>

                                    {/* Bank Selection */}
                                    <Text className="font-poppins-medium text-gray-600 mb-2">Select Bank</Text>
                                    <TouchableOpacity
                                        className="flex-row justify-between items-center border border-gray-200 rounded-xl px-4 py-4 mb-6 bg-white"
                                        onPress={() => setDropdownVisible(!dropdownVisible)}
                                    >
                                        <Text className={`font-poppins-medium text-base ${selectedBank ? 'text-secondary' : 'text-gray-400'}`}>
                                            {selectedBank ? `${selectedBank.bank_name} - ${selectedBank.account_number}` : "Select Bank Account"}
                                        </Text>
                                        <Ionicons name={dropdownVisible ? "chevron-up" : "chevron-down"} size={20} color="#666" />
                                    </TouchableOpacity>

                                    {dropdownVisible && (
                                        <View className="border border-gray-100 rounded-xl mb-6 bg-gray-50 overflow-hidden">
                                            {fetchingBanks ? (
                                                <ActivityIndicator size="small" color="#C9A24D" className="py-4" />
                                            ) : bankAccounts.length > 0 ? (
                                                bankAccounts.map((bank) => (
                                                    <TouchableOpacity
                                                        key={bank.id}
                                                        className="px-4 py-3 border-b border-gray-100 last:border-0"
                                                        onPress={() => {
                                                            setSelectedBank(bank);
                                                            setDropdownVisible(false);
                                                        }}
                                                    >
                                                        <Text className="font-poppins-medium text-secondary">{bank.bank_name}</Text>
                                                        <Text className="text-gray-500 text-sm">{bank.account_number} • {bank.account_name}</Text>
                                                    </TouchableOpacity>
                                                ))
                                            ) : (
                                                <View className="py-4 px-4">
                                                    <Text className="text-gray-500 text-center mb-2">No bank accounts found.</Text>
                                                    <TouchableOpacity onPress={() => { setWithdrawModalVisible(false); router.push('/managebankaccount'); }}>
                                                        <Text className="text-primary font-poppins-medium text-center">Add Bank Account</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                    )}

                                    <TouchableOpacity
                                        className={`bg-primary rounded-xl py-4 items-center shadow-lg shadow-primary/30 ${loading ? 'opacity-70' : ''}`}
                                        onPress={handleInitWithdraw}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text className="text-white font-poppins-bold text-lg">Next</Text>
                                        )}
                                    </TouchableOpacity>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <Text className="text-gray-500 font-poppins text-base mb-6">
                                        You are about to withdraw <Text className="font-bold text-secondary">₦{Number(amount).toLocaleString()}</Text> to your <Text className="font-bold text-secondary">{selectedBank?.bank_name}</Text> account.
                                    </Text>
                                    {/* OTP Input */}
                                    <Text className="font-poppins-medium text-gray-600 mb-2">Enter OTP</Text>
                                    <Text className="text-xs text-gray-400 mb-2">Please enter the OTP sent to your registered contact.</Text>
                                    <TextInput
                                        className="border border-gray-200 rounded-xl px-4 py-3 mb-8 bg-gray-50 font-poppins-medium text-lg text-secondary text-center tracking-widest"
                                        placeholder="Enter OTP"
                                        keyboardType="number-pad"
                                        value={otp}
                                        onChangeText={setOtp}
                                        maxLength={6}
                                    />

                                    {/* Submit Button */}
                                    <TouchableOpacity
                                        className={`bg-primary rounded-xl py-4 items-center shadow-lg shadow-primary/30 ${loading ? 'opacity-70' : ''}`}
                                        onPress={handleConfirmWithdraw}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text className="text-white font-poppins-bold text-lg">Confirm Withdrawal</Text>
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className="mt-4 py-2"
                                        onPress={() => setStep(1)}
                                        disabled={loading}
                                    >
                                        <Text className="text-gray-500 text-center font-poppins-medium">Back</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>

            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
        </SafeAreaView>
    );
};

export default Earnings;