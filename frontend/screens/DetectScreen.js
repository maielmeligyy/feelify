import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
const DetectScreen = ({ navigation }) => {
  const handleDetectPress = () => {
    navigation.navigate('Camera');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Ready to feel your vibe?</Text>
      <Text style={styles.subheading}>Tap below to detect your mood</Text>
      <TouchableOpacity style={styles.button} onPress={handleDetectPress}>
        <Text style={styles.buttonText}>Detect Your Mood</Text>
      </TouchableOpacity>
    </View>
  );
};
export default DetectScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B103E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#8e44ad',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    elevation: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
