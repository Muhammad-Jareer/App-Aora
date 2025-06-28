import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from "../../constants";
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router';
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from '../../context/GlobalProvider';

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {

  // Step 1: Create User

  if (!form.username || !form.email || !form.password) {
    Alert.alert("Error",  "Please fill in all the fields")
    return
  }

  setIsSubmitting(true)
  try {
    const result = await createUser(form.email.trim(), form.password.trim(), form.username.trim())
    
    setUser(result)
    setIsLoggedIn(true)

    router.replace('/home')
  } catch (error) {
    console.error("🚨 Error::", error.message);
    Alert.alert("Error", error.message);
  } finally {
    setIsSubmitting(false)
  }

};
 
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="w-full justify-center items-center h-full px-4 my-6">
          {/* Updated Logo Dimensions */}
          <Image 
            source={images.logo}
            resizeMode="contain"
            style={{ width: 140, height: 50 }} // ✅ Better aspect ratio
          />
          <Text className="text-2xl text-white mt-10 font-psemibold">Login to Aora </Text>
          
          <FormField 
          title="Username"
          value={form.username}
          handleChangeText={(e) => setForm({...form, username: e})}
          otherStyles="mt-7"
          placeholder="Muhammad Jareer"
          />
          
          <FormField 
          title="Email"
          value={form.email}
          handleChangeText={(e) => setForm({...form, email: e})}
          otherStyles="mt-7"
          keyboardType="email-address"
          placeholder="jareer@gmail.com"
          />
          
          <FormField 
          title="Password"
          value={form.password}
          handleChangeText={(e) => setForm({...form, password: e})}
          otherStyles="mt-7"
          placeholder="*********"
          />

          <CustomButton 
          title="Sign Up"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={isSubmitting}
          textStyles="text-white"
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">Already have an account</Text>
            <Link 
            href="/sign-in"
            className='text-lg font-psemibold text-secondary'
            >Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
