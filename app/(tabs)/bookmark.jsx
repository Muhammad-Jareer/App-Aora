import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList, Text, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VideoCard from '../../components/VideoCard';
import EmptyState from '../../components/EmptyState';
import { useGlobalContext } from '../../context/GlobalProvider';
import useAppwrite from '../../lib/useAppwrite';
import { getFavorites, getVideoById } from '../../lib/appwrite';

const Bookmark = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => user ? getFavorites(user.$id) : Promise.resolve([]));
  const [videos, setVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

    

  const fetchFavoriteVideos = async () => {
    try {
      const favoriteVideos = await Promise.all(
        posts.map(async (id) => {
          const video = await getVideoById(id);
          return video;
        })
      );
      setVideos(favoriteVideos.filter((video) => video !== null));
    } catch (error) {
      console.error("Error fetching favorite videos:", error.message);
    }
  };

  useEffect(() => {
    fetchFavoriteVideos();
  }, [posts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();  // Refetch user data
    await fetchFavoriteVideos();  // Fetch favorite videos again
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <StatusBar barStyle="light-content" backgroundColor="#161622" />

      {/* Header */}
      <View className="px-4 my-6">
        <Text className="text-2xl font-psemibold text-white">Bookmarks</Text>
      </View>

      {/* List of favorite videos */}
      <FlatList
        data={videos}
        keyExtractor={(item) => item.$id} // Use video object ID as the key
        renderItem={({ item }) => <VideoCard video={item} hideLikedIcon={true} />} // Pass the complete video object
        ListEmptyComponent={
          <EmptyState 
            title="No Bookmarks" 
            subtitle="You haven't bookmarked any videos yet." 
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF9C01']}
            tintColor="#FF9C01"
          />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;
