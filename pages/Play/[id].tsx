import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, firestore } from '../../src/app/firebase';
import Header from '../../src/app/Header';
import '/src/app/globals.css';
import WordSearchPlay from './WordSearchPlay';
import CrosswordPlay from './CrosswordPlay';
// Define interfaces for grid items and puzzle data
interface GridItem {
  letter: string;
  group: number;
  position: number;
  index: number;
  found: boolean;
}

interface PuzzleData {
  theme: string;
  gridContent: GridItem[];
  type: string;
}
// Interface for local storage
interface SearchimizationEntry {
  id: string;
}
// Define the main component
const Play = () => {
  // Access router and query parameters
  const router = useRouter();
  const { id } = router.query;

  // State variables for puzzle theme, grid content, found words, selected letters, mouse down state,
  // found indexes, start time, end time, and fast times
  const [theme, setTheme] = useState<PuzzleData | null>(null);
  const [type, setType] = useState<PuzzleData | null>(null);
  const [gridContent, setGridContent] = useState<GridItem[]>([]);
  const [foundWords, setFoundWords] = useState<number>(0);
  const [foundIndexes, setFoundIndexes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [fastTimes, setFastTimes] = useState<Array<{ time: number; username: string; userId: string }>>([]);

  // Reference for the grid div
  const gridRef = useRef<HTMLDivElement>(null);

  // Function to start the timer
  const startTimer = () => {
    setStartTime(Date.now());
  };

  // Function to stop the timer and update fast times
  const stopTimer = async () => {
    const currentTime = Date.now();
    if (startTime && currentTime > startTime) {
      const elapsedTime = currentTime - startTime;
      setEndTime(currentTime);
   // Grab username from local storage
    const storageData = localStorage.getItem('searchimization');
    const username = storageData ? JSON.parse(storageData)?.profile?.username : '';
        const puzzleRef = doc(firestore, 'puzzles', id as string);
        const puzzleDoc = await getDoc(puzzleRef);
        const puzzleData = puzzleDoc.data();
    if (auth.currentUser) {
      const timeData = { time: elapsedTime, username: username || 'Unknown', userId: auth.currentUser.uid };
        // Update fast times in Firestore
     
        const currentFastTimes = puzzleData?.fastTimes || [];

        const updatedFastTimes = [...currentFastTimes, timeData].sort((a, b) => a.time - b.time).slice(0, 10);
const searchimizationData = JSON.parse(localStorage.getItem('searchimization') || '{}');
        await updateDoc(puzzleRef, { fastTimes: updatedFastTimes, 
        finishes: increment(1),
        lastupdated: new Date().toISOString()
        });
        setFastTimes(updatedFastTimes);
         const updatedProfile = {
              ...searchimizationData.profile,
              sessionfinishes: (searchimizationData.profile.sessionfinishes || 0) + 1
            };
            localStorage.setItem('searchimization', JSON.stringify({ ...searchimizationData, profile: updatedProfile }));
      } else
    {
  await updateDoc(puzzleRef, { 
        finishes: increment(1),
        lastupdated: new Date().toISOString()
        });
    }

      
    } else {
      console.error("Invalid timer start or end time.");
    }
  };

  // Function to fetch puzzle data from Firestore
  const fetchPuzzleData = async () => {
  try {
    if (!id) return;

    // Check if puzzle data exists in local storage
const searchimizationData = JSON.parse(localStorage.getItem('searchimization') || '{}');

    if (searchimizationData && searchimizationData.entries) {
const puzzleFromStorage = searchimizationData.entries.find((entry: SearchimizationEntry) => entry.id === id);
      if (puzzleFromStorage) {
        setTheme(puzzleFromStorage);
        setType(puzzleFromStorage);
        setGridContent(puzzleFromStorage.gridContent); 
            const updatedProfile = {
              ...searchimizationData.profile,
              sessionplays: (searchimizationData.profile.sessionplays || 0) + 1
            };
            localStorage.setItem('searchimization', JSON.stringify({ ...searchimizationData, profile: updatedProfile }));

        // Increment plays count and update last updated timestamp
        const puzzleDocRef = doc(firestore, 'puzzles', id as string);
        await updateDoc(puzzleDocRef, {
          plays: increment(1),
          lastupdated: new Date().toISOString()
        });
        return;
      }
    }

    // Fetch puzzle data from Firestore if not found in local storage
    const puzzleDocRef = doc(firestore, 'puzzles', id as string);
    const puzzleDoc = await getDoc(puzzleDocRef);
    const puzzleData = puzzleDoc.data() as PuzzleData;
    setTheme(puzzleData);
    setType(puzzleData);
    setGridContent(puzzleData.gridContent); // Set grid content state

    // Save puzzle data to local storage
    const updatedEntries: SearchimizationEntry[] = searchimizationData.entries.map((entry: SearchimizationEntry) => entry.id === id ? puzzleData : entry);
    localStorage.setItem('searchimization', JSON.stringify({ ...searchimizationData, entries: updatedEntries }));
        const updatedProfile = {
              ...searchimizationData.profile,
              sessionplays: (searchimizationData.profile.sessionplays || 0) + 1
            };
            localStorage.setItem('searchimization', JSON.stringify({ ...searchimizationData, profile: updatedProfile }));

    // Increment plays count and update last updated timestamp
    await updateDoc(puzzleDocRef, {
      plays: increment(1),
      lastupdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching puzzle data:', error);
  }
};




 
  // Calculate maximum group number
const maxGroup = type && type.type === 'crossword' ? theme.groupings.length : Math.max(...gridContent.map(item => item.group));


  // Effect to fetch puzzle data and start the timer on component mount
  useEffect(() => {
    fetchPuzzleData();
    startTimer();
  }, [id]);

  // Effect to stop the timer when all words are found
  useEffect(() => {
    if (type&&type.type === 'wordsearch' && foundWords > 0 && foundWords === maxGroup) {
      stopTimer();
    }
  }, [foundWords]);


  return (
  <main className="flex min-h-screen items-center p-12 flex-col">
    <Header currentUser={auth.currentUser} />
    <div className="flex flex-col mb-4">
      <h1 className="font-bold">Your Theme</h1>
      <p className="mb-4">{theme && theme.theme}</p>
      {type && type.type === 'wordsearch' && (
       <WordSearchPlay gridContent={gridContent} foundWords={foundWords} setFoundWords={setFoundWords} maxGroup={maxGroup} gridRef={gridRef} foundIndexes={foundIndexes} setFoundIndexes={setFoundIndexes}/>
      )}
      {type && type.type === 'crossword' && (
       <CrosswordPlay gridContent={gridContent} foundWords={foundWords} setFoundWords={setFoundWords} maxGroup={maxGroup} gridRef={gridRef} foundIndexes={foundIndexes} setFoundIndexes={setFoundIndexes}   groupings={theme && theme.groupings}/>
      )}
    </div>
  </main>
);

}

export default Play;
