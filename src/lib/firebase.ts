import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAfOPaXsQj2Gd6wYCQcazgqu8z9UWGcgsU",
  authDomain: "prompteyv2.firebaseapp.com",
  projectId: "prompteyv2",
  storageBucket: "prompteyv2.firebasestorage.app",
  messagingSenderId: "941705685446",
  appId: "1:941705685446:web:a2f16ea511b546d9aeaac7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;