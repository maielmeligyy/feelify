import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import axios from 'axios';

// Camera import safely handled
import { Camera } from 'expo-camera';

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(null);
  const recordingRef = useRef(null);
  const [facialMood, setFacialMood] = useState(null);
  const [voiceMood, setVoiceMood] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        const { status: audioStatus } = await Audio.requestPermissionsAsync();
        setHasPermission(status === 'granted' && audioStatus === 'granted');
      } catch (e) {
        console.log('Permission error:', e);
        setHasPermission(false);
      }
    })();
  }, []);

  const captureFaceEmotion = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      const res = await axios.post('http://YOUR_FLASK_IP:5001/detect-emotion', {
        image: photo.base64,
      });
      setFacialMood(res.data.emotion);
    }
  };

  const askQuestionAndRecord = async () => {
    try {
      await Speech.speak("How are you feeling today? What kind of music do you want?");
      await new Promise(resolve => setTimeout(resolve, 4000));

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setRecording(true);

      await new Promise(resolve => setTimeout(resolve, 5000));
      await stopRecording();
    } catch (error) {
      Alert.alert('Voice recording error', error.message);
    }
  };

  const stopRecording = async () => {
    setRecording(false);
    const recording = recordingRef.current;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    const formData = new FormData();
    formData.append('audio', {
      uri,
      name: 'audio.wav',
      type: 'audio/wav',
    });

    const response = await fetch('http://YOUR_FLASK_IP:5001/detect-voice-emotion', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setVoiceMood(data.emotion);
    processFinalMood(data.emotion);
  };

  const processFinalMood = (voice) => {
    const finalMood = voice || facialMood || "neutral";
    navigation.navigate('ResultsScreen', { mood: finalMood });
  };

  const startProcess = async () => {
    setProcessing(true);
    await captureFaceEmotion();
    await askQuestionAndRecord();
    setProcessing(false);
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera or mic</Text>;

  return (
    <View style={styles.container}>
      {Camera && Camera.Constants ? (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.front}
          ref={cameraRef}
          onCameraReady={() => setCameraReady(true)}
        />
      ) : (
        <View style={styles.camera}><Text style={{ color: '#fff' }}>Loading Camera...</Text></View>
      )}
      {processing ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={startProcess}
          disabled={!cameraReady}
        >
          <Text style={styles.buttonText}>Start Mood Detection</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  button: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    padding: 15,
    backgroundColor: '#1DB954',
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontSize: 16 },
  loader: { position: 'absolute', bottom: 50, alignSelf: 'center' },
});
