import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
const QuestionnaireScreen = ({ navigation, route }) => {
  const { detectedMood, playlist } = route.params || {};
  const [selectedAnswers, setSelectedAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
  });
  const handleSelect = (question, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [question]: answer,
    }));
  };
  const handleSubmit = () => {
    navigation.replace('Results', {
      confirmedMood: detectedMood, 
      playlist,
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Let's double check your mood</Text>
      <Text style={styles.question}>How do you want to feel?</Text>
      {['Chill', 'Energetic', 'Melancholic'].map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.option, selectedAnswers.q1 === opt && styles.selected]}
          onPress={() => handleSelect('q1', opt)}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.question}>What are you doing now?</Text>
      {['Dancing', 'Relaxing', 'Thinking'].map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.option, selectedAnswers.q2 === opt && styles.selected]}
          onPress={() => handleSelect('q2', opt)}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.question}>Pick a word that describes your emotion</Text>
      {['Joy', 'Sadness', 'Anger'].map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.option, selectedAnswers.q3 === opt && styles.selected]}
          onPress={() => handleSelect('q3', opt)}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>Generate Playlist</Text>
      </TouchableOpacity>
    </View>
  );
};
export default QuestionnaireScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B103E',
    padding: 24,
  },
  header: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  question: {
    fontSize: 18,
    color: '#ccc',
    marginTop: 20,
    marginBottom: 10,
  },
  option: {
    backgroundColor: '#333',
    padding: 14,
    marginVertical: 6,
    borderRadius: 10,
  },
  selected: {
    backgroundColor: '#8e44ad',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  submit: {
    marginTop: 30,
    backgroundColor: '#6c3483',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
