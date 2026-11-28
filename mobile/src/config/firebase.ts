import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration for Vedika Divine Mobile App
export const firebaseConfig = {
  apiKey: "AIzaSyCW7-cbbrupiDYIv5gDzBX5z_euoxtVx7w",
  authDomain: "vedika-e-com.firebaseapp.com",
  projectId: "vedika-e-com",
  storageBucket: "vedika-e-com.firebasestorage.app",
  messagingSenderId: "756690714604",
  appId: "1:756690714604:web:b68b253087d22ef8fe4ac9",
  measurementId: "G-C00R2CN4SQ",
};

// Initialize Firebase App safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
