import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DetectScreen from '../screens/DetectScreen';
import CameraScreen from '../screens/CameraScreen';
import QuestionnaireScreen from '../screens/QuestionnaireScreen';
import ResultsScreen from '../screens/ResultsScreen';
const Stack = createNativeStackNavigator();
const StackNavigator = () => (
  <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="Detect" component={DetectScreen} />
    <Stack.Screen name="Camera" component={CameraScreen} />
    <Stack.Screen name="Questions" component={QuestionnaireScreen} />
    <Stack.Screen name="Results" component={ResultsScreen} />
  </Stack.Navigator>
);
export default StackNavigator;
