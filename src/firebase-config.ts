// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from 'firebase/database';
import {getAuth} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBCxDYc4mCEQJmA4TloPe23MIf4WR17XNs",
    authDomain: "bank-app-67d18.firebaseapp.com",
    projectId: "bank-app-67d18",
    storageBucket: "bank-app-67d18.appspot.com",
    messagingSenderId: "662129991775",
    appId: "1:662129991775:web:434dddf585e9c33dc3fbea",
    measurementId: "G-ZCSNH0TPNJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getDatabase(app);
export const auth=getAuth();