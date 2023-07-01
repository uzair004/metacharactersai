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

export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const auth = firebase.auth();


