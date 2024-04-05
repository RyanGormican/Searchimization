import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../src/app/Header';
import { auth, firestore } from '../src/app/firebase';
import { collection, getDoc, setDoc, where, query, doc, getDocs, writeBatch } from 'firebase/firestore'; // Import writeBatch
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

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = auth.onAuthStateChanged(async user => {
        if (!user) {
          router.push('/');
        } else {
          const storageData: SearchimizationData = JSON.parse(localStorage.getItem('searchimization') || '{}');
          setUsername(storageData.profile.username);
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
      const parsedData = JSON.parse(storageData);
      parsedData.profile.username = newUsername;
      localStorage.setItem('searchimization', JSON.stringify(parsedData));
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
      </main>
    </div>
  );
};

export default Profile;
