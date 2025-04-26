import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Feelify</Text>
      <Text style={styles.subtitle}>Transform your emotions into music 🎶</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};
export default WelcomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B103E',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#8e44ad',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#6c3483',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
