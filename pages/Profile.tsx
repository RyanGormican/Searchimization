import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../src/app/Header';
import { auth, firestore } from '../src/app/firebase';
import { collection, getDoc, setDoc, where, query, doc, getDocs, writeBatch } from 'firebase/firestore'; // Import writeBatch
import '/src/app/globals.css';

const Profile: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = auth.onAuthStateChanged(async user => {
        if (!user) {
          router.push('/');
        } else {
          try {
            // Check if a document exists for the logged-in user in the "users" collection
            const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              // If the document exists, set the username state
              setUsername(userDocSnap.data().username);
            } else {
              // If the document doesn't exist, create a new document with the user's UID and an initial username
              await setDoc(userDocRef, { username: '' });
              setUsername('');
            }

            setLoading(false);
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      });

      return () => unsubscribe();
    };

    fetchData();

    // Check if profile information exists in local storage, if not, append it
    const storageData = localStorage.getItem('searchimization');
    if (!storageData) {
      localStorage.setItem('searchimization', JSON.stringify({ latestDate: new Date().toISOString(), profile: { username: '' }, entries: [] }));
    }
  }, [router]);

  const handleUsernameChange = async (newUsername: string) => {
    try {
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
      const storageData = localStorage.getItem('searchimization');
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
        <h1 className="text-3xl font-bold my-4">User Profile</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={(e) => handleUsernameChange(e.target.value)}
        />
        <button onClick={() => handleUsernameChange(username)}>Update Username</button>
      </main>
    </div>
  );
};

export default Profile;
