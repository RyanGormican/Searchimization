'use client'
import '/src/app/globals.css';
import { useState, useRef, useEffect } from "react";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { collection, doc, getDoc, updateDoc, increment, DocumentData } from 'firebase/firestore';
import { auth, firestore } from '../../src/app/firebase';

// Interface for each grid item
interface GridItem {
  letter: string;
  group: number;
  position: number;
  index: number;
  found: boolean;
}

// Interface for puzzle data
interface PuzzleData {
  theme: string;
}

const Play = () => {
  const router = useRouter();
  const { id } = router.query;

  // State for puzzle theme
  const [theme, setTheme] = useState<PuzzleData | null>(null);

  // State for grid content
  const [gridContent, setGridContent] = useState<GridItem[]>([]);

  // State for number of found words
  const [foundWords, setFoundWords] = useState<number>(0);

  // Reference for the grid div
  const gridRef = useRef<HTMLDivElement>(null);

  // State for selected letters
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);

  // State for mouse down event
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  // State for found indexes
  const [foundIndexes, setFoundIndexes] = useState<number[]>([]);

  useEffect(() => {
    const fetchPuzzleData = async () => {
      try {
        if (!id) return;

        // Fetch puzzle data from Firestore
        const puzzleDocRef = doc(firestore, 'puzzleList', id as string);
        const puzzleDoc = await getDoc(puzzleDocRef);
        const puzzleData = puzzleDoc.data() as PuzzleData;
        setTheme(puzzleData);

        // Update plays count
        await updateDoc(puzzleDocRef, {
          plays: increment(1)
        });

        // Fetch grid content for the puzzle
        const puzzleContentDoc = await getDoc(doc(firestore, 'puzzle', id as string));
        const gridContentData = puzzleContentDoc.data()?.gridContent as GridItem[]; 
        setGridContent(gridContentData);

      } catch (error) {
        console.error('Error fetching puzzle data:', error);
      }
    };

    fetchPuzzleData();
  }, [id]);

  // Reset selected letters
  const resetSelect = () => {
    setSelectedLetters([]);
  };

  // Mouse up event handler
  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  // Submit word handler
  const submitWord = () => {
    const selectedWordIndexes = [...selectedLetters];

    // Check if selected word is found
    for (let i = 0; i < gridContent.length; i++) {
      // Find word group
      const wordGroup: GridItem[] = [];
      let j = i;
      while (j < gridContent.length && gridContent[j].group === gridContent[i].group) {
        wordGroup.push(gridContent[j]);
        j++;
      }

      // Group indexes
      const groupIndexes: { [key: number]: number[] } = {};
      gridContent.forEach(({ group, index, position }) => {
        if (!groupIndexes[group]) {
          groupIndexes[group] = [];
        }
        groupIndexes[group].push(index);
      });

      // Sort group indexes
      for (const group in groupIndexes) {
        groupIndexes[group].sort((a, b) => {
          const posA = gridContent.find(item => item.index === a)?.position ?? 0;
          const posB = gridContent.find(item => item.index === b)?.position ?? 0;
          return posA - posB;
        });
      }

      // Check if selected word is found in any group
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

  // Click event handler for grid cells
  const handleClick = (index: number) => {
    if (!selectedLetters.includes(index)) {
      setSelectedLetters([...selectedLetters, index]);
    }
  };

  // Calculate maximum group number
  const maxGroup = Math.max(...gridContent.map(item => item.group));

  useEffect(() => {
    // Increment finishes count if all words are found
    if (foundWords > 0 && foundWords === maxGroup) {
      const incrementFinishes = async () => {
        try {
          const puzzleRef = doc(firestore, 'puzzleList', id as string);
          await updateDoc(puzzleRef, {
            finishes: increment(1)
          });
        } catch (error) {
          console.error('Error incrementing finishes:', error);
        }
      };
      incrementFinishes();
    }
  }, [foundWords, maxGroup, id]);

  return (
    <main className="flex min-h-screen items-center p-12 flex-col">
         <Link href="/">
        <div className="text-3xl font-bold mb-4">Searchimization</div>
      </Link>
      <div className="flex">
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
        <div>
          <Link href="/Puzzles">
            <button className="py-2 px-4 bg-blue-500 text-white rounded">PUZZLES</button>
          </Link>
        </div>
        <div>
          <Link href="/Create">
            <button className="py-2 px-4 bg-blue-500 text-white rounded">CREATE</button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col mb-8">
        <div className="font-bold mb-4 ">Your Theme</div>
        <div>{theme && theme.theme}</div>
        <div>{foundWords} of {maxGroup} theme words found</div>
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
    </main>
  );
}

export default Play;
