// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRrYntlbrebbIeYDook7PHNA0Cf_MHPdg",
  authDomain: "fir-indcophase2.firebaseapp.com",
  projectId: "fir-indcophase2",
  storageBucket: "fir-indcophase2.appspot.com",
  messagingSenderId: "1079333699438",
  appId: "1:1079333699438:web:3bbb1078cd9f89ebb1cb7f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore and set up references
export const db = getFirestore(app);
export const usernameRef = collection(db, 'users');
export const roomref = collection(db, 'rooms');
