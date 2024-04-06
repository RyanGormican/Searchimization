import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../src/app/Header';
import { auth, firestore } from '../src/app/firebase';
import { collection, getDoc, setDoc, where, query, doc, getDocs, orderBy, limit } from 'firebase/firestore';
import '/src/app/globals.css';
import { Icon } from '@iconify/react';

interface LeaderboardUser {
  id: string;
  username: string;
  totalfinishes: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const leaderboardRef = collection(firestore, 'users');
      const leaderboardQuery = query(leaderboardRef, orderBy('totalfinishes', 'desc'), limit(10)); 
      const snapshot = await getDocs(leaderboardQuery);
      const leaderboardData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaderboardUser));
      setLeaderboard(leaderboardData);
    };

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

