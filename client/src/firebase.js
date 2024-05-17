// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blogapp-5b02b.firebaseapp.com",
  projectId: "mern-blogapp-5b02b",
  storageBucket: "mern-blogapp-5b02b.appspot.com",
  messagingSenderId: "272560028359",
  appId: "1:272560028359:web:637b582e2ba5e570069ce2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);