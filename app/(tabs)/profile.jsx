import React, { useEffect } from 'react';
import { StatusBar, FlatList, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import VideoCard from '../../components/VideoCard';
import EmptyState from '../../components/EmptyState';
import InfoBox from '../../components/InfoBox';
import { getUserPosts, signOutUser } from "../../lib/appwrite";
import { router } from 'expo-router';
import useAppwrite from "../../lib/useAppwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => user ? getUserPosts(user.$id) : Promise.resolve([]));
  
  useEffect(() => {
    refetch()
  }, [posts])
  
  const handleLogout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setIsLoggedIn(false);
      router.replace('/sign-in');
    } catch (error) {
      Alert.alert('Error', "Failed to logout. Please try again later");
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <StatusBar barStyle="light-content" backgroundColor="#161622" />
      <View className="absolute top-0 right-0 p-6 z-10">
        <TouchableOpacity onPress={handleLogout} className="flex-row items-center space-x-2">
          <Icon name="logout" size={24} color="#FF8E01" />
          <Text className="text-orange-500 font-pmedium text-base">Logout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          // Only render header if user exists; otherwise, show a fallback
          <View className="my-16 px-4">
            <View className="flex-row items-center">
              <View className="w-28 h-28 rounded-full border border-secondary overflow-hidden">
                <Image
                  source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="ml-4 flex-1">
                <View className="flex-row items-center justify-center space-x-2">
                  <InfoBox title={posts.length} subtitle="Posts" containerStyles="flex-1" />
                  <InfoBox title="1.3K" subtitle="Followers" containerStyles="flex-1" />
                  <InfoBox title="500" subtitle="Following" containerStyles="flex-1" />
                </View>
                <View className="mt-2 ml-8">
                  <Text className="text-white font-psemibold text-base">
                    {user?.username || "Unknown User"}
                  </Text>
                  <Text className="text-gray-100 font-pregular">Professional Creator</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subtitle="No videos found for this user" />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
