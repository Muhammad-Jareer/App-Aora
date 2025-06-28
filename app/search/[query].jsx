import React, { useEffect } from 'react';
import { StatusBar, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import { searchPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';

import SearchInput from '../../components/SearchInput';
import VideoCard from '../../components/VideoCard';
import EmptyState from '../../components/EmptyState';

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));
  
  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <StatusBar barStyle="light-content" backgroundColor="#161622" />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            {/* Search Results Header */}
            <View className="mb-4">
              <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
              <Text className="text-2xl font-psemibold text-white mt-1">{query}</Text>
            </View>

            {/* Search Input */}
            <SearchInput initialQuery={query} />

            {/* Latest Videos Section */}
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">Latest Videos</Text>
            </View>
          </View>
        )}

        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subtitle="No videos found for this search" />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
