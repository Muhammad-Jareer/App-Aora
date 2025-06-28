import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { icons } from '../constants';
import ActiveVideo from './ActiveVideo';
import { useGlobalContext } from '../context/GlobalProvider';
import { addFavorites } from '../lib/appwrite';

const screenWidth = Dimensions.get('window').width;

const VideoCard = ({ video, hideLikedIcon }) => {
  const { user: activeUser } = useGlobalContext()
   
  const userId = activeUser.$id; 
  const { title, thumbnail, $id: videoId, video: videoUrl, user } = video;
  const [play, setPlay] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  
  const addToFav = () => {
    setIsFavorite(!isFavorite);
    addFavorites(userId, videoId)
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      {/* Header with avatar, title, username, and favorite icon */}
      <View className="flex-row gap-3 items-center">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-full border border-secondary justify-center p-0.5">
            <Image
              source={{ uri: user?.avatar }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-white font-semibold text-sm" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-sm text-gray-100 font-pregular">
              {user?.username}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-2 pt-2 items-center">
        {!hideLikedIcon && (
          <TouchableOpacity onPress={addToFav}>
            <MaterialIcons 
              name={isFavorite ? "favorite" : "favorite-border"} 
              size={24} 
              color={isFavorite ? "#FF9C01" : "white"} 
            />
          </TouchableOpacity>
        )}
          <Entypo name="dots-three-vertical" size={20} color="white" />
        </View>
      </View>

      {/* Video or Thumbnail */}
      {play ? (
        <ActiveVideo 
          videoUrl={videoUrl} 
          onEnd={() => setPlay(false)} 
          width={screenWidth}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center border-2 border-secondary-200"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
