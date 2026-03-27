import TopHeader from '@/components/TopHeader';
import { getTransactions, Transaction } from '@/libs/endpoints/transaction';
import { format, parseISO } from 'date-fns';
import React, { useEffect, useState, useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize with current month and year
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMM.'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const [isMonthModalVisible, setIsMonthModalVisible] = useState(false);
  const [isYearModalVisible, setIsYearModalVisible] = useState(false);

  useEffect(() => {
    const fetchTransactionsData = async () => {
      try {
        const data = await getTransactions();
        if (data && data.items) {
          setTransactions(data.items);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionsData();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = parseISO(t.created_at);
      const tMonth = format(date, 'MMM.');
      const tYear = format(date, 'yyyy');
      return tMonth === selectedMonth && tYear === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'completed':
      case 'successful':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-500';
      case 'declined':
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'd MMM. yyyy'); // "15 Dec. 2025"
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'hh:mma'); // "05:00PM"
    } catch {
      return "";
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const SelectionModal = ({ visible, data, onSelect, onClose, title }: any) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-t-3xl p-6 h-1/2">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-poppins-bold text-secondary">{title}</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={data}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className={`py-4 border-b border-gray-100 flex-row justify-between items-center`}
                  >
                    <Text className={`text-base font-poppins-medium text-gray-700`}>{item}</Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName='px-4 pb-8' >
        <TopHeader title='Transaction History' />
        {/* Filter Section */}
        <View className='flex-row justify-between items-center mb-6 mt-8'>
          <TouchableOpacity className='bg-primary px-8 py-3 rounded-lg' style={{ minWidth: 150 }} >
            <Text className='text-white font-semibold font-poppins-medium text-base text-center'>Export PDF</Text>
          </TouchableOpacity>

          <View className='flex-row gap-3'>
            <TouchableOpacity 
              onPress={() => setIsMonthModalVisible(true)}
              className='flex-row items-center border border-gray-300 px-4 py-3 rounded-full'
            >
              <Text className='text-black text-lg font-poppins-medium mr-2'>{selectedMonth}</Text>
              <Text className='text-black text-lg font-poppins-medium'>▼</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setIsYearModalVisible(true)}
              className='flex-row items-center border border-gray-300 px-4 py-3 rounded-full'
            >
              <Text className='text-black text-lg font-poppins-medium mr-2'>{selectedYear}</Text>
              <Text className='text-black text-lg font-poppins-medium'>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions List */}
        {loading ? (
          <View className='flex-1 justify-center items-center mt-10'>
            <ActivityIndicator size="large" color="#C9A24D" />
          </View>
        ) : (
          <View className='space-y-4'>
            {filteredTransactions.map((transaction) => (
              <View key={transaction.id} className='bg-white p-4 mb-5 rounded-lg border border-gray-100 shadow-sm'
                style={{
                  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05, shadowRadius: 2, elevation: 2
                }}
              >
                <View className='flex-row justify-between items-start mb-2'>
                  <Text className='text-secondary font-poppins-semibold font-semibold text-xl flex-1 mr-2'>
                    {transaction.description}
                  </Text>
                  <View className='items-end'>
                    <Text className='text-black text-lg font-poppins-medium'>
                      {formatDate(transaction.created_at)}
                    </Text>
                    <Text className='text-black text-lg font-poppins-medium'>
                      {formatTime(transaction.created_at)}
                    </Text>
                  </View>
                </View>

                <View className='flex-row items-center'>
                  <Text className='text-primary font-poppins-semibold font-bold text-lg mr-2'>
                    {formatCurrency(transaction.amount)}
                  </Text>
                  <Text className='text-black'>|</Text>
                  <Text className={`ml-2 font-medium capitalize ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </Text>
                </View>
              </View>
            ))}
            {filteredTransactions.length === 0 && (
              <Text className="text-center text-gray-500 text-lg mt-10">No transactions found for {selectedMonth} {selectedYear}</Text>
            )}
          </View>
        )}
      </ScrollView>

      <SelectionModal
        visible={isMonthModalVisible}
        data={months}
        onSelect={setSelectedMonth}
        onClose={() => setIsMonthModalVisible(false)}
        title="Select Month"
      />
      <SelectionModal
        visible={isYearModalVisible}
        data={years}
        onSelect={setSelectedYear}
        onClose={() => setIsYearModalVisible(false)}
        title="Select Year"
      />
    </SafeAreaView>
  )
}

export default TransactionHistory

