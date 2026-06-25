// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7FslqRYdC4b5q-fApvAG2UrJbRKrHeXw",
  authDomain: "fir-cloud-messaging-c0d8e.firebaseapp.com",
  projectId: "fir-cloud-messaging-c0d8e",
  storageBucket: "fir-cloud-messaging-c0d8e.firebasestorage.app",
  messagingSenderId: "79441961389",
  appId: "1:79441961389:web:e5e643d3254dc9f1bec124",
  measurementId: "G-DPCKTNE7YR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);