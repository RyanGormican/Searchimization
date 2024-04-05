'use client'
import { useState, useEffect } from "react";
import { auth, firestore } from './firebase';

import { signInWithPopup, User, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Header from './Header';

export default function Home() {
  // State for error message
  const [error, setError] = useState("");

  // State for user authentication
  const [user, setUser] = useState<User | null>(null);

  // Google authentication provider
  const googleProvider = new GoogleAuthProvider();

  // Function to sign in with Google
  const signInGoogle = () => {
    signInWithPopup(auth, googleProvider);
  };

  // Function to handle user logout
  const handleLogout = () => {
    signOut(auth);
  };

  // Effect to listen for changes in user authentication state
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      setUser(user);

     


      // Check if searchimization already exists in local storage
      const existingSearchimization = localStorage.getItem('searchimization');
      if (!existingSearchimization) {
        // Retrieve user document
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          // Grab the userName field
          const userName = userData.username;
          // Set searchimization in local storage
          localStorage.setItem('searchimization', JSON.stringify({ profile: { username: userName }, entries: [] }));
        } else
        {
        await setDoc(userDocRef, { username: '' });
        localStorage.setItem('searchimization', JSON.stringify({ profile: { username: '' }, entries: [] }));
        }
      }
    } else {
      setUser(null);
    }
  });

  return () => unsubscribe();
}, []);


  return (
    <main className="flex min-h-screen items-center p-12 flex-col">
      <Header currentUser={user} />
      {/* Render error message if exists */}
      {error && <div className="text-red-500">{error}</div>}
      {/* Render sign in with Google button if user is not authenticated */}
      {!user &&
        <div className="text-center">
          <div style={{ padding: '200px' }}>
            <button onClick={signInGoogle} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
              <Icon icon="devicon:google" height="30" />
              <span className="ml-2">Sign in with Google</span>
            </button>
          </div>
        </div>
      }
    </main>
  );
}
