import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyChIA0auogvv6iDLt2xwXybP5vk1QXHiwc",
  authDomain: "cult-cinema.firebaseapp.com",
  projectId: "cult-cinema",
  storageBucket: "cult-cinema.firebasestorage.app",
  messagingSenderId: "282551759851",
  appId: "1:282551759851:web:36a1c77126784b582f9fae",
  measurementId: "G-2V3RZ4K27V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);