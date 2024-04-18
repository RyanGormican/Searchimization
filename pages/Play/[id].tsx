import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, firestore } from '../../src/app/firebase';
import Header from '../../src/app/Header';
import '/src/app/globals.css';

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
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
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


  // Event handler for mouse up
  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  // Event handler for clicking grid cells
  const handleClick = (index: number) => {
    if (!selectedLetters.includes(index)) {
      setSelectedLetters([...selectedLetters, index]);
    }
  };

  // Function to submit a word
  const submitWord = () => {
    const selectedWordIndexes = [...selectedLetters];

    // Iterate through each grid item to find the selected word
    for (let i = 0; i < gridContent.length; i++) {
      const wordGroup: GridItem[] = [];
      let j = i;
      while (j < gridContent.length && gridContent[j].group === gridContent[i].group) {
        wordGroup.push(gridContent[j]);
        j++;
      }

      // Group indexes for each group
      const groupIndexes: { [key: number]: number[] } = {};
      gridContent.forEach(({ group, index, position }) => {
        if (!groupIndexes[group]) {
          groupIndexes[group] = [];
        }
        groupIndexes[group].push(index);
      });

      // Sort group indexes by position
      for (const group in groupIndexes) {
        groupIndexes[group].sort((a, b) => {
          const posA = gridContent.find(item => item.index === a)?.position ?? 0;
          const posB = gridContent.find(item => item.index === b)?.position ?? 0;
          return posA - posB;
        });
      }

      // Check if the selected word matches any group
      for (const group in groupIndexes) {
        const groupIndex = groupIndexes[group];

        if (
          selectedWordIndexes.length === groupIndex.length &&
          JSON.stringify(selectedWordIndexes) === JSON.stringify(groupIndex) &&
          !wordGroup.some((item) => item.found) &&
          !selectedWordIndexes.some((index) => foundIndexes.includes(index))
        ) {
          const foundWordIndexes = selectedWordIndexes.map((index) => gridContent[index].index);
          setFoundIndexes([...foundIndexes, ...foundWordIndexes]);
          setFoundWords(foundWords + 1);
          setSelectedLetters([]);
          return;
        }
      }
    }
    setSelectedLetters([]);
  };

  // Function to reset selected letters
  const resetSelect = () => {
    setSelectedLetters([]);
  };

  // Calculate maximum group number
  const maxGroup = Math.max(...gridContent.map(item => item.group));

  // Effect to fetch puzzle data and start the timer on component mount
  useEffect(() => {
    fetchPuzzleData();
    startTimer();
  }, [id]);

  // Effect to stop the timer when all words are found
  useEffect(() => {
    if (foundWords > 0 && foundWords === maxGroup) {
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
      <div>
        <div>
          <h2>
            <p>{foundWords} of {maxGroup} theme words found</p>
          </h2>
          <div style={{ minHeight: "50px", maxHeight: "50px" }}>
            {selectedLetters.length > 0 && (
              <div>
                {selectedLetters.map((index) => (
                  <span key={index} className={foundIndexes.includes(index) ? "bg-blue-200" : ""}>
                    {gridContent[index].letter}
                  </span>
                ))}
                <div>
                  <button className="text-l font-bold mb-8 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out" onClick={submitWord}>
                    Submit
                  </button>
                  <button className="text-l font-bold mb-8 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out" onClick={resetSelect}>
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
         <div ref={gridRef} className="grid grid-cols-6 grid-rows-8 gap-4" onMouseUp={handleMouseUp}>
        {gridContent.map(({ letter, group, position, index }) => (
          <div
            key={index}
            className={` ${selectedLetters.includes(index) ? "bg-gray-500" : ""}`}
            onClick={() => handleClick(index)}
          >
            <div className={foundIndexes.includes(index) ? "bg-blue-200" : ""}>
              {letter}
            </div>
          </div>
        ))}
      </div>
      </div>
      )}
     
    </div>
  </main>
);

}

export default Play;
