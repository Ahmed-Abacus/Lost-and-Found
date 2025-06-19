// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDb7DDPu9y0OPPBzdEzsT-zrx1gq04gOX0",
    authDomain: "lostandfound-9088d.firebaseapp.com",
    projectId: "lostandfound-9088d",
    storageBucket: "lostandfound-9088d.firebasestorage.app",
    messagingSenderId: "544449415390",
    appId: "1:544449415390:web:d2d0b92b393648623b5a4f",
    measurementId: "G-L4XKN6GKGE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage(app);

export { auth, db};