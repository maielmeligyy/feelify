import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCCuQuABbIz19mTxGTq3CEFVOqGSicE-8",
  authDomain: "feelify-e3240.firebaseapp.com",
  projectId: "feelify-e3240",
  storageBucket: "feelify-e3240.appspot.com", // ✅ fixed typo
  messagingSenderId: "980113955622",
  appId: "1:980113955622:web:6e9332e104cb13594bffe7",
  measurementId: "G-T5ZLC23D7Q"
};

// ✅ Prevent reinitializing Firebase on reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Only initialize Auth if it’s not already initialized
let auth;
try {
  auth = getAuth(app);
} catch (e) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

const db = getFirestore(app);

export { auth, db };
