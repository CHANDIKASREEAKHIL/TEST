// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDClIgIUtgGmTtOMqshVGmySkulhcf7xXI",
  authDomain: "gamequiz-2e893.firebaseapp.com",
  projectId: "gamequiz-2e893",
  storageBucket: "gamequiz-2e893.appspot.com",
  messagingSenderId: "685923239474",
  appId: "1:685923239474:web:84d074559d81c31c589e2b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);
export const db= getFirestore(app);
export default app;

