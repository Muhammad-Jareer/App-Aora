import { View, TouchableOpacity, ImageBackground, Image, FlatList } from 'react-native';
import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { icons } from '../constants';

import ActiveVideo from './ActiveVideo';

const zoomIn = { 0: { scale: 0.9 }, 1: { scale: 1 } };
const zoomOut = { 0: { scale: 1.2 }, 1: { scale: 0.9 } };

const TrendingItem = ({ activeItem, item, playingVideo, setPlayingVideo }) => {
  const isPlaying = playingVideo === item.$id;

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {isPlaying ? (
        <ActiveVideo
          videoUrl={item.video} // Ensure the property is correct (e.g., item.video)
          onEnd={() => setPlayingVideo(null)}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlayingVideo(item.$id)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]?.$id || '');
  const [playingVideo, setPlayingVideo] = useState(null);

  const viewableItemsChange = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0]?.item.$id);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem
          activeItem={activeItem}
          item={item}
          playingVideo={playingVideo}
          setPlayingVideo={setPlayingVideo}
        />
      )}
      onViewableItemsChanged={viewableItemsChange}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Trending;
