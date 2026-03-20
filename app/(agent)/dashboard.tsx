import AgentHeader from '@/components/AgentHeader'
import EarningsChartCard from '@/components/EarningsChartCard'
import icons from '@/constants/icons'
import { useAuth } from '@/hooks/useAuth'
import { getSummary, SummaryData } from '@/libs/endpoints/agent/summary'
import { getTransactions, Transaction } from '@/libs/endpoints/transaction'
import { format, isSameMonth, parseISO, subMonths } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
    const { user } = useAuth()
    const [summary, setSummary] = useState < SummaryData > ({
        role: "",
        wallet_balance: 0,
        properties: 0,
        bookings: 0,
        earnings: 0
    });
    const [chartData, setChartData] = useState < {
        labels: string[];
        datasets: { data: number[] }[];
    } | undefined > (undefined);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryData, transactionsData] = await Promise.all([
                    getSummary(),
                    getTransactions()
                ]);
                setSummary(summaryData);

                if (transactionsData && transactionsData.items) {
                    processChartData(transactionsData.items);
                }
            } catch (error) {

            }
        };
        fetchData();
    }, []);

    const processChartData = (transactions: Transaction[]) => {
        const today = new Date();
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const date = subMonths(today, 5 - i);
            return {
                label: format(date, 'MMM'),
                date: date,
                value: 0
            };
        });

        transactions.forEach(t => {
            if (t.type === 'credit' && (t.status.toLowerCase() === 'successful' || t.status.toLowerCase() === 'completed')) {
                try {
                    const tDate = parseISO(t.created_at);
                    const monthIndex = last6Months.findIndex(m => isSameMonth(m.date, tDate));
                    if (monthIndex !== -1) {
                        last6Months[monthIndex].value += t.amount;
                    }
                } catch (e) {

                }
            }
        });

        setChartData({
            labels: last6Months.map(m => m.label),
            datasets: [{
                data: last6Months.map(m => m.value / 1000) // Divide by 1000 to match 'k' suffix
            }]
        });
    }

    const formatCurrency = (amount: number) => {
        return `N${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    return (
        <SafeAreaView className='bg-[#f9fafb]'>
            <AgentHeader />
            <ScrollView className='mt-4 px-4 mb-20'>
                <View className='py-5'>
                    <Text className='font-poppins-light font-light py-1'>Welcome!</Text>
                    <Text className=' text-black font-poppins-semibold font-semibold text-xl'>{user?.name} {user?.lname}</Text>
                </View>
                <View className='bg-white shadow-sm px-5 py-6   mb-5'>
                    <Image source={icons.wallet} className='w-6 h-6 size-5' resizeMode='contain' />
                    <Text className='font-semibold font-poppins-semibold text-xl'>Wallet Balance</Text>
                    <View className='mt-8'>
                        <Text className='font-semibold font-poppins-semibold text-4xl text-primary'>{formatCurrency(summary.wallet_balance)}</Text>
                    </View>
                </View>
                <View className='bg-white shadow-sm px-5 py-6   mb-5'>
                    <Image source={icons.wallet} className='w-6 h-6 size-5' resizeMode='contain' />
                    <Text className='font-semibold font-poppins-semibold text-xl'>Total Earnings</Text>
                    <View className='mt-8'>
                        <Text className='font-semibold font-poppins-semibold text-4xl text-primary'>{formatCurrency(summary.earnings)}</Text>
                    </View>
                </View>
                <View className='flex-row justify-center items-center gap-5 mb-4'>
                    <View className="flex-row gap-4">
                        <View className="flex-1 bg-white shadow-sm rounded-xl p-5 h-[135px]">
                            <Image source={icons.wallet} className="w-6 h-6" resizeMode="contain" />
                            <Text className="font-poppins-semibold text-base mt-2">Total Properties</Text>
                            <Text className="font-poppins-semibold text-2xl text-primary mt-auto">{summary.properties}</Text>
                        </View>

                        <View className="flex-1 bg-white shadow-sm rounded-xl p-5 h-[135px]">
                            <Image source={icons.wallet} className="w-6 h-6" resizeMode="contain" />
                            <Text className="font-poppins-semibold text-base mt-2">Pending Inquiries</Text>
                            <Text className="font-poppins-semibold text-2xl text-primary mt-auto">{summary.bookings}</Text>
                        </View>
                    </View>
                </View>
                <EarningsChartCard totalEarnings={summary.earnings} chartData={chartData} />
                <View className='bg-white shadow-sm px-5 py-6   mb-5'>
                    <Image source={icons.task} className='w-6 h-6 size-5 mb-4' resizeMode='contain' />
                    <Text className='font-semibold font-poppins-semibold text-xl'>Wallet Balance</Text>
                    <View className='mt-8'>
                        <Text className='font-semibold font-poppins-semibold text-sm text-black'>No tasks assigned</Text>
                    </View>
                </View>
                <View className='bg-white shadow-sm px-5 py-6   mb-5'>
                    <Image source={icons.line} className='w-6 h-6 size-5 mb-4' resizeMode='contain' />
                    <Text className='font-semibold font-poppins-semibold text-2xl'>Recent Activities</Text>
                    <View className='mt-8'>
                        <Text className='font-semibold font-poppins-semibold text-sm text-black'>No recent activities</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home