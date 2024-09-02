import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { signOut } from 'firebase/auth';
import { auth, firestore } from './firebase';
import { User } from 'firebase/auth';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import Feedback from './components/Feedback/Feedback';
import { useRouter } from 'next/router';

interface HeaderProps {
  currentUser: User | null;
}

const Header: React.FC<HeaderProps> = ({ currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        const userId = firebaseUser.uid;
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

          Object.entries(searchimizationData.profile).forEach(([key, value]) => {
            if (typeof value === 'number') {
              if (key.endsWith('P') || key.endsWith('F')) {
                updateData[key] = (userData[key] || 0) + value;
              }
            }
          });

          if (searchimizationData.sessionplays > 0) {
            await updateDoc(userDocRef, updateData);
          }

          localStorage.removeItem('searchimization');
          await signOut(auth);
          router.push('/Home');
        } else {
          // If user document doesn't exist, still sign out
          await signOut(auth);
          router.push('/Home');
        }
      } else {
        // If no user is signed in, redirect to home
        router.push('/Home');
      }
    } catch (error) {
      console.error('Error handling logout:', error);
      alert('An error occurred during logout. Please try again.');
    }
  };

  const toggleFeedbackModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="flex justify-between items-center p-12 flex-col">
      <Link href="/Home">
        <div className="text-6xl font-bold mb-4 title cursor-pointer">Searchimization</div>
      </Link>
      <div className="links flex space-x-4 mb-4">
        <a href="https://www.linkedin.com/in/ryangormican/" target="_blank" rel="noopener noreferrer">
          <Icon icon="mdi:linkedin" color="#0e76a8" width="60" />
        </a>
        <a href="https://github.com/RyanGormican/Searchimization" target="_blank" rel="noopener noreferrer">
          <Icon icon="mdi:github" color="#e8eaea" width="60" />
        </a>
        <a href="https://ryangormicanportfoliohub.vercel.app/" target="_blank" rel="noopener noreferrer">
          <Icon icon="teenyicons:computer-outline" color="#199c35" width="60" />
        </a>
        <div className="cursor-pointer" onClick={toggleFeedbackModal}>
          <Icon icon="material-symbols:feedback" width="60" />
        </div>
      </div>

      <div className="flex space-x-4">
        <Link href="/Puzzles">
          <button className="py-3 px-6 bg-blue-500 text-white border border-white rounded">PUZZLES</button>
        </Link>
        <Link href="/Leaderboard">
          <button className="py-3 px-6 bg-blue-500 text-white border border-white rounded">LEADERBOARD</button>
        </Link>
        {currentUser && (
          <>
            <Link href="/Create">
              <button className="py-3 px-6 bg-blue-500 text-white border border-white rounded">CREATE</button>
            </Link>
            <Link href="/Profile">
              <button className="py-3 px-6 bg-blue-500 text-white border border-white rounded">PROFILE</button>
            </Link>
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="py-3 px-6 bg-red-500 text-white border border-white rounded flex items-center"
            >
              <Icon icon="material-symbols:logout" height="24" width="24" />
              <span className="ml-2">Logout</span>
            </button>
          </>
        )}
      </div>

      {isModalOpen && <Feedback isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
    </header>
  );
};

export default Header;
