import { View, Text, Image } from 'react-native'
import React from 'react'

import { images } from '../constants'
import CustomButton from '../components/CustomButton'
import { router } from 'expo-router'

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className='justify-center items-center px-4'>
        <Image 
        source={images.empty}
        className='w-[200px] h-[150px]'
        resizeMode='contain'
        />

        <Text className="font-pmedium text-sm text-gray-100">{title}</Text>
        <Text className="text-2xl font-psemibold text-white">{subtitle}</Text>

        <CustomButton 
        title="Create Video"
        handlePress={() => router.push('/create')}
        containerStyles='my-5 w-full'
        />

    </View>
  )
}

export default EmptyState