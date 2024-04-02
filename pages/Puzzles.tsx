import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, firestore } from '../src/app/firebase';
import '/src/app/globals.css';
import {  User} from 'firebase/auth';
import { useRouter } from 'next/router';
interface Puzzle {
  id: string;
  theme: string;
  plays: number;
  likes: number;
  finishes: number;
  userName: string;
}

const Puzzles: React.FC = () => {
  const router = useRouter();
  const [puzzleList, setPuzzleList] = useState<Puzzle[]>([]);
  const [sortBy, setSortBy] = useState<string>('theme'); // Default sorting by theme
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Default sorting order
    const [currentUser, setCurrentUser] = useState<User | null>(null); // State to store the current user
  const [filteredPuzzleList, setFilteredPuzzleList] = useState<Puzzle[]>([]); // State to store filtered puzzle list

  useEffect(() => {
    // Function to fetch current user
    const fetchCurrentUser = () => {
      const user = auth.currentUser;
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    // Function to filter puzzles based on current user
    const filterPuzzlesByCurrentUser = () => {
      if (currentUser) {
        const filteredPuzzles = puzzleList.filter(puzzle => puzzle.userName === currentUser.uid);
        setFilteredPuzzleList(filteredPuzzles);
      } else {
        // If no user is logged in, set filtered puzzle list to the original puzzle list
        setFilteredPuzzleList(puzzleList);
      }
    };

    filterPuzzlesByCurrentUser();
  }, [currentUser, puzzleList]);

  // JSX for filtered puzzle list
  const filteredPuzzleElements = filteredPuzzleList.map(puzzle => (
 
      <div className="block bg-gray-200 p-4 rounded hover:bg-gray-300">
        <button>{puzzle.theme}</button>
        <div className="flex">
          <Icon icon="mdi:play" width="20" /> {puzzle.plays}
          <Icon icon="mdi:heart" width="20" /> {puzzle.likes}
          <Icon icon="material-symbols:flag" width="20" /> {puzzle.finishes}
        </div>
      
      </div>
  
  ));

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        // Fetch puzzles from Firestore
        const querySnapshot = await getDocs(collection(firestore, 'puzzleList'));
        // Map Firestore documents to Puzzle objects
        const puzzles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Puzzle[];

        // Sort the puzzles array based on the selected sorting criteria
        const sortedPuzzles = puzzles.sort((a, b) => {
          if (sortBy === 'theme') {
            return sortOrder === 'asc' ? a.theme.localeCompare(b.theme) : b.theme.localeCompare(a.theme);
          } else if (sortBy === 'plays') {
            return sortOrder === 'asc' ? a.plays - b.plays : b.plays - a.plays;
          } else if (sortBy === 'likes') {
            return sortOrder === 'asc' ? a.likes - b.likes : b.likes - a.likes;
          } else if (sortBy === 'finishes') {
            return sortOrder === 'asc' ? a.finishes - b.finishes : b.finishes - a.finishes;
          } else if (sortBy === 'completionRatio') {
            const completionRatioA = a.finishes / a.plays;
            const completionRatioB = b.finishes / b.plays;
            return sortOrder === 'asc' ? completionRatioA - completionRatioB : completionRatioB - completionRatioA;
          } else if (sortBy === 'userName') {
            return sortOrder === 'asc' ? a.userName.localeCompare(b.userName) : b.userName.localeCompare(a.userName);
          }
          return 0; // Default case
        });

        setPuzzleList(sortedPuzzles);
      } catch (error) {
        console.error('Error fetching puzzles:', error);
      }
    };

    fetchPuzzles();
  }, [sortBy, sortOrder]);
   // Function to generate a random index within the range of the puzzleList length
  const getRandomIndex = () => {
    return Math.floor(Math.random() * puzzleList.length);
  };

  // Function to handle clicking on the dice block icon
  const handleRandomPuzzleClick = () => {
    const randomIndex = getRandomIndex();
    const randomPuzzleId = puzzleList[randomIndex].id;
    router.push(`/Play/${randomPuzzleId}`);
  };

  // Handler for changing the sorting criteria
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (value === sortBy) {
      // Toggle sorting order if the same option is selected again
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value);
      setSortOrder('asc'); // Reset sorting order when changing the sorting criteria
    }
  };

  return (
    <main className="flex min-h-screen items-center p-12 flex-col">
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
           {auth.currentUser &&
           <div>
        
          <Link href="/Create">
            <button className="py-2 px-4 bg-blue-500 text-white rounded">CREATE</button>
          </Link>
   
    
          <Link href="/Profile">
            <button className="py-2 px-4 bg-blue-500 text-white rounded">PROFILE</button>
          </Link>
      
        </div>
        }   
      </div>
   
      <div className="flex items-center mt-4">
        <label htmlFor="sortSelect" className="mr-2">Sort By:</label>
        {/* Dropdown for selecting sorting criteria */}
        <select id="sortSelect" value={sortBy} onChange={handleSortChange}>
          <option value="theme">Theme Name</option>
          <option value="plays">Plays</option>
          <option value="likes">Likes</option>
          <option value="finishes">Finishes</option>
          <option value="completionRatio">Completion Ratio</option>
          <option value="userName">Username</option>
        </select>
        {/* Button to toggle sorting order */}
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? '^' : 'V'}
        </button>
      </div>
      {auth.currentUser &&
      <div>
  <span style={{ display: 'block', margin: '0 auto', textAlign: 'center', width: 'fit-content' }}>Your Puzzles</span>

          <div className="grid grid-cols-3 gap-4">
        {filteredPuzzleElements}
      </div>
      </div>
      }
      <span> Community Puzzles </span>
        <div className="flex justify-center mt-4">
      <Icon icon="ion:dice" width="50" onClick={handleRandomPuzzleClick} style={{ cursor: 'pointer' }} />
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