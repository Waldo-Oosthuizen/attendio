// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅ Correct Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA72hBNmeeZNWsDVFsS6eVU0vM47NUA5OY',
  authDomain: 'fretnot-attendance-b3026.firebaseapp.com',
  projectId: 'fretnot-attendance-b3026',
  storageBucket: 'fretnot-attendance-b3026.appspot.com',
  messagingSenderId: '1068497148466',
  appId: '1:1068497148466:web:538e53b89fc500b9ce3a2b',
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Authentication with persistent login
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Firebase Auth persistence set to local ✅');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

// ✅ Set up Google Provider
const googleProvider = new GoogleAuthProvider();

// ✅ Initialize Firestore
const db = getFirestore(app);

// ✅ Export everything
export { auth, googleProvider, db };
