import Header from '@/components/Header'
import InverterComparisonSection from '@/components/InverterComparisonSection'
import images from '@/constants/images'
import { Activity, Award, CheckCircle, FileText, Gem, HandHeart, Leaf, Lightbulb, Medal, Play, Settings, ShieldCheck, ShoppingCart, Users, Zap } from 'lucide-react-native'
import React, { useState } from 'react'
import { Alert, Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SolarQuoteModal from '@/components/SolarQuoteModal'
import { submitSolarQuote, SolarQuotePayload } from '@/libs/endpoints/solar'
import CustomAlert from '@/components/CustomAlert'
import { StatusBar } from 'expo-status-bar'

function Solar() {
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleQuoteConfirm = async (data: SolarQuotePayload) => {
    setQuoteLoading(true);
    try {
      const response = await submitSolarQuote(data);
      if (response.status === "ok" && response.data.success) {
        setQuoteModalVisible(false);
        showAlert(
          "Request Submitted", 
          `Your solar quote request has been received!\n\nQuote ID: ${response.data.quote_id}\n\n${response.data.message || "We will contact you shortly."}`
        );
      } else {
        showAlert("Error", "Failed to submit quote request. Please try again.");
      }
    } catch (error: any) {
      showAlert("Error", error?.message || "An unexpected error occurred.");
    } finally {
      setQuoteLoading(false);
    }
  };

  const coreValues = [
    {
      title: 'Sustainability',
      description: 'We are deeply committed to eco-friendly practices in our solar energy solutions, actively contributing to a greener environment and protecting the planet for future generations.',
      icon: Leaf
    },
    {
      title: 'Innovation',
      description: 'We embrace technology and creativity, continuously seeking and delivering cutting-edge solar inverter solutions that not only meet but exceed contemporary energy demands.',
      icon: Lightbulb
    },
    {
      title: 'Excellence',
      description: 'We strive for superior quality in all our products and services. From the initial consultation to post-installation support, your satisfaction is our paramount concern.',
      icon: Award
    },
    {
      title: 'Integrity',
      description: 'We operate with unwavering transparency, honesty, and accountability in all aspects of our business, ensuring you receive trustworthy advice and service.',
      icon: ShieldCheck
    },
    {
      title: 'Community Impact',
      description: 'We are dedicated to improving the lives of the communities we serve. By promoting access to reliable and affordable solar energy solutions, we aim to create a positive and lasting impact.',
      icon: Users
    }
  ]

  const benefits = [
    {
      "id": 1,
      'title': "Uninterrupted Power Supply"
    },
    {
      "id": 2,
      "title": "Quiet & Clean Operation",
    },
    {
      "id":3,
      "title": "Appliance Protection",
    },
    {
      "id":4,
      "title":"Eco-Friendly Energy",
    },
    {
      "id": 5,
      "title": "Significant Cost Savings",
    },
    {
      "id": 6,
      "title": "Enhanced Comfort & Productivity"
    }
  ]

  const whyChooseUs = [
    {
      title: 'Unrivaled Expertise',
      description: 'Our team comprises highly skilled and certified professionals with extensive experience in solar energy solutions. We understand the intricacies of solar inverter systems and provide tailored solutions that perfectly match your needs.',
      icon: Zap
    },
    {
      title: 'Premium Quality Products',
      description: 'We partner with leading global manufacturers to supply only the highest quality solar panels, inverters, and batteries. Our products are rigorously tested for durability, efficiency, and performance, ensuring you get the best value for your investment.',
      icon: Gem
    },
    {
      title: 'Unwavering Customer Satisfaction',
      description: 'Your satisfaction is our priority. From the initial consultation and system design to installation and after-sales support, we are committed to providing a seamless and hassle-free experience. Our dedicated support team is always ready to assist you.',
      icon: CheckCircle
    },
    {
      title: 'Tailored Solutions',
      description: 'We understand that every energy need is unique. That\'s why we offer customized solar inverter solutions designed to meet your specific power requirements, budget, and lifestyle, ensuring optimal efficiency and cost-effectiveness.',
      icon: Lightbulb
    },
    {
      title: 'Comprehensive After-Sales Support',
      description: 'Our commitment to you extends beyond installation. We provide robust after-sales support, including maintenance services and technical assistance, to ensure your solar inverter system operates flawlessly for years to come.',
      icon: HandHeart
    },
    {
      title: 'Proven Track Record',
      description: 'With years of experience and countless successful installations across Nigeria, Pishonserv Solar Inverter Solutions has a verifiable track record of delivering reliable and efficient solar power solutions. Join our growing family of satisfied customers.',
      icon: Medal
    }
  ]

  const services = [
    { title: 'Sales of Premium Solar Inverters and Batteries', icon: ShoppingCart },
    { title: 'Professional Solar System Installation', icon: Settings },
    { title: 'Expert Load Calculation and Energy Assessment', icon: Activity },
    { title: 'Reliable Maintenance and Repair', icon: FileText },
  ]

  const detailedFeatures = [
    {
      title: 'Holistic Solar Power Solutions:',
      description: 'We offer integrated systems, guiding you from initial consultation and sales to professional installation and ongoing maintenance of your solar setup.'
    },
    {
      title: 'Rapid & Efficient Deployment:',
      description: 'Experience quick turnaround times from order placement to final installation, ensuring you get the solar power you need, precisely when you need it.'
    },
    {
      title: 'Superior Battery Technology:',
      description: 'We feature advanced, certified lithium batteries with extended lifespans and unparalleled performance, designed to integrate perfectly with solar charging.'
    },
    {
      title: 'Sustainable & Serene Energy:',
      description: 'Enjoy clean, silent, and environmentally friendly power, contributing to a healthier planet while enhancing your comfort through solar energy.'
    }
  ]

  const faqs = [
    {
      question: "Can inverter power my entire House?",
      answer: "Yes, it depends on the capacity."
    },
    {
      question: "Can I use inverter without solar?",
      answer: "Yes, inverter can be used without solar"
    },
    {
      question: "Can my freezer run on inverter 24/7?",
      answer: "Yes, with good back up system (battery)"
    },
    {
      question: "Can my inverter system supply the house even when the public supply is off and the inverter is on?",
      answer: "Yes, if the inverter is in on position"
    },
    {
      question: "What is the difference between inverter and solar?",
      answer: "Inverter produces light or electricity from the batteries while solar charges the battery using sun"
    },
    {
      question: "Can I go off grid?",
      answer: "Yes, if you have a large solar solution"
    }
  ]


  return (
    <SafeAreaView className='flex-1 bg-gray-200' edges={['left', 'right', 'top']} >
      <StatusBar style="dark" />
      <Header />
      <ScrollView className='flex-1' contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        <View className='w-full h-[400px] relative '>
          <ImageBackground source={images.heroSolar} resizeMode="cover" className='w-full h-full justify-center items-center'>
            <View className="absolute inset-0 bg-black/30" />
            <Text className='text-5xl font-semibold font-poppins-semibold text-white text-center'>Pishonserv Solar {"\n"} Inverter Solutions</Text>
            <Text className='text-white font-poppins-medium font-medium text-center text-lg'>
              Reliable Solar Power for Every Need
            </Text>
            <TouchableOpacity 
              onPress={() => setQuoteModalVisible(true)}
              className='bg-[#E6C975] px-10 py-5 rounded-full mt-6 shadow-md'
            >
              <Text className='text-secondary font-poppins-semibold font-bold text-xl'>Get free quote</Text>
            </TouchableOpacity>
            
          </ImageBackground>
        </View>
        <View className='px-5 pt-8'>
          <View className='pt-14'>
            <Text className='text-2xl font-semibold font-poppins-semibold mb-4'>About Us</Text>
            <Image source={images.aboutSolar} resizeMode='cover' className='w-full h-64' />
            <Text className='text-gray-700 font-poppins-regular font-normal mt-4 text-base'>
              Pishonserv Solar Inverter Solutions is a dedicated arm of Pishonserv, a diversified enterprise committed to transforming lives and communities through sustainable solutions. We are at the forefront of addressing Nigeria's energy challenges by providing innovative, reliable, and sustainable solar power solutions. Our unwavering commitment is to empower homes and businesses nationwide with consistent, affordable, and eco-friendly electricity generated from the sun.
              At Pishonserv, we believe reliable power is the bedrock of progress. Through Pishonserv Solar Inverter Solutions, we bring you cutting-edge solar technology combined with unparalleled service, ensuring you experience the future of energy today.
            </Text>
          </View>
          <View className="w-full h-[400px] relative pt-14">
            <ImageBackground source={images.mission} resizeMode="cover" className='w-full h-full justify-end pb-12 px-6 rounded-r-md'>
              <View className="absolute inset-0 bg-black/30" />
              <View className="relative z-10">
                <Text className='text-white text-4xl font-poppins-bold font-bold'>Mission &</Text>
                <Text className='text-white text-4xl font-poppins-bold font-bold'>Vision</Text>
              </View>
            </ImageBackground>
          </View>

          <View className='pt-8'>
            <View className='bg-white border-spacing-1.5 border-secondary rounded-xl p-6 shadow-sm mb-6'>
              <Text className='text-secondary text-xl font-poppins-bold font-bold mb-3'>Our Mission</Text>
              <Text className='text-gray-600 font-poppins-regular text-[15px] leading-6'>
                To be a globally recognized leader in sustainable solar energy solutions, delivering value through innovation, reliability, and excellence, and transforming everything we touch into lasting success.
              </Text>
            </View>

            <View className='bg-white border-spacing-1.5 border-secondary rounded-xl p-6 shadow-sm'>
              <Text className='text-secondary text-xl font-poppins-bold font-bold mb-3'>Our Vision</Text>
              <Text className='text-gray-600 font-poppins-regular text-[15px] leading-6'>
                To cultivate growth and prosperity by providing innovative, reliable, and sustainable solar inverter and power solutions that enhance lifestyles and support continuous operations for homes and businesses.
              </Text>
            </View>
          </View>

          <View className='w-full h-[400px] relative pt-14'>
            <ImageBackground source={images.coreValue} resizeMode="cover" className='w-full   justify-end p-10 px-5 rounded-r-md'>
              <View className="absolute inset-0 bg-black/40" />
              <View className="relative left-0 bottom-0  z-10 pt-32">
                <Text className='text-white text-4xl font-poppins-bold font-bold mb-4'>Our Core Values</Text>
                <Text className='text-white text-lg font-poppins-medium font-medium leading-6'>
                  At Pishonserv Solar Inverter Solutions, our operations are built upon the foundational values that define the entire Pishonserv brand
                </Text>
              </View>
            </ImageBackground>
          </View>

          <View className='pt-8 pb-10 flex-row flex-wrap justify-between gap-y-4'>
            {coreValues.map((value, index, arr) => (
            <View key={index} className={`bg-[#FFF2D0] rounded-xl p-6 ${index === arr.length - 1 ? 'w-full' : 'w-[48%]'}`}>
              <View className='items-center mb-4'>
                <value.icon size={32} color="black" strokeWidth={1.5} />
              </View>
              <Text className='text-center font-poppins-bold font-bold text-xl mb-2'>{value.title}</Text>
              <Text className='text-center font-poppins-medium font-medium text-xs text-gray-900 leading-5'>{value.description}</Text>
            </View>
            ))}
          </View>

          <View className='pt-8 pb-10'>
            <Text className='text-2xl font-poppins-bold font-bold text-secondary mb-6 leading-9'>
              Benefits of Pishonserv Solar Inverter Solutions
            </Text>
            {benefits.map((benefit) => (
              <View key={benefit.id} className='bg-white flex-row items-center p-5 rounded-xl mb-4 shadow-sm'>
                <Play size={16} color="#0D3B66" fill="#0D3B66" />
                <Text className='ml-4 text-secondary font-poppins-medium font-medium text-base'>{benefit.title}</Text>
              </View>
            ))}
          </View>
        </View>

        

        <View className='bg-[#E6C975] px-5 py-10'>
          <View className="px-5 mb-8 mt-4">
            <Image source={images.whyChooseUs} className="w-full h-56 rounded-xl" resizeMode="cover" />
          </View>
           <Text className='text-3xl font-poppins-bold font-bold text-white text-center mb-4'>Why Choose Solar Inverter?</Text>
           <Text className='text-white text-center font-poppins-regular leading-6 mb-8 text-sm'>
             In today's dynamic environment, consistent power is not a luxury, but a necessity. Pishonserv Solar Inverter Solutions offers a superior alternative to traditional energy sources, providing you with a reliable, efficient, and cost-effective power supply harnessed from the sun.
           </Text>

           <View className='bg-white rounded-xl p-6 mb-6'>
             <Text className='text-secondary text-lg font-poppins-bold font-bold mb-3 text-center'>Unrivaled Availability</Text>
             <Text className='text-gray-600 font-poppins-regular text-center leading-6 text-sm'>
               Due to the inconsistent public power supply in Nigeria, many homes and businesses have wisely chosen solar and inverter systems as the most reliable alternative for continuous power. Say goodbye to blackouts and enjoy uninterrupted electricity, day and night.
             </Text>
           </View>

           <View className='bg-white rounded-xl p-6 mb-6'>
             <Text className='text-secondary text-lg font-poppins-bold font-bold mb-3 text-center'>Economical in the Long Run</Text>
             <Text className='text-gray-600 font-poppins-regular text-center leading-6 text-sm'>
               While public power supplies can be costly (e.g., homes in "Band A" often pay an average of ₦50,000 every 3 days), opting for a solar solution is a smarter, more economical long-term investment. With a one-off setup, you can power your home or business with free energy from the sun, leading to significant savings over the years. Generally speaking, it is cheaper in the long run using solar infrastructure to generate your Energy over the years.
             </Text>
           </View>

           <View className='bg-white rounded-xl p-6 mb-6'>
             <Text className='text-secondary text-lg font-poppins-bold font-bold mb-3 text-center'>Stable & Reliable Voltage</Text>
             <Text className='text-gray-600 font-poppins-regular text-center leading-6 text-sm'>
               Unlike public supply, which can suffer from unpredictable voltage fluctuations (high or low) that risk damaging your valuable appliances, solar power systems provide a stable and reliable voltage. This ensures the longevity and safety of your electronics.
             </Text>
           </View>
        </View>

        <View className="px-5 py-10">
          <Text className='text-3xl font-poppins-bold font-bold text-secondary text-center mb-8'>Why Choose Pishonserv?</Text>
          {whyChooseUs.map((item, index) => (
            <View key={index} className='bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100 items-center'>
              <View className="mb-4">
                 <item.icon size={36} color="#CA8A04" strokeWidth={1.5} />
              </View>
              <Text className='text-secondary text-lg font-poppins-bold font-bold mb-3 text-center'>{item.title}</Text>
              <Text className='text-gray-600 font-poppins-regular text-center leading-6 text-xs'>{item.description}</Text>
            </View>
          ))}
        </View>

        <View className='bg-secondary px-5 py-12 items-center'>
          <Text className='text-white text-2xl font-poppins-bold font-bold text-center mb-4'>Ready to Embrace Sustainable Energy?</Text>
          <Text className='text-white/80 text-center font-poppins-regular mb-8 leading-6'>
            Contact Pishonserv Solar Inverter Solutions today for a free consultation and discover how we can empower your home or business with clean, reliable, and affordable solar power.
          </Text>
          <TouchableOpacity 
            onPress={() => setQuoteModalVisible(true)}
            className='bg-[#E6C975] px-8 py-3 rounded-full'
          >
            <Text className='text-secondary font-poppins-semibold font-bold text-base'>Get free quote</Text>
          </TouchableOpacity>
        </View>

        <View className='w-full h-[300px] relative overflow-hidden  mb-10'>
             <ImageBackground source={images.ourProduct} resizeMode="cover" className='w-full h-full justify-end '>
               <View className="absolute inset-0 bg-black/40 " />
               <View className="relative bottom-6 z-10 p-4">
                 <Text className='text-white text-3xl font-poppins-bold font-bold mb-4'>Our Products & Capacities</Text>
                 <View className='bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30'>
                   <Text className='text-white font-poppins-regular text-xs leading-5'>
                     Pishonserv Solar Inverter Solutions offers a comprehensive range of capacities to meet diverse energy needs, from essential home lighting to robust business operations, all integrated with efficient solar technology. Our expert team is also available to perform a free energy assessment and load calculation to help you determine the ideal solar inverter system for your specific requirements.
                   </Text>
                 </View>
               </View>
             </ImageBackground>
        </View>

        <View className='px-5 pb-10'>
          <Text className='text-2xl font-poppins-bold font-bold text-secondary mb-6'>Our Comprehensive Services</Text>
           <View className="flex-row flex-wrap justify-between gap-y-4">
            {services.map((service, index) => (
              <View key={index} className="w-[48%] bg-white rounded-xl p-5 items-center shadow-sm h-48 justify-center">
                <View className="w-14 h-14 rounded-full bg-secondary items-center justify-center mb-4">
                  <service.icon size={24} color="white" />
                </View>
                <Text className="text-center font-poppins-medium text-secondary text-xs leading-5">{service.title}</Text>
              </View>
            ))}
          </View>
          <View className="mt-8 rounded-xl overflow-hidden h-56 w-full">
            <Image source={images.services} className="w-full h-full" resizeMode="cover" />
          </View>
        </View>
        <InverterComparisonSection />

        {/* What Makes Pishonserv Different */}
        <View className='bg-white px-5 pt-12 pb-8'>
          <View className='bg-[#F8FAFC] rounded-2xl p-6 flex-row items-center border border-gray-100'>
            <View className='w-1/3 mr-4 items-center justify-center'>
              <View className='bg-[#FEF3C7] p-3 rounded-xl mb-3 border border-[#FDB022]'>
                <Zap size={28} color="#000" />
              </View>
              <View className='h-2 w-16 bg-gray-200 rounded-full mb-2' />
              <View className='h-2 w-12 bg-gray-200 rounded-full' />
            </View>
            <View className='flex-1'>
              <Text className='text-[#0D3B66] text-lg font-poppins-bold font-bold mb-2'>
                What Makes Pishonserv Different?
              </Text>
              <Text className='text-gray-600 font-poppins-regular text-xs leading-5'>
                Choosing Pishonserv Solar Inverter Solutions means opting for a partner that stands for excellence, reliability, and customer satisfaction in renewable energy.
              </Text>
            </View>
          </View>
        </View>

        {/* Detailed Features Section */}
        <View className='bg-[#0D3B66] px-5 py-12 mb-10'>
          {/* First Row */}
          <View className='flex-row mb-12'>
            <View className='flex-1 pr-4'>
              <View className='mb-8'>
                <Text className='text-[#FDB022] font-poppins-bold font-bold text-sm mb-2'>
                  {detailedFeatures[0].title}
                </Text>
                <Text className='text-white/90 font-poppins-regular text-xs leading-5'>
                  {detailedFeatures[0].description}
                </Text>
              </View>
              <View>
                <Text className='text-[#FDB022] font-poppins-bold font-bold text-sm mb-2'>
                  {detailedFeatures[1].title}
                </Text>
                <Text className='text-white/90 font-poppins-regular text-xs leading-5'>
                  {detailedFeatures[1].description}
                </Text>
              </View>
            </View>
            <View className='w-[40%]'>
              <Image source={images.holistic1} className='w-full h-60 rounded-xl' 
                resizeMode='cover'
              />
            </View>
          </View>

          {/* Second Row */}
          <View className='flex-row'>
            <View className='flex-1 pr-4'>
              <View className='mb-8'>
                <Text className='text-[#FDB022] font-poppins-bold font-bold text-sm mb-2'>
                  {detailedFeatures[2].title}
                </Text>
                <Text className='text-white/90 font-poppins-regular text-xs leading-5'>
                  {detailedFeatures[2].description}
                </Text>
              </View>
              <View>
                <Text className='text-[#FDB022] font-poppins-bold font-bold text-sm mb-2'>
                  {detailedFeatures[3].title}
                </Text>
                <Text className='text-white/90 font-poppins-regular text-xs leading-5'>
                  {detailedFeatures[3].description}
                </Text>
              </View>
            </View>
            <View className='w-[40%]'>
              <Image source={images.holistic2} className='w-full h-60 rounded-xl' 
                resizeMode='cover'
              />
            </View>
          </View>
        </View>

        <View className='px-5 py-12 bg-white mb-8'>
          <Text className='text-[#0D3B66] text-2xl font-poppins-bold font-bold text-center mb-8'>
            Frequently Asked Questions (FAQs)
          </Text>
          
          <View className='gap-y-4'>
            {faqs.map((faq, index) => (
              <View key={index} className='bg-white rounded-xl p-5 border border-gray-100 shadow-sm'>
                <View className='flex-row items-start mb-2'>
                  <View className='mt-1.5 mr-3'>
                    <Play size={10} color="#0D3B66" fill="#0D3B66" />
                  </View>
                  <Text className='text-[#0D3B66] font-poppins-bold font-bold flex-1 text-sm'>
                    {faq.question}
                  </Text>
                </View>
                <View className='pl-6'>
                  <Text className='text-[#0D3B66] font-poppins-bold font-bold text-xs mb-1'>
                    Answer:
                  </Text>
                  <Text className='text-[#0D3B66]/80 font-poppins-regular text-xs leading-5'>
                    {faq.answer}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <SolarQuoteModal 
        visible={quoteModalVisible}
        onClose={() => setQuoteModalVisible(false)}
        onConfirm={handleQuoteConfirm}
        loading={quoteLoading}
      />

      <CustomAlert 
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  )
}

export default Solar
