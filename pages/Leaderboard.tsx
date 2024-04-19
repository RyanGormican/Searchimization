import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../src/app/Header';
import { auth, firestore } from '../src/app/firebase';
import { collection, getDoc, setDoc, where, query, doc, getDocs, updateDoc, orderBy, limit } from 'firebase/firestore';
import '/src/app/globals.css';
import { Icon } from '@iconify/react';

interface LeaderboardUser {
  id: string;
  username: string;
  totalfinishes: number;
}
// Define SearchimizationData type
interface SearchimizationData {
  profile: {
    username: string;
    totalplays: number; 
    totalfinishes: number;
    sessionplays: number;
    sessionfinishes: number;
  };

}
const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

  // Fetch leaderboard data when mounted
  useEffect(() => {
  // Update local session values for user
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
    if (    searchimizationData.profile.sessionplays > 0)
    {
    await updateDoc(userDocRef, updateData);
    }
    // Reset session values in local storage
    searchimizationData.profile.sessionplays = 0;
    searchimizationData.profile.sessionfinishes = 0;
    searchimizationData.profile.totalfinishes = newTotalfinishes;
    searchimizationData.profile.totalplays = newTotalplays;
    localStorage.setItem('searchimization', JSON.stringify(searchimizationData));
  }
};


    const fetchLeaderboard = async () => {
      const leaderboardRef = collection(firestore, 'users');
      const leaderboardQuery = query(leaderboardRef, orderBy('totalfinishes', 'desc'), limit(10)); // Grab the 10 users with the highest total finishes
      const snapshot = await getDocs(leaderboardQuery);
      const leaderboardData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaderboardUser));
      setLeaderboard(leaderboardData);
    };
    updateSessionValues();
    fetchLeaderboard();
  }, []);

  const renderRankIcon = (index: number): string => {
    if (index === 0) return 'twemoji:1st-place-medal';
    if (index === 1) return 'twemoji:2nd-place-medal';
    if (index === 2) return 'twemoji:3rd-place-medal';
    if (index >= 3 && index <= 9) return 'material-symbols:trophy';
    return 'twemoji:medal';
  };

  return (
    <div>
      <Header currentUser={auth.currentUser} />
      <main className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold my-4">Total Finishes</h1>
        <div className="grid justify-center gap-4">
          {leaderboard.map((user, index) => (
            <div key={user.id} className="flex items-center border p-4 rounded-lg">
              <div className="mr-4">
                <Icon icon={renderRankIcon(index)} width={60} />
              </div>
              <div>
                <span className="flex items-center">
                    <Icon icon="mdi:user" width={20} />
                    <p className="ml-2">{user.username}</p>
                </span>
                <span className="flex items-center">
                    <Icon icon="material-symbols:flag" width={20} />
                    <p className="ml-2">{user.totalfinishes}</p>
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
export default Leaderboard;


