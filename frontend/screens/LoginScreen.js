import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Camera');
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Feelify</Text>
      <Text style={styles.subtitle}>Log in to start feeling the music 🎧</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don’t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};
export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B103E',
    justifyContent: 'center',
    padding: 30,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#2D1D63',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8e44ad',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  link: {
    color: '#a678e2',
    fontSize: 14,
    textAlign: 'center',
  },
});
