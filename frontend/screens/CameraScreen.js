import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as CameraModule from 'expo-camera';
const { Camera } = CameraModule;
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import { startRecording, stopRecording, deleteRecording } from './voiceRecorder'; 

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(null);
  const recordingRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const askQuestionAndRecord = async () => {
    try {
      const recording = await startRecording();
      recordingRef.current = recording;
      Speech.speak('Hello! How are you feeling today? Answer naturally, I am listening.', {
        rate: 0.8,
        pitch: 1.0,
      });

      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
      console.log('Photo captured:', photo.uri);

      setTimeout(async () => {
        const audioUri = await stopRecording(recordingRef.current);
        
        const formData = new FormData();
        formData.append('audio', {
          uri: audioUri,
          type: 'audio/wav',
          name: 'audio.wav',
        });

        const audioResponse = await fetch('http://localhost:5000/detect_voice_emotion', {
          method: 'POST',
          body: formData,
        });
        const audioData = await audioResponse.json();
        console.log('Voice emotion detected:', audioData.emotion);

        const photoResponse = await fetch('http://localhost:5000/detect_emotion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: photo.base64,
            moodAnswers: { q3: audioData.emotion },
          }),
        });
        const resultData = await photoResponse.json();
        console.log('Photo emotion + Playlist:', resultData);

        await deleteRecording(audioUri);
        
        navigation.navigate('ResultsScreen', {
          mood: resultData.emotion,
          playlist: resultData.playlist,
        });
      }, 7000); 
    } catch (error) {
      console.error('Error during mood detection flow', error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.front}
        onCameraReady={() => setCameraReady(true)}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Start Mood Detection"
          onPress={askQuestionAndRecord}
          disabled={!cameraReady}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
});
