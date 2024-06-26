import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../src/app/Header';
import { auth, firestore } from '../src/app/firebase';
import { collection, getDoc,updateDoc, setDoc, where, query, doc, getDocs, writeBatch } from 'firebase/firestore'; 
import '/src/app/globals.css';
import { Icon } from '@iconify/react';
// Define SearchimizationData type
interface SearchimizationData {
  profile: {
   [key: string]: string | number; 
    username: string;
    totalplays: number; 
    totalfinishes: number;
    sessionplays: number;
    sessionfinishes: number;
  };

}

const Profile: React.FC = () => {
  const router = useRouter();
  const [usernameT, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalplays, setTotalPlays] = useState(0);
  const [totalfinishes, setTotalFinishes] = useState(0);
  useEffect(() => {
   const updateSessionValues = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const userId = currentUser.uid;
  const userDocRef = doc(firestore, 'users', userId);

  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    const searchimizationData: SearchimizationData = JSON.parse(localStorage.getItem('searchimization') || '{}');
    const { sessionplays = 0, sessionfinishes = 0 } = searchimizationData.profile || {};

    let newTotalplays = (userData.totalplays || 0) + sessionplays;
    let newTotalfinishes = (userData.totalfinishes || 0) + sessionfinishes;

    // Prepare the update data
    const updateData: { [key: string]: any } = {
      totalplays: newTotalplays,
      totalfinishes: newTotalfinishes
    };

    // Add values ending with 'P' or 'F' to update data and reset them to 0
    Object.entries(searchimizationData.profile).forEach(([key, value]) => {
      if (typeof value === 'number') {
        if (key.endsWith('P') || key.endsWith('F')) {
          updateData[key] = (userData[key] || 0) + value;
          searchimizationData.profile[key] = 0; // Reset to 0 after updating
        }
      }
    });

    // Update the document with incremented values
    await updateDoc(userDocRef, updateData);

    // Reset session values in local storage
    searchimizationData.profile.sessionplays = 0;
    searchimizationData.profile.sessionfinishes = 0;
    searchimizationData.profile.totalfinishes = newTotalfinishes;
    searchimizationData.profile.totalplays = newTotalplays;
    localStorage.setItem('searchimization', JSON.stringify(searchimizationData));
  }
};



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
  const searchimizationData: SearchimizationData = JSON.parse(localStorage.getItem('searchimization') || '{}');
  if (searchimizationData.profile.sessionplays !== 0)
  {
    updateSessionValues();
  }
    fetchData();
  }, [router]);

const handleUsernameChange = async (newUsername: string) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return;
    }
 
    // Update the username in the user document
    const userDocRef = doc(firestore, 'users', currentUser.uid);
    await setDoc(userDocRef, { username: newUsername });
    const currentTime = new Date();

    // Update the username in all "puzzles" documents where the user is equal to the UID of the authenticated user
    const userPuzzlesQuery = query(collection(firestore, 'puzzles'), where('user', '==', currentUser.uid));
    const userPuzzlesSnapshot = await getDocs(userPuzzlesQuery);
    const batch = writeBatch(firestore);

    userPuzzlesSnapshot.forEach((doc) => {
      const puzzleDocRef = doc.ref;
      batch.update(puzzleDocRef, { userName: newUsername, lastupdated: currentTime });
    });

    // Update the username in all "puzzles" documents where the userId matches the authenticated user's ID in the fastTimes field
    const fastTimesQuery = query(collection(firestore, 'puzzles'), where('fastTimes', 'array-contains', { userId: currentUser.uid }));
    const fastTimesSnapshot = await getDocs(fastTimesQuery);

    fastTimesSnapshot.forEach((doc) => {
      const puzzleDocRef = doc.ref;
      const fastTimes = doc.data().fastTimes;
      const updatedFastTimes = fastTimes.map((entry: any) => {
        if (entry.userId === currentUser.uid) {
          return { ...entry, username: newUsername };
        } else {
          return entry;
        }
      });

      batch.update(puzzleDocRef, { fastTimes: updatedFastTimes, lastupdated: currentTime });
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
        <div className="flex">
        <input
          type="text"
          value={usernameT}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={(e) => handleUsernameChange(e.target.value)}
        />
           <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600" onClick={() => handleUsernameChange(usernameT)}>Update Username</button>
        </div>
               <h1 className="text-3xl font-bold my-4">Statistics </h1>
               <div className="flex text-lg">    <Icon icon="mdi:play" width="20" /> Total Plays:  {totalplays} </div>
               <div className="flex text-lg">    <Icon icon="material-symbols:flag" width="20" /> Total Finishes:  {totalfinishes} </div>

        </main>
    </div>
  );
};

export default Profile;
