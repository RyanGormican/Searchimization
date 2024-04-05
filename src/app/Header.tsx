// Header.tsx
import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { signOut } from 'firebase/auth';
import { auth, firestore } from './firebase';
import { User } from 'firebase/auth';
interface HeaderProps {
  currentUser: User  | null;
}

const Header: React.FC<HeaderProps> = ({ currentUser }) => {
  const handleLogout = () => {
    localStorage.removeItem('searchimization');
    signOut(auth);
  };

  return (
    <header className="flex justify-between items-center p-12 flex-col">
      <Link href="/">
        <div className="text-3xl font-bold mb-4">Searchimization</div>
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
      </div>
      <div className="flex">
        <div>
          <Link href="/Puzzles">
            <button className="py-2 px-4 bg-blue-500 text-white rounded">PUZZLES</button>
          </Link>
        </div>
        {currentUser && (
          <div>
            <Link href="/Create">
              <button className="py-2 px-4 bg-blue-500 text-white rounded">CREATE</button>
            </Link>
            <Link href="/Profile">
              <button className="py-2 px-4 bg-blue-500 text-white rounded">PROFILE</button>
            </Link>
            <div className="logout">
              <Icon onClick={handleLogout} icon="material-symbols:logout" height="60" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
.
export default Header;
