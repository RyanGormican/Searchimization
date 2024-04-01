'use client'
import { useState, useRef ,useEffect} from "react";
import { auth } from "./firebase"; 
import { signInWithPopup, GoogleAuthProvider,signOut ,onAuthStateChanged,  } from 'firebase/auth';

import Link from 'next/link';
import { Icon } from '@iconify/react';
export default function Home() {
 const [error, setError] = useState("");

   const [user,setUser] = useState(null);
   let googleProvider = new GoogleAuthProvider();
 
  const signInGoogle = () => {
    signInWithPopup(auth, googleProvider);
  };
  const handleLogout = () => {
    signOut(auth);
  };
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
          {user &&
        <div>
          <Link href="/Create">
            <button className="py-2 px-4 bg-blue-500 text-white rounded">CREATE</button>
          </Link>
        </div>
        }
    </div>
   {error && <div className="text-red-500">{error}</div>}
   {user &&
     <div className="logout">
                <Icon  onClick={handleLogout}icon="material-symbols:logout" height="60" />
            </div>
   
   }
   {!user && 
   <div>
       <button onClick={signInGoogle} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Sign in with Google
      </button>
     </div>
     }


    </main>
  );
  }