import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../src/app/Header';
import { auth, firestore } from '../src/app/firebase';
import { collection, getDoc, setDoc, where, query, doc, getDocs, writeBatch } from 'firebase/firestore'; 
import '/src/app/globals.css';

// Define SearchimizationData type
interface SearchimizationData {
  profile: {
    username: string;
  };

}

const Profile: React.FC = () => {
  const router = useRouter();
  const [usernameT, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalplays, setTotalPlays] = useState(0);
  const [totalfinishes, setTotalFinishes] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = auth.onAuthStateChanged(async user => {
        if (!user) {
          router.push('/');
        } else {
          const storageData: SearchimizationData = JSON.parse(localStorage.getItem('searchimization') || '{}');
          setUsername(storageData.profile.username);
          setTotalPlays(storageData.profile.totalplays);
          setTotalFinishes(storageData.profile.totalfinishes);
          setLoading(false);
        }
      });

      return () => unsubscribe();
    };

    fetchData();
  }, [router]);

const handleUsernameChange = async (newUsername: string) => {
  try {
    if (!auth.currentUser) {
      return;
    }

    // Update the username in the user document
    const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
    await setDoc(userDocRef, { username: newUsername });
    const currentTime = new Date();

    // Update the username in all "puzzles" documents where the user is equal to the UID of the authenticated user
    const userPuzzlesQuery = query(collection(firestore, 'puzzles'), where('user', '==', auth.currentUser.uid));
    const userPuzzlesSnapshot = await getDocs(userPuzzlesQuery);
    const batch = writeBatch(firestore);

    userPuzzlesSnapshot.forEach((doc) => {
      const puzzleDocRef = doc.ref;
      batch.update(puzzleDocRef, { userName: newUsername, lastupdated: currentTime });
    });

    await batch.commit();

    // Update local state
    setUsername(newUsername);

    // Update local storage
const storageData: SearchimizationData = JSON.parse(localStorage.getItem('searchimization') || '{}');
if (storageData) {
  // No need to parse storageData again, it's already an object
  storageData.profile.username = newUsername;
  localStorage.setItem('searchimization', JSON.stringify(storageData));
}

  } catch (error) {
    console.error('Error updating username:', error);
  }
};


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header currentUser={auth.currentUser} />
      <main className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold my-4">Username </h1>
        <input
          type="text"
          value={usernameT}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={(e) => handleUsernameChange(e.target.value)}
        />
        <button onClick={() => handleUsernameChange(usernameT)}>Update Username</button>
               <h1 className="text-3xl font-bold my-4">Statistics </h1>
               <div> Total Plays - {totalplays} </div>
               <div> Total Finishes - {totalfinishes} </div>
      </main>
    </div>
  );
};

export default Profile;
