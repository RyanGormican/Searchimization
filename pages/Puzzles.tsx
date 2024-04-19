import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { collection, getDocs, query, where, orderBy, limit, startAt } from 'firebase/firestore';
import { auth, firestore } from '../src/app/firebase';
import '/src/app/globals.css';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import Header from '../src/app/Header';
import {playRandom} from '../src/app/Random'
interface Puzzle {
  id: string;
  puzzleId: string;
  theme: string;
  type:string;
  plays: number;
  likes: number;
  finishes: number;
  userName: string;
  lastupdated: string;
  fastTimes?: Array<{ time: number; username: string; userId: string }>; 
}

const Puzzles: React.FC = () => {
  const router = useRouter();
  const [puzzleList, setPuzzleList] = useState<Puzzle[]>([]);
  const [sortBy, setSortBy] = useState<string>('theme'); // Default sorting by theme
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Default sorting order
  const [filteredPuzzleList, setFilteredPuzzleList] = useState<Puzzle[]>([]); // State to store filtered puzzle list
  const [hoveredPuzzleId, setHoveredPuzzleId] = useState<string | null>(null); // State variable to store the ID of the hovered puzzle
  const [numberPuzzles, setNumberPuzzles] = useState('10');
  // Function to fetch puzzles
const fetchPuzzles = async () => {
  try {
    const storageData = localStorage.getItem('searchimization');
    let puzzlesFromStorage: { profile: { username: string }; entries: Puzzle[] } | null = null;

    if (storageData) {
      puzzlesFromStorage = JSON.parse(storageData);
    }

    if (puzzlesFromStorage && puzzlesFromStorage.entries.length === 0) {
      // If there are no entries in storage, fetch the latest 9 puzzles
      const querySnapshot = await getDocs(query(collection(firestore, 'puzzles'), orderBy('timecreated', 'desc'), limit(9)));
const puzzles = querySnapshot.docs.map((doc) => ({
  puzzleId: doc.id, 
  ...doc.data(),
})) as Puzzle[];

      localStorage.setItem('searchimization', JSON.stringify({ ...puzzlesFromStorage, entries: puzzles }));
      setPuzzleList(puzzles);
    } else {
      // If there are entries in storage and puzzlesFromStorage is not null
      if (puzzlesFromStorage) {
        // Find the latest lastupdated timestamp
        const latestLastUpdated = new Date(Math.max(...puzzlesFromStorage.entries.map(puzzle => new Date(puzzle.lastupdated).getTime()))).toISOString();
        
        const querySnapshot = await getDocs(query(collection(firestore, 'puzzles'), where('lastupdated', '>', latestLastUpdated), limit(9)));

        const newPuzzles = querySnapshot.docs.map((doc) => ({
  puzzleId: doc.id, 
  ...doc.data(),
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
    }
  } catch (error) {
    console.error('Error fetching puzzles:', error);
  }
};


  useEffect(() => {
  fetchPuzzles();
  }, []);

// Function to convert time to a human-readable format
const convertTime = (time: number): string => {
  // Convert milliseconds to minutes, seconds, and milliseconds
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor(time % 1000);

  // Format the time as "Minutes:Seconds:Milliseconds"
  return `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
};

  return (
    <main className="flex min-h-screen items-center p-12 flex-col">
      <Header currentUser={auth.currentUser} />
      <h1 className="flex justify-center"> Community Puzzles     <Icon onClick={playRandom} icon="ion:dice" width="30" /> </h1>
      <div className="grid grid-cols-3 gap-4">
        {/* Display sorted puzzle list */}
        {puzzleList.map((puzzle) => (
          <div
            key={puzzle.puzzleId}
            className="relative"
            onMouseEnter={() => setHoveredPuzzleId(puzzle.puzzleId)}
            onMouseLeave={() => setHoveredPuzzleId(null)}
          >
            <Link href={`/Play/${puzzle.puzzleId}`}>
              <div className="block bg-gray-200 p-4 rounded hover:bg-gray-300">
                <p>{puzzle.theme} </p>

                <div className="flex">
                  <Icon icon="mdi:play" width="20" /> {puzzle.plays}
                  <div style={{ display: 'none' }}>
                    <Icon icon="mdi:heart" width="20" /> {puzzle.likes}{' '}
                  </div>
                  <Icon icon="material-symbols:flag" width="20" /> {puzzle.finishes}
                  {puzzle.type === 'crossword' && <Icon icon="material-symbols:crossword" width="20" />}
                {puzzle.type === 'wordsearch' && <Icon icon="lucide:text-search" width="20" />}
                </div>
                <div className="flex">
                  <Icon icon="mdi:user" width="20" /> <p> {puzzle.userName} </p>
                </div>
              </div>
            </Link>
            {/* Display top 10 times when hovering over the puzzle */}
      {hoveredPuzzleId === puzzle.puzzleId && puzzle.fastTimes && (
  <div className="absolute top-0 left-0 bg-white p-4 rounded shadow-md" style={{ zIndex: '9000' }}>
    <Link href={`/Play/${hoveredPuzzleId}`}>
      <h3 className="font-semibold mb-2">{puzzle.theme}</h3>
      {puzzle.fastTimes.map((time, index) => (
        <div key={index} className="mb-1">
          <span>{index + 1}. </span>
          <span>{time.username}: {convertTime(time.time)}</span>
        </div>
      ))}
    </Link>
  </div>
)}

          </div>
        ))}
      </div>

    </main>
  );
};

export default Puzzles;
