import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { signOut } from 'firebase/auth';
import { auth, firestore } from './firebase';
import { User } from 'firebase/auth';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import Feedback from './components/Feedback/Feedback';

interface HeaderProps {
  currentUser: User | null;
}

const Header: React.FC<HeaderProps> = ({ currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      const userDocRef = doc(firestore, 'users', userId);

      // Get the document snapshot
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const searchimizationData = JSON.parse(localStorage.getItem('searchimization') || '{}');
        const { sessionplays = 0, sessionfinishes = 0 } = searchimizationData.profile || {};

        const newTotalplays = (userData.totalplays || 0) + sessionplays;
        const newTotalfinishes = (userData.totalfinishes || 0) + sessionfinishes;

        const updateData: { [key: string]: any } = {
          totalplays: newTotalplays,
          totalfinishes: newTotalfinishes,
        };

        if (searchimizationData.profile) {
          Object.entries(searchimizationData.profile).forEach(([key, value]) => {
            if (typeof value === 'number') {
              if (key.endsWith('P') || key.endsWith('F')) {
                updateData[key] = (userData[key] || 0) + value;
              }
            }
          });
        }

        if (searchimizationData.sessionplays > 0) {
          await updateDoc(userDocRef, updateData);
        }

        localStorage.removeItem('searchimization');
        await signOut(auth);
        window.location.href = '/Home';
      }
    }
  } catch (error) {
    console.error('Error handling logout:', error);
  }
};


  const toggleFeedbackModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="flex justify-between items-center p-12 flex-col">
      <Link href="/Home">
        <div className="text-6xl font-bold mb-4 title">Searchimization</div>
      </Link>
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
       <div className="cursor-pointer" onClick={toggleFeedbackModal}>
  <Icon icon="material-symbols:feedback" width="60" />
</div>
      </div>

      <div className="flex">
        <div>
          <Link href="/Puzzles">
            <button className="py-3 px-3 bg-blue-500 text-white border border-white">PUZZLES</button>
          </Link>
        </div>
        <div>
          <Link href="/Leaderboard">
            <button className="py-3 px-3 bg-blue-500 text-white border border-white">LEADERBOARD</button>
          </Link>
        </div>
        {currentUser && (
          <div>
            <Link href="/Create">
              <button className="py-3 px-3 bg-blue-500 text-white border border-white">CREATE</button>
            </Link>
            <Link href="/Profile">
              <button className="py-3 px-3 bg-blue-500 text-white border border-white">PROFILE</button>
            </Link>
            <div className="logout">
              <button onClick={handleLogout} aria-label="Logout">
                <Icon icon="material-symbols:logout" height="60" />
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && <Feedback isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
    </header>
  );
};

export default Header;
