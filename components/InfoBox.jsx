import { View, Text } from 'react-native';
import React from 'react';

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }) => {
  return (
    <View
      className={`p-2 rounded-md shadow-lg ${containerStyles}`}
    >
      <Text
        className={`text-white text-center font-psemibold text-xl ${titleStyles}`}
      >
        {title}
      </Text>
      <Text className="text-sm text-gray-100 text-center">{subtitle}</Text>
    </View>
  );
};

export default InfoBox;
