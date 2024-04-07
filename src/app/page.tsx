'use client'
import { useState, useEffect } from "react";
import { auth, firestore } from './firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, User, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Icon } from '@iconify/react';
import Header from './Header';
import '/src/app/globals.css';
import {playRandom} from './Random'

export default function Home() {
  // State for error message
  const [error, setError] = useState("");
  // State for user authentication
  const [user, setUser] = useState<User | null>(null);
  // State for modal visibility
  const [showModal, setShowModal] = useState(false);
  // State for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State for sign-up mode
  const [signUpMode, setSignUpMode] = useState(false);
  // Google authentication provider
  const googleProvider = new GoogleAuthProvider();

  // Function to sign in with Google
  const signInGoogle = () => {
    signInWithPopup(auth, googleProvider);
  };

  // Function to handle email sign in
  const signInWithEmail = async () => {
    try {
      // Clear previous error message
      setError("");
      // Validate email and password format
      if (!email || !password) {
        setError("Please enter both email and password.");
        return;
      }
      // Attempt sign-in
      await signInWithEmailAndPassword(auth, email, password);
      setShowModal(false);
    } catch (error) {
      // Handle sign-in error
      setError("Invalid email or password. Please try again.");
    }
  };

  // Function to handle user sign up
  const signUpWithEmail = async () => {
    try {
      // Clear previous error message
      setError("");
      // Validate email and password format
      if (!email || !password) {
        setError("Please enter both email and password.");
        return;
      }
      // Attempt sign-up
      await createUserWithEmailAndPassword(auth, email, password);
      setShowModal(false);
    } catch (error: any) {
      // Handle sign-up error
      setError(error.message);
    }
  };

  // Effect to listen for changes in user authentication state
  useEffect(() => {
    const fetchData = async (user: User) => {
      // Check if searchimization already exists in local storage
      const existingSearchimization = localStorage.getItem('searchimization');
      let userName = '';
      let totalPlays = 0;
      let totalFinishes = 0;
      if (!existingSearchimization) {
        // Retrieve user document
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          // Grab the fields
          userName = userData.username;
          totalPlays = userData.totalplays;
          totalFinishes = userData.totalfinishes;
          localStorage.setItem('searchimization', JSON.stringify({ profile: { username: userName , totalplays: totalPlays, totalfinishes: totalFinishes}, entries: [] }));
        } else {
          await setDoc(userDocRef, { username: '' });
          localStorage.setItem('searchimization', JSON.stringify({ profile: { username: '' }, entries: [] }));
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchData(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);


  return (

    <main className="flex min-h-screen items-center p-12 flex-col">
      <Header currentUser={user} />
      {/* Render sign in buttons */}
      {!user && (
        <div className="text-center">
          <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  flex items-center">
            <Icon icon="ic:outline-email" height="30"width="30"/>
            <span className="ml-2">Sign in with Email</span>
          </button>
          <button onClick={signInGoogle} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  flex items-center">
            <Icon icon="devicon:google" height="30" width="30" />
            <span className="ml-2">Sign in with Google</span>
          </button>
        </div>
      )}
      {user &&
      <div className="text-center">
           <Icon onClick={playRandom} icon="ion:dice" width="180" />
      </div>
      }
      {/* Modal for sign-in and sign-up */}
      {showModal && (
        <div id="static-modal" data-modal-backdrop="static" tabIndex={-1} aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {signUpMode ? "Sign Up" : "Sign In"} with Email
                </h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                {/* Sign-in/sign-up form */}
                <form onSubmit={(e) => { e.preventDefault(); signUpMode ? signUpWithEmail() : signInWithEmail(); }}>
                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
                    <span>{signUpMode ? "Sign Up" : "Sign In"}</span>
                  </button>
                </form>
                {/* Toggle button for sign-up mode */}
                <button onClick={() => setSignUpMode(!signUpMode)} className="text-blue-500 hover:text-blue-700 font-medium">
                  {signUpMode ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
