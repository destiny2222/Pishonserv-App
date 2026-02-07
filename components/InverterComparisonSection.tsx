import { DollarSign, Home, Leaf, Zap } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'
import images from '@/constants/images'

interface CapacitySpec {
  label: string
  value: string | number
}

interface InverterCapacity {
  capacity: string
  specs: CapacitySpec[]
  tubular: string
  lithium: string
}

const InverterComparisonSection = () => {
  const inverterCapacities: InverterCapacity[] = [
    {
      capacity: '1KVA',
      specs: [
        { label: 'Max Bulbs:', value: 15 },
        { label: 'Max Fans:', value: 3 },
        { label: 'Max TVs:', value: 1 },
        { label: 'Max Laptops:', value: 1 },
        { label: 'Max Fridges:', value: '-' },
        { label: 'Max Freezers:', value: '-' },
        { label: 'Max A/C (HP):', value: '-' },
      ],
      tubular: 'N/A',
      lithium: 'N/A'
    },
    {
      capacity: '1.5KVA',
      specs: [
        { label: 'Max Bulbs:', value: 22 },
        { label: 'Max Fans:', value: 5 },
        { label: 'Max TVs:', value: 2 },
        { label: 'Max Laptops:', value: 1 },
        { label: 'Max Fridges:', value: '-' },
        { label: 'Max Freezers:', value: '-' },
        { label: 'Max A/C (HP):', value: '-' },
      ],
      tubular: 'N/A',
      lithium: 'N/A'
    },
    {
      capacity: '2KVA',
      specs: [
        { label: 'Max Bulbs:', value: 22 },
        { label: 'Max Fans:', value: 5 },
        { label: 'Max TVs:', value: 2 },
        { label: 'Max Laptops:', value: 1 },
        { label: 'Max Fridges:', value: 1 },
        { label: 'Max Freezers:', value: '-' },
        { label: 'Max A/C (HP):', value: '-' },
      ],
      tubular: 'N/A',
      lithium: 'N/A'
    },
    {
      capacity: '2.5KVA',
      specs: [
        { label: 'Max Bulbs:', value: 25 },
        { label: 'Max Fans:', value: 8 },
        { label: 'Max TVs:', value: 4 },
        { label: 'Max Laptops:', value: 4 },
        { label: 'Max Fridges:', value: 1 },
        { label: 'Max Freezers:', value: '-' },
        { label: 'Max A/C (HP):', value: '-' },
      ],
      tubular: 'N/A',
      lithium: 'N/A'
    },
    {
      capacity: '3.5KVA',
      specs: [
        { label: 'Max Bulbs:', value: 30 },
        { label: 'Max Fans:', value: 10 },
        { label: 'Max TVs:', value: 4 },
        { label: 'Max Laptops:', value: 4 },
        { label: 'Max Fridges:', value: 1 },
        { label: 'Max Freezers:', value: 1 },
        { label: 'Max A/C (HP):', value: '-' },
      ],
      tubular: 'N/A',
      lithium: 'N/A'
    },
    {
      capacity: '5KVA',
      specs: [
        { label: 'Max Bulbs:', value: 40 },
        { label: 'Max Fans:', value: 10 },
        { label: 'Max TVs:', value: 5 },
        { label: 'Max Laptops:', value: 5 },
        { label: 'Max Fridges:', value: 1 },
        { label: 'Max Freezers:', value: 2 },
        { label: 'Max A/C (HP):', value: '1/2 or 2/2' },
      ],
      tubular: 'N/A',
      lithium: 'N/A'
    },
    {
      capacity: '10KVA',
      specs: [
        { label: 'Max Bulbs:', value: 55 },
        { label: 'Max Fans:', value: 15 },
        { label: 'Max TVs:', value: 10 },
        { label: 'Max Laptops:', value: 10 },
        { label: 'Max Fridges:', value: 2 },
        { label: 'Max Freezers:', value: 4 },
        { label: 'Max A/C (HP):', value: 3 },
      ],
      tubular: 'N/A',
      lithium: 'N/A'
    },
    {
      capacity: '15KVA',
      specs: [
        { label: 'Max Bulbs:', value: 68 },
        { label: 'Max Fans:', value: 25 },
        { label: 'Max TVs:', value: 15 },
        { label: 'Max Laptops:', value: 15 },
        { label: 'Max Fridges:', value: 4 },
        { label: 'Max Freezers:', value: 8 },
        { label: 'Max A/C (HP):', value: 5 },
      ],
      tubular: 'N/A',
      lithium: 'N/A'
    }
  ]

  const scaleCategories = [
    {
      title: 'Small Scale',
      description: '1KVA - 2KVA suitable for basic lighting and small appliances'
    },
    {
      title: 'Medium Scale',
      description: '2.5KVA - 5KVA ideal for homes with refrigeration needs'
    },
    {
      title: 'Large Scale',
      description: '10KVA - 15KVA perfect for commercial or large residential use'
    }
  ]

  const features = [
    {
      icon: Leaf,
      title: 'Eco-Friendly Energy',
      description: 'Harness the power of the sun to reduce your carbon footprint and contribute to a greener planet.'
    },
    {
      icon: DollarSign,
      title: 'Significant Cost Savings',
      description: 'Lower your electricity bills drastically with sustainable solar energy solutions customized for you.'
    },
    {
      icon: Home,
      title: 'Enhanced Comfort',
      description: 'Enjoy uninterrupted power supply and the convenience of a reliable energy backup system.'
    }
  ]

  return (
      <View className='bg-purple-800 px-5 py-12'>
        {/* Header */}
        <Text className='text-white text-3xl font-poppins-bold font-bold text-center mb-2'>
          Solar Inverter Comparison
        </Text>
        <Text className='text-white/90 text-center font-poppins-regular mb-8 text-sm'>
          Compare specifications and pricing for different inverter capacities
        </Text>
  
        {/* Grid Cards */}
        <View className='flex-row flex-wrap justify-between mb-8'>
          {inverterCapacities.map((inverter, index) => (
            <View 
              key={index} 
              className='bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/20'
              style={{ width: '48%' }}
            >
              {/* Capacity Header */}
              <View className='bg-white/20 rounded-xl py-2 mb-3'>
                <Text className='text-white text-xl font-poppins-bold font-bold text-center'>
                  {inverter.capacity}
                </Text>
              </View>
  
              {/* Specifications */}
              <View className='mb-3'>
                {inverter.specs.map((spec, specIndex) => (
                  <View key={specIndex} className='flex-row justify-between mb-1.5'>
                    <Text className='text-white/80 font-poppins-regular text-[10px]'>
                      {spec.label}
                    </Text>
                    <Text className='text-white font-poppins-semibold text-[10px]'>
                      {spec.value}
                    </Text>
                  </View>
                ))}
              </View>
  
              {/* Battery Types */}
              <View className='border-t border-white/20 pt-3'>
                <View className='flex-row justify-between mb-1.5'>
                  <Text className='text-white/80 font-poppins-regular text-[10px]'>Tubular:</Text>
                  <Text className='text-white font-poppins-semibold text-[10px]'>{inverter.tubular}</Text>
                </View>
                <View className='flex-row justify-between'>
                  <Text className='text-white/80 font-poppins-regular text-[10px]'>Lithium:</Text>
                  <Text className='text-white font-poppins-semibold text-[10px]'>{inverter.lithium}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
  
        {/* Comparison Summary */}
        <View className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
          <Text className='text-white text-xl font-poppins-bold font-bold text-center mb-6'>
            Inverter Comparison Summary
          </Text>
          
          <View className='flex-row justify-between pt-2'>
            {scaleCategories.map((category, index) => (
              <View key={index} className='flex-1 px-1'>
                <Text className='text-white font-poppins-bold font-bold text-sm text-center mb-3'>
                  {category.title}
                </Text>
                <Text className='text-white/90 font-poppins-regular text-[10px] text-center leading-4'>
                  {category.description}
                </Text>
              </View>
            ))}
          </View>
        </View>
  
        {/* What Makes Pishonserv Different */}
        <View className='bg-white rounded-2xl p-6 mt-8'>
          <View className='items-center mb-6'>
            <View className='bg-[#FDB022] rounded-2xl p-4 mb-3'>
              <Zap size={32} color="white" fill="white" />
            </View>
            <Text className='text-[#0D3B66] text-xl font-poppins-bold font-bold text-center mb-3'>
              What Makes Pishonserv Different?
            </Text>
          </View>
          
          <View className='space-y-4 mb-6'>
            {features.map((feature, index) => (
              <View key={index} className='flex-row items-center bg-gray-50 p-4 rounded-xl border border-gray-100'>
                <View className='bg-blue-100 p-2 rounded-full mr-3'>
                  <feature.icon size={20} color="#0D3B66" />
                </View>
                <View className='flex-1'>
                  <Text className='text-[#0D3B66] font-poppins-bold font-bold text-sm mb-1'>
                    {feature.title}
                  </Text>
                  <Text className='text-gray-600 font-poppins-regular text-xs leading-4'>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
  
          <Text className='text-[#0D3B66] font-poppins-regular text-xs text-center leading-5'>
            Choosing Pishonserv Solar Inverter Solutions means opting for a partner that stands for excellence, reliability, and customer satisfaction in renewable energy.
          </Text>
        </View>
      </View>
    )
  }
  
  export default InverterComparisonSection