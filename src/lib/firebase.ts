/**
 * @fileoverview This file is responsible for initializing and configuring the Firebase SDK.
 * It creates and exports singleton instances of Firebase services like Authentication and Firestore
 * to be used throughout the application, ensuring a single connection is established.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration.
// It's safe to expose this in the client-side code as access is controlled by Firestore Security Rules.
const firebaseConfig = {
    projectId: "procomm-hub",
    appId: "1:188632595262:web:dea9ec491a1124530b4a6f",
    storageBucket: "procomm-hub.firebasestorage.app",
    apiKey: "AIzaSyB9PLN2Oredi6tIyf65ZfSQicp3DNMUrzk",
    authDomain: "procomm-hub.firebaseapp.com",
    messagingSenderId: "188632595262"
};

// Initialize Firebase, but only if it hasn't been initialized already.
// This prevents re-initialization on hot reloads in a development environment.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Export the initialized services for use in other parts of the application.
export { app, auth, db };
