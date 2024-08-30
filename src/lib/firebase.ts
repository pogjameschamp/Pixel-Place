// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgApgYExLRwrQSlQ9PPKT3uj4AQ7MKBqI",
  authDomain: "rplace-5dbca.firebaseapp.com",
  projectId: "rplace-5dbca",
  storageBucket: "rplace-5dbca.appspot.com",
  messagingSenderId: "678386931629",
  appId: "1:678386931629:web:1425bb3ca722d58b94b324",
  measurementId: "G-DHP0HTGZF7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();