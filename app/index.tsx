import { Redirect, router } from "expo-router";
import { Image, ScrollView, Text, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function Index() {

  const {isLoading, isLoggedIn} = useGlobalContext();

  if(!isLoading && isLoggedIn) return <Redirect href="/home" />
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#161622" }}> 
      {/* Explicitly show the status bar */}
      <StatusBar barStyle="light-content" backgroundColor="#161622" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 }}>
          <Image 
            source={images.logo}
            style={{ width: 130, height: 84 }}
            resizeMode="contain"
          />

          <Image 
            source={images.cards}
            style={{ maxWidth: 380, width: "100%", height: 300 }}
            resizeMode="contain"
          />

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 32, fontWeight: "bold", color: "white", textAlign: "center" }}>
              Discover Endless Possibilities with {" "}<Text style={{ color: "#FFA001" }}>Aora</Text>
            </Text>

            <Image 
            source={images.path}
            className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
            resizeMode="contain"
            />
          </View>

          <Text className="text-md font-pregular text-gray-100 mt-7 text-center ">Where creativity meets innovation: embark on a journey of limitlesss exploration with Aora</Text>

          <CustomButton 
          title="Continue with Email"
          handlePress={() => {router.push('/sign-in')}}
          containerStyles="w-full mt-7"
          textStyles={undefined}
          isLoading={undefined}
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
