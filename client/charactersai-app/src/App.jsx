/* eslint-disable no-unused-vars */
/* App.jsx */

import React, { useState,useEffect } from 'react';
import ModelList from './components/ModelList';
import ChatApp from './components/chatApp';
import firebase from 'firebase/compat/app';
import { auth, firestore } from './firebase'; // Import auth and firestore from firebase.js

function App() {
  const [currentModel, setCurrentModel] = useState(null);
  const [modelId, setModelId] = useState(null);
  const [user, setUser] = useState(auth.currentUser ? auth.currentUser : ''); // Add user state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Update the user state when auth.currentUser changes
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, []);

  // Function to handle sign-in with Google
  const handleSignInWithGoogle = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      const { user } = result;

      // Add user to the Users collection in Firestore
      await firestore.collection('Users').doc(user.uid).set({
        userId: user.uid,
        email: user.email,
        name: user.displayName,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        lastLoginAt: user.metadata?.lastLoginAt,
        lastSignInTime: user.metadata?.lastSignInTime,
        createdAt: user.metadata.createdAt,
      });

      setUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModelClick = (modelName, modelId) => {
    setCurrentModel(modelName);
    setModelId(modelId);
  };

  return (
    <div className='wrapper'>
      <header className='navbar'>
        <h4>Meta Characters Chat</h4>
        {user ? (
          <div className='user-info'>
            <span className='welcome-user'>Welcome, {user.displayName}</span>
            <button className='signout-btn' onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <button className='sign-in-button' onClick={handleSignInWithGoogle}>
            Sign In with Google
          </button>
        )}
      </header>

    <div className='top-container'>
        
      {currentModel ? (
        <ChatApp modelName={currentModel} modelId={modelId} />
      ) : (
        <ModelList onModelClick={handleModelClick} />
      )}
    </div>
    </div>

  );
}

export default App;
