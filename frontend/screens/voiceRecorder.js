import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
export async function startRecording() {
  try {
    console.log('Requesting audio permissions...');
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Permission to access microphone is required!');
      return;
    }
    console.log('Starting recording...');
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );
    await recording.startAsync();
    console.log('Recording started');
    return recording;
  } catch (error) {
    console.error('Failed to start recording', error);
  }
}
export async function stopRecording(recording) {
  try {
    console.log('Stopping recording...');
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    return uri;
  } catch (error) {
    console.error('Failed to stop recording', error);
  }
}
export async function deleteRecording(uri) {
  try {
    console.log('Deleting recording...');
    await FileSystem.deleteAsync(uri);
    console.log('Recording deleted successfully');
  } catch (error) {
    console.error('Failed to delete recording', error);
  }
}
