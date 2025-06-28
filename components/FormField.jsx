import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo Vector Icons

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // Track focus state

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className={`space-y-2 ${otherStyles} w-full`}>
        <Text className="text-base text-gray-100 font-pmedium mb-2">{title}</Text>

        <View
          className={`border-2 rounded-xl w-full h-16 px-4 bg-black-50 flex-row items-center ${
            isFocused ? 'border-secondary' : 'border-black-200'
          }`}
        >
          <TextInput
            className="flex-1 text-white font-psemibold text-base h-full"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
            onFocus={() => setIsFocused(true)}  // Set focus state to true
            onBlur={() => setIsFocused(false)}  // Reset focus state on blur
          />

          {title === "Password" && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={24} 
                color="#7b7b8b" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FormField;
