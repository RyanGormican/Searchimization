'use client'
import { useState, useRef ,useEffect} from "react";
import { auth, firestore } from './firebase';

import { signInWithPopup, User, GoogleAuthProvider,signOut ,onAuthStateChanged,  } from 'firebase/auth';

import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function Home() {
  // State for error message
  const [error, setError] = useState("");

  // State for user authentication
  const [user, setUser] = useState<User | null>(null);

  // Google authentication provider
  let googleProvider = new GoogleAuthProvider();
 
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="flex min-h-screen items-center p-12 flex-col">
      <Link href="/">
        <div className="text-3xl font-bold mb-4">Searchimization</div>
      </Link>
      <div className="flex">
        <div className="links">
          <a href="https://www.linkedin.com/in/ryangormican/">
            <Icon icon="mdi:linkedin" color="#0e76a8" width="60" />
          </a>
          <a href="https://github.com/RyanGormican/Searchimization">
            <Icon icon="mdi:github" color="#e8eaea" width="60" />
          </a>
          <a href="https://ryangormicanportfoliohub.vercel.app/">
            <Icon icon="teenyicons:computer-outline" color="#199c35" width="60" />
          </a>
        </div>
        <div>
          <Link href="/Puzzles">
            <button className="py-2 px-4 bg-blue-500 text-white rounded">PUZZLES</button>
          </Link>
        </div>
        {/* Render CREATE button only if user is authenticated */}
        {user &&
          <div>
            <Link href="/Create">
              <button className="py-2 px-4 bg-blue-500 text-white rounded">CREATE</button>
            </Link>
          </div>
        }
      </div>
      {/* Render error message if exists */}
      {error && <div className="text-red-500">{error}</div>}
      {/* Render logout button if user is authenticated */}
      {user &&
        <div className="logout">
          <Icon onClick={handleLogout} icon="material-symbols:logout" height="60" />
        </div>
      }
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

