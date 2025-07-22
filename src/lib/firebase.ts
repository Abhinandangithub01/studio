import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    projectId: "procomm-hub",
    appId: "1:188632595262:web:dea9ec491a1124530b4a6f",
    storageBucket: "procomm-hub.firebasestorage.app",
    apiKey: "AIzaSyB9PLN2Oredi6tIyf65ZfSQicp3DNMUrzk",
    authDomain: "procomm-hub.firebaseapp.com",
    messagingSenderId: "188632595262"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
