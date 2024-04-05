import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { collection, getDocs, query, where, orderBy, limit, startAt } from 'firebase/firestore';
import { auth, firestore } from '../src/app/firebase';
import '/src/app/globals.css';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import Header from '../src/app/Header';

interface Puzzle {
  id: string;
  theme: string;
  plays: number;
  likes: number;
  finishes: number;
  userName: string;
  lastupdated: string; 
}

const Puzzles: React.FC = () => {
  const router = useRouter();
  const [puzzleList, setPuzzleList] = useState<Puzzle[]>([]);
  const [sortBy, setSortBy] = useState<string>('theme'); // Default sorting by theme
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Default sorting order
  const [filteredPuzzleList, setFilteredPuzzleList] = useState<Puzzle[]>([]); // State to store filtered puzzle list

  // Function to fetch puzzles
const fetchPuzzles = async () => {
  try {
    const storageData = localStorage.getItem('searchimization');
    let puzzlesFromStorage: { profile: { username: string }; entries: Puzzle[] } | null = null;

    if (storageData) {
      puzzlesFromStorage = JSON.parse(storageData);
    }

    if (puzzlesFromStorage.entries.length === 0) {
      // If there are no entries in storage, fetch the latest 9 puzzles
      const querySnapshot = await getDocs(collection(firestore, 'puzzles'), orderBy('timecreated', 'desc'), limit(9));
      const puzzles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Puzzle[];

      localStorage.setItem('searchimization', JSON.stringify({ ...puzzlesFromStorage, entries: puzzles }));
      setPuzzleList(puzzles);
    } else {
      // If there are entries in storage, find the latest lastupdated timestamp
      const latestLastUpdated = new Date(Math.max(...puzzlesFromStorage.entries.map(puzzle => new Date(puzzle.lastupdated).getTime()))).toISOString();

      const querySnapshot = await getDocs(query(collection(firestore, 'puzzles'), where('lastupdated', '>', latestLastUpdated), limit(9)));

      const newPuzzles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Puzzle[];

      if (newPuzzles.length > 0) {
        // Update the existing entries with new puzzles
        const updatedEntries = [...puzzlesFromStorage.entries];
        newPuzzles.forEach(newPuzzle => {
          const existingIndex = updatedEntries.findIndex(entry => entry.id === newPuzzle.id);
          if (existingIndex !== -1) {
            // If puzzle exists, update it
            updatedEntries[existingIndex] = newPuzzle;
          } else {
            // If puzzle doesn't exist, append it
            updatedEntries.push(newPuzzle);
          }
        });

        localStorage.setItem('searchimization', JSON.stringify({ ...puzzlesFromStorage, entries: updatedEntries }));
        setPuzzleList(updatedEntries.slice(0, 9));
      } else {
        setPuzzleList(puzzlesFromStorage.entries);
      }
    }
  } catch (error) {
    console.error('Error fetching puzzles:', error);
  }
};

  useEffect(() => {
    fetchPuzzles();
  }, []);



  return (
    <main className="flex min-h-screen items-center p-12 flex-col">
      <Header currentUser={auth.currentUser} />
      <span> Community Puzzles </span>
      <div className="flex justify-center mt-4">
  
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Display sorted puzzle list */}
        {puzzleList.map((puzzle) => (
          <Link key={puzzle.id} href={`/Play/${puzzle.id}`}>
            <div className="block bg-gray-200 p-4 rounded hover:bg-gray-300">
              <button>{puzzle.theme}</button>
              <div className="flex">
                <Icon icon="mdi:play" width="20" /> {puzzle.plays}
                <Icon icon="mdi:heart" width="20" /> {puzzle.likes}
                <Icon icon="material-symbols:flag" width="20" /> {puzzle.finishes}
              </div>
              <div className="flex">
                <Icon icon="mdi:user" width="20" /> {puzzle.userName}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Puzzles;
