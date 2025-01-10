// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3DZIHW49UVq2uYJt5M8SXbgo3nVfXnjU",
  authDomain: "fretnot-attendance-b3026.firebaseapp.com",
  projectId: "fretnot-attendance-b3026",
  storageBucket: "fretnot-attendance-b3026.firebasestorage.app",
  messagingSenderId: "1068497148466",
  appId: "1:1068497148466:web:538e53b89fc500b9ce3a2b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };
