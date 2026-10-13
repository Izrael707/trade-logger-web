import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYFGZHRSUCFS2kCe8PQkl8lMNrdMb0Xz0",
  authDomain: "trade-logger-a088e.firebaseapp.com",
  projectId: "trade-logger-a088e",
  storageBucket: "trade-logger-a088e.firebasestorage.app",
  messagingSenderId: "807995606299",
  appId: "1:807995606299:web:facfcc151c89426f07ffbe",
  measurementId: "G-VFQ0WMRLS1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
