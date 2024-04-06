import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { signOut } from 'firebase/auth';
import { auth, firestore } from './firebase';
import { User } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

interface Feedback {
  name: string;
  suggestion: string;
  time: string;
  resolved: boolean;
}

interface HeaderProps {
  currentUser: User | null;
}

const Header: React.FC<HeaderProps> = ({ currentUser }) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [name, setName] = useState<string>('');
  const [suggestion, setSuggestion] = useState<string>('');

  const handleLogout = () => {
    localStorage.removeItem('searchimization');
    signOut(auth);
  };

  const toggleFeedbackModal = () => {
    setShowFeedbackModal(!showFeedbackModal);
  };

 const submitFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault(); 
  
  try {
    const feedbackData: Feedback = {
      name: name || 'Anonymous',
      suggestion,
      time: new Date().toISOString(),
      resolved: false,
    };

    const feedbackRef = collection(firestore, 'feedback');
    await addDoc(feedbackRef, feedbackData);

    setName('');
    setSuggestion('');
    toggleFeedbackModal(); 
  } catch (error) {
    console.error('Error submitting feedback:', error);
  }
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
        <div className="cursor-pointer" onClick={toggleFeedbackModal}>
          <Icon icon="material-symbols:feedback"  width="60" />
        </div>
      </div>
      <div>
            <Link href="/Puzzles">
              <button className="py-2 px-4 bg-blue-500 text-white rounded">PUZZLES</button>
            </Link>
      </div>
      <div className="flex">
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

      {showFeedbackModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center" onClick={toggleFeedbackModal}>
          <div className="bg-white p-8 rounded-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Feedback</h2>
            <form onSubmit={(event) => submitFeedback(event)}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name (optional)</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700">Suggestion</label>
                <textarea
                  id="suggestion"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-lg"
                  rows={4}
                ></textarea>
              </div>
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">Submit</button>
            </form>
            <div className="absolute top-4 right-4 cursor-pointer" onClick={toggleFeedbackModal}>
              <Icon icon="bi:x-circle-fill" color="#888" width="24" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
