import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// TODO: Replace with your actual firebaseConfig from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyD0_mMx4MOEMEiS8kyFAw90BQ7_m8em83c",
    authDomain: "phatdo-12.firebaseapp.com",
    projectId: "phatdo-12",
    storageBucket: "phatdo-12.firebasestorage.app",
    messagingSenderId: "421675025769",
    appId: "1:421675025769:web:40b3cedd3a47a7797c29f8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
