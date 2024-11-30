import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import'firebase/compat/storage';
import 'firebase/compat/auth';


const firebaseConfig = {
    apiKey: "AIzaSyCps6QDft8NlFAC6bV5bTkyfun7XHk1jFw",
    authDomain: "metacharactersai.firebaseapp.com",
    projectId: "metacharactersai",
    storageBucket: "metacharactersai.appspot.com",
    messagingSenderId: "938121793081",
    appId: "1:938121793081:web:76415034dceae55d2387e8",
    measurementId: "G-C6F0NYKPJ4"
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// Use local emulators if running on localhost
if (["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    console.log("Connecting to local emulators...");
    firestore.useEmulator("localhost", 8080); // Firestore Emulator
    auth.useEmulator("http://localhost:5003"); // Auth Emulator
} else {
    console.log("Using production Firebase services...");
}

export { firestore, storage, auth };



