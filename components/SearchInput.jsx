import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const SearchInput = ({ initialQuery }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(initialQuery || '');
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  const onSubmit = () => {
    if (!query) {
      return Alert.alert("Missing Query", "Please input something to search.");
    }

    // Check if the current pathname starts with '/search'
    if (pathname && pathname.startsWith('/search')) {
      router.setParams({ query });
    } else {
      router.push(`/search/${query}`);
    }
  };

  return (
    <View
      className={`border-2 rounded-xl w-full h-16 px-4 bg-black-100 flex-row items-center space-x-4 ${
        isFocused ? 'border-secondary' : 'border-black-200'
      }`}
    >
      <TextInput
        className="flex-1 text-white font-pregular mt-0.5 text-base h-full"
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor="#7b7b8b"
        onChangeText={setQuery}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      <TouchableOpacity onPress={onSubmit}>
        <Ionicons name="search" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
