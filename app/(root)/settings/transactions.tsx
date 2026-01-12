import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopHeader from '@/components/TopHeader';
import { format, parseISO } from 'date-fns'; 

interface Transaction {
  id: string;
  propertyName: string;
  amount: string;
  status: 'Successful' | 'Pending' | 'Declined';
  date: string;
  time: string;
}

const transactionsData: Transaction[] = [
  {
    id: '1',
    propertyName: 'Jenny Hotels and Rentage',
    amount: '₦125,000',
    status: 'Successful',
    date: '2025-12-03T17:00:00',
    time: '05:00PM'
  },
  {
    id: '2',
    propertyName: 'Luxurious Family House',
    amount: '₦5,000,000',
    status: 'Successful',
    date: '2025-12-03T17:00:00',
    time: '12:07PM'
  },
  {
    id: '3',
    propertyName: 'Jenny Hotels and Rentage',
    amount: '₦100,000',
    status: 'Pending',
    date: '2025-12-03T17:00:00',
    time: '1:34PM'
  },
  {
    id: '4',
    propertyName: 'Jenny Hotels and Rentage',
    amount: '₦125,000',
    status: 'Declined',
    date: '2025-12-03T17:00:00',
    time: '05:32PM'
  },
  {
    id: '5',
    propertyName: 'Josie Special Hotels',
    amount: '₦155,000',
    status: 'Successful',
    date: '2025-12-03T17:00:00',
    time: '05:00PM'
  },
  {
    id: '6',
    propertyName: 'Jenny Hotels and Rentage',
    amount: '₦125,000',
    status: 'Successful',
    date: '2025-12-03T17:00:00',
    time: '05:00PM'
  }
];


const TransactionHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState('Dec.');
  const [selectedYear, setSelectedYear] = useState('2025');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Successful':
        return 'text-green-600';
      case 'Pending':
        return 'text-yellow-500';
      case 'Declined':
        return 'text-red-500';
      default:
        return 'text-gray-600';
    }
  };

    const formatDate = (dateString: string) => {
        const date = parseISO(dateString);
        return format(date, 'd MMM. yyyy'); // "15 Dec. 2025"
    };

    const formatTime = (dateString: string) => {
        const date = parseISO(dateString);
        return format(date, 'hh:mma'); // "05:00PM"
    };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView  showsVerticalScrollIndicator={false}  contentContainerClassName='px-4 pb-8' >
        <TopHeader title='Transaction History' />
        {/* Filter Section */}
        <View className='flex-row justify-between items-center mb-6 mt-8'>
          <TouchableOpacity   className='bg-primary px-8 py-3 rounded-lg'  style={{ minWidth: 150 }} >
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
        <View className='space-y-4'>
          {transactionsData.map((transaction) => (
            <View   key={transaction.id} className='bg-white p-4 mb-5 rounded-lg border border-gray-100 shadow-sm'
              style={{  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,  shadowRadius: 2,   elevation: 2
              }}
            >
              <View className='flex-row justify-between items-start mb-2'>
                <Text className='text-secondary font-poppins-semibold font-semibold text-xl flex-1'>
                  {transaction.propertyName}
                </Text>
                <View className='items-end'>
                  <Text className='text-black text-lg font-poppins-medium'>
                    {formatDate(transaction.date)}
                  </Text>
                  <Text className='text-black text-lg font-poppins-medium'>
                    {formatTime(transaction.date)}
                  </Text>
                </View>
              </View>

              <View className='flex-row items-center'>
                <Text className='text-primary font-poppins-semibold font-bold text-lg mr-2'>
                  {transaction.amount}
                </Text>
                <Text className='text-black'>|</Text>
                <Text className={`ml-2 font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TransactionHistory