import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { createVideo } from "../../lib/appwrite";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useVideoPlayer, VideoView } from 'expo-video';

const Create = () => {
  const { user } = useGlobalContext();

  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: ''
  });

  const screenWidth = Dimensions.get('window').width;

  const openPicker = async (selectType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: selectType === 'image' ? 'image/*' : 'video/*',
        copyToCacheDirectory: true,
        multiple: false,
      });
      
      if (!result.canceled) {
        if (selectType === 'image') {
          setForm({ ...form, thumbnail: result.assets[0] });
        } else if (selectType === 'video') {
          setForm({ ...form, video: result.assets[0] });
        }
      } else {
        Alert.alert('Operation cancelled', 'No file was selected.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while picking the file.');
    }
  };

  // Always call useVideoPlayer even if no video is selected.
  const player = useVideoPlayer(form.video ? form.video.uri : null, (player) => {
    if (player) {
      player.loop = false;
      // Disable native controls since interaction is not required during upload.
      player.useNativeControls = false;
    }
  });

  const submit = async () => {
    if (!form.prompt || !form.thumbnail || !form.title || !form.video) {
      Alert.alert("Please fill in all the fields");
      return;
    }

    setUploading(true);

    try {
      await createVideo({
        ...form, userId: user.$id
      });
      Alert.alert('Success', 'Post uploaded successfully!');
      router.push('/home');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: ''
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView className='px-4 my-6'>
        <Text className='text-2xl text-white font-psemibold'>Upload Video</Text>

        <FormField 
          title='Video Title'
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles='mt-10'
        />

        {/* Video Upload Section */}
        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium mb-2'>Upload Video</Text>
          <TouchableOpacity onPress={() => openPicker('video')}>
            {form.video ? (
              <View>
                <VideoView 
                  player={player}
                  style={{
                    width: screenWidth,
                    height: 256,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    alignSelf: 'center'
                  }}
                  resizeMode="cover"
                />
                {/* Change Video Button */}
                <TouchableOpacity 
                  onPress={() => openPicker('video')}
                  style={{
                    marginTop: 8,
                    alignSelf: 'center',
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    backgroundColor: '#FF9C01',
                    borderRadius: 6
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Change Video</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                <View className='w-16 h-16 justify-center items-center'>
                  <MaterialCommunityIcons name="video-plus" size={36} color="#FF9C01" />
                </View>
                <Text className='text-gray-400 mt-2'>Tap to upload video</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Thumbnail Upload Section */}
        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium mb-2'>Upload Thumbnail</Text>
          <TouchableOpacity onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <View>
                <Image 
                  source={{ uri: form.thumbnail.uri }}
                  resizeMode='cover'
                  className='w-full h-64 rounded-2xl'
                />
                {/* Change Thumbnail Button */}
                <TouchableOpacity 
                  onPress={() => openPicker('image')}
                  style={{
                    marginTop: 8,
                    alignSelf: 'center',
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    backgroundColor: '#FF9C01',
                    borderRadius: 6
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Change Thumbnail</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className='w-full h-40 bg-black-100 rounded-2xl justify-center items-center'>
                <View className='w-16 h-16 rounded-full justify-center items-center'>
                  <MaterialCommunityIcons name="image-plus" size={36} color="#FF9C01" />
                </View>
                <Text className='text-gray-400 mt-2'>Tap to upload thumbnail</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField 
          title='AI Prompt'
          value={form.prompt}
          placeholder="The Prompt you used to create the video"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles='mt-7'
        />

        <CustomButton 
          title="Submit and Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
