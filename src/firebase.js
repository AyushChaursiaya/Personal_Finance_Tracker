// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "AIzaSyCeH3TEeHl0yxy8PUolDEd04vHIrfEAa_I",
  authDomain: "financely-rec-178c8.firebaseapp.com",
  projectId: "financely-rec-178c8",
  storageBucket: "financely-rec-178c8.appspot.com",
  messagingSenderId: "563579428756",
  appId: "1:563579428756:web:84de21df5aa07e981eb981",
  measurementId: "G-WKB61JPZMP"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc};
