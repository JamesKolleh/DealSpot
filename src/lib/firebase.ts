import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDHlKPCL3KD4yHG3pBGRQmIIMH3msd3YX8",
  authDomain: "dealspot-9da30.firebaseapp.com",
  projectId: "dealspot-9da30",
  storageBucket: "dealspot-9da30.firebasestorage.app",
  messagingSenderId: "450957608071",
  appId: "1:450957608071:web:ca20196483c32c2fa4e422",
  measurementId: "G-13RHQFSCMS"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
