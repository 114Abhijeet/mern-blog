// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-e2063.firebaseapp.com",
  projectId: "mern-blog-e2063",
  storageBucket: "mern-blog-e2063.appspot.com",
  messagingSenderId: "536864917578",
  appId: "1:536864917578:web:385d3b38f894f965fdfeb3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);