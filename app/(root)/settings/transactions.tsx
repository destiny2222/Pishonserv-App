import TopHeader from '@/components/TopHeader';
import { getTransactions, Transaction } from '@/libs/endpoints/transaction';
import { format, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState < Transaction[] > ([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('Dec.');
  const [selectedYear, setSelectedYear] = useState('2025');

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
            <TouchableOpacity className='flex-row items-center border border-gray-300 px-4 py-3 rounded-full'>
              <Text className='text-black text-lg font-poppins-medium mr-2'>{selectedMonth}</Text>
              <Text className='text-black text-lg font-poppins-medium'>▼</Text>
            </TouchableOpacity>

            <TouchableOpacity className='flex-row items-center border border-gray-300 px-4 py-3 rounded-full'>
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
            {transactions.map((transaction) => (
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
            {transactions.length === 0 && (
              <Text className="text-center text-gray-500 text-lg mt-10">No transactions found</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default TransactionHistory